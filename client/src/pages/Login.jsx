import { useState } from 'react';
import { useStore } from '../store';
import { strings } from '../i18n';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const setToken = useStore((s) => s.setToken);
  const t = strings[lang];

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="lang">
        <span>{strings.en.english} / {strings.mr.marathi}</span>
        <span className="toggle" onClick={() => setLang(lang === 'en' ? 'mr' : 'en')} />
      </div>
      <div className="card">
        <div className="brand">
          <div className="logo"><span>SM</span></div>
        </div>
        <div className="title">{t.adminLogin}</div>
        <form onSubmit={onSubmit}>
          <div className="input" style={{ marginBottom: 10 }}>
            <input placeholder={t.username} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input">
            <input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: 'crimson', marginTop: 8, fontSize: 13 }}>{error}</div>}
          <button className="btn" disabled={loading}>{loading ? '...' : t.login}</button>
        </form>
        <a className="link" href="#">{t.forgot}</a>
      </div>
    </div>
  );
}
