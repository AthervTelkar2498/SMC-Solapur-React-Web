import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import { strings } from '../i18n';

function Badge({ status }) {
  const map = {
    Pending: 'badge pending',
    Completed: 'badge completed',
    Overdue: 'badge overdue',
    Critical: 'badge overdue',
    DueToday: 'badge pending',
    Unknown: 'badge',
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
}

export default function Dashboard() {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const token = useStore((s) => s.token);
  const t = strings[lang];

  const [stats, setStats] = useState({ totals: { total: 0, completed: 0, pending: 0 }, byStatus: [] });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [file, setFile] = useState();

  async function fetchStats() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  }

  async function fetchTable() {
    const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/applications`);
    if (q) url.searchParams.set('search', q);
    if (status) url.searchParams.set('status', status);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(data.items);
    setTotal(data.total);
  }

  useEffect(() => {
    fetchStats();
    fetchTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpload() {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('batchName', 'SMC Batch');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Upload failed');
      return;
    }
    await fetchStats();
    await fetchTable();
  }

  const completedPercent = useMemo(() => {
    if (!stats.totals.total) return 0;
    return Math.round((stats.totals.completed / stats.totals.total) * 100);
  }, [stats]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="app-brand">
          <div className="circle">SM</div>
          <div>SMC</div>
        </div>
        <div className="nav">
          <a className="active" href="#">Dashboard</a>
          <a href="#">Upload Excel</a>
          <a href="#">Pending Work</a>
          <a href="#">Completed Work</a>
          <a href="#">Reports & Analytics</a>
        </div>
      </aside>
      <div>
        <header className="header">
          <strong>{strings[lang].appTitle}</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{strings.en.english}</span> / <span>{strings.mr.marathi}</span>
            <span className="toggle" onClick={() => setLang(lang === 'en' ? 'mr' : 'en')} />
            <div style={{ marginLeft: 12 }}>Admin User</div>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
          </div>
        </header>
        <main className="main">
          <div className="cards">
            <div className="stat">
              <div>Total Proposals</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.totals.total}</div>
            </div>
            <div className="stat">
              <div>Completed Work</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.totals.completed}</div>
            </div>
            <div className="stat">
              <div>Pending Work</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.totals.pending}</div>
            </div>
            <div className="stat">
              <div>Completed %</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{completedPercent}%</div>
            </div>
            <div className="stat">
              <div>Upload Excel</div>
              <div className="toolbar">
                <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0])} />
                <button onClick={onUpload}>Upload</button>
              </div>
            </div>
          </div>

          <div className="table" style={{ marginTop: 18 }}>
            <div className="toolbar">
              <input placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option>Pending</option>
                <option>Overdue</option>
                <option>Critical</option>
                <option>DueToday</option>
                <option>Completed</option>
              </select>
              <button onClick={fetchTable}>Filter</button>
              <div style={{ marginLeft: 'auto' }}>Total: {total}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Sr. no.</th>
                  <th>Proposal no</th>
                  <th>Service Name</th>
                  <th>Owner Name</th>
                  <th>Site Address</th>
                  <th>Pending By</th>
                  <th>Designation</th>
                  <th>Received</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.sr_no}</td>
                    <td>{r.proposal_number}</td>
                    <td>{r.service_name}</td>
                    <td>{r.owner_name}</td>
                    <td>{r.site_address}</td>
                    <td>{r.pending_by}</td>
                    <td>{r.designation}</td>
                    <td>{r.application_received_date?.slice(0,10)}</td>
                    <td>{r.days}</td>
                    <td><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
