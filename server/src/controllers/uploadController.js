import xlsx from 'xlsx';
import dayjs from 'dayjs';
import { query } from '../db/pool.js';

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function deriveStatus(days, explicitLabel) {
  if (explicitLabel) {
    const normalized = explicitLabel.toLowerCase();
    if (normalized.includes('pending')) return 'Pending';
    if (normalized.includes('complete')) return 'Completed';
    if (normalized.includes('overdue')) return 'Overdue';
  }
  const n = Number(days);
  if (Number.isFinite(n)) {
    if (n < 0) return 'Completed';
    if (n === 0) return 'DueToday';
    if (n > 0 && n <= 7) return 'Pending';
    if (n > 7 && n <= 60) return 'Overdue';
    if (n > 60) return 'Critical';
  }
  return 'Unknown';
}

export async function uploadExcelHandler(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;

    const batchName = req.body?.batchName || `${dayjs().format('YYYY-MM-DD')}`;
    const batch = await query(
      'insert into batches(name, start_date) values($1, $2) returning id',
      [batchName, dayjs().toDate()],
    );
    const batchId = batch.rows[0].id;

    let inserted = 0;

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: false });

      for (const row of json) {
        // Normalize headers
        const normalized = {};
        for (const [key, value] of Object.entries(row)) {
          normalized[normalizeHeader(key)] = value;
        }

        const days = normalized['days'] ?? normalized['day_count'] ?? normalized['day_courk'];
        const status = deriveStatus(days, normalized['remark'] || normalized['status']);

        const transactionDate = normalized['transaction_date']
          ? dayjs(normalized['transaction_date']).format('YYYY-MM-DD')
          : null;
        const receivedDate = normalized['application_received_date']
          ? dayjs(normalized['application_received_date']).format('YYYY-MM-DD')
          : null;

        await query(
          `insert into applications(
            batch_id, sr_no, proposal_number, proposal_code, transaction_date,
            service_name, owner_name, site_address, pending_by, designation,
            application_received_date, days, status, raw
          ) values(
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
          )`,
          [
            batchId,
            normalized['sr_no'] ?? normalized['sr_no.'] ?? null,
            normalized['proposal_number'] ?? null,
            normalized['proposal_code'] ?? null,
            transactionDate,
            normalized['service_name'] ?? null,
            normalized['owner_name'] ?? null,
            normalized['site_address'] ?? null,
            normalized['pending_by'] ?? null,
            normalized['designation'] ?? null,
            receivedDate,
            days != null ? Number(days) : null,
            status,
            normalized,
          ],
        );
        inserted += 1;
      }
    }

    res.json({ ok: true, batchId, inserted });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
}
