import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import { useStore } from './store';
import { strings } from './i18n';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function RequireAuth({ children }) {
  const token = useStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const lang = useStore((s) => s.lang);
  const t = strings[lang];
  document.title = t.appTitle;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
