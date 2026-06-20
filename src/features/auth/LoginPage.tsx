import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { login } from '../../api/auth';
import th from '../../i18n/th';
import styles from './LoginPage.module.css';

// Demo account seeded by the backend (npm run seed) — lets visitors try the app
// without signing in. See the `demo` branch.
const DEMO_EMAIL = 'vet@asiapet.local';
const DEMO_PASSWORD = 'asiapet123';

export default function LoginPage() {
  const { isAuthenticated, setAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function doLogin(creds: { email: string; password: string }) {
    setError('');
    setLoading(true);
    try {
      const res = await login(creds);
      setAuth(res.token, res.user);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : th.loginError;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void doLogin({ email, password });
  }

  function handleDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    void doLogin({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🐾</span>
          <h1 className={styles.brandName}>{th.appName}</h1>
          <p className={styles.brandSub}>{th.clinicSystem}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label htmlFor="email">{th.email}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{th.password}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? th.loggingIn : th.loginButton}
          </button>
        </form>

        <div className={styles.divider}><span>หรือ</span></div>

        <button
          type="button"
          className={`btn btn-secondary ${styles.submitBtn}`}
          onClick={handleDemo}
          disabled={loading}
        >
          🎬 ลองใช้แบบ Demo (ไม่ต้องล็อกอิน)
        </button>

        <p className={styles.hint}>{th.demoHint}</p>
      </div>
    </div>
  );
}
