import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import th from '../../i18n/th';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className={styles.hero}>
        <span className={styles.heroIcon}>🐾</span>
        <h1 className={styles.heroTitle}>{th.welcomeTitle}</h1>
        <p className={styles.heroSub}>{th.welcomeSubtitle}</p>
        {user && (
          <p className={styles.userGreet}>
            สวัสดี, <strong>{user.displayName ?? user.email}</strong>
          </p>
        )}
      </div>

      <h2 className={styles.sectionTitle}>{th.quickNav}</h2>
      <div className={styles.grid}>
        <Link to="/patients" className={styles.tile}>
          <span className={styles.tileIcon}>🐶</span>
          <div>
            <div className={styles.tileName}>{th.patients}</div>
            <div className={styles.tileSub}>{th.viewPatients}</div>
          </div>
        </Link>
        <Link to="/drugs" className={styles.tile}>
          <span className={styles.tileIcon}>💊</span>
          <div>
            <div className={styles.tileName}>{th.drugReference}</div>
            <div className={styles.tileSub}>{th.viewDrugs}</div>
          </div>
        </Link>
        <Link to="/diseases" className={styles.tile}>
          <span className={styles.tileIcon}>📋</span>
          <div>
            <div className={styles.tileName}>{th.diseaseLibrary}</div>
            <div className={styles.tileSub}>{th.viewDiseases}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
