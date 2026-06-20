import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { login } from '../../api/auth';
import th from '../../i18n/th';
import styles from './LoginPage.module.css';

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      setAuth(res.token, res.user);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : th.loginError;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <img src="/logo.png" alt="Asiapet Animal Hospital" className={styles.brandIcon} style={{ height: 56, width: 'auto' }} />
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
              <AlertTriangle size={15} style={{ verticalAlign: '-2px' }} /> {error}
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

        <p className={styles.hint}>{th.demoHint}</p>
      </div>
    </div>
  );
}
