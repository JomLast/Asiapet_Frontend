import styles from './ErrorMessage.module.css';
import th from '../i18n/th';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.box} role="alert">
      <span className={styles.icon}>⚠️</span>
      <p className={styles.msg}>{message ?? th.errorLoad}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry} type="button">
          {th.retry}
        </button>
      )}
    </div>
  );
}
