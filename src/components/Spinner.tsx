import styles from './Spinner.module.css';
import th from '../i18n/th';

interface Props {
  message?: string;
}

export default function Spinner({ message }: Props) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.ring} aria-hidden="true" />
      <span>{message ?? th.loading}</span>
    </div>
  );
}
