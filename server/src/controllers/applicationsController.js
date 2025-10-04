import { query } from '../db/pool.js';

export async function listApplicationsHandler(req, res) {
  const { page = '1', pageSize = '25', status, search, batchId } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10) || 25));

  const where = [];
  const params = [];
  let i = 1;

  if (status) {
    where.push(`status = $${i++}`);
    params.push(status);
  }
  if (batchId) {
    where.push(`batch_id = $${i++}`);
    params.push(batchId);
  }
  if (search) {
    where.push(`(owner_name ILIKE $${i} OR proposal_number ILIKE $${i} OR service_name ILIKE $${i})`);
    params.push(`%${search}%`);
    i++;
  }

  const whereSql = where.length ? `where ${where.join(' and ')}` : '';

  const data = await query(
    `select id, batch_id, sr_no, proposal_number, proposal_code, transaction_date,
            service_name, owner_name, site_address, pending_by, designation,
            application_received_date, days, status, created_at
       from applications
       ${whereSql}
       order by created_at desc
       limit $${i} offset $${i + 1}`,
    [...params, sizeNum, (pageNum - 1) * sizeNum],
  );

  const total = await query(`select count(*) from applications ${whereSql}`, params);

  res.json({ items: data.rows, total: Number(total.rows[0].count), page: pageNum, pageSize: sizeNum });
}

export async function statsHandler(_req, res) {
  const byStatus = await query(
    `select status, count(*)::int as count from applications group by status order by count desc`,
  );
  const totals = await query(
    `select count(*)::int as total,
            sum(case when status='Completed' then 1 else 0 end)::int as completed,
            sum(case when status in ('Pending','Overdue','Critical','DueToday','Unknown') then 1 else 0 end)::int as pending
       from applications`,
  );
  res.json({ byStatus: byStatus.rows, totals: totals.rows[0] });
}
