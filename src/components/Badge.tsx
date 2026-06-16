import styles from './Badge.module.css';

type Variant = 'emergency' | 'urgent' | 'chronic' | 'routine' | 'info' | 'success' | 'neutral';

interface Props {
  label: string;
  variant?: Variant;
}

export default function Badge({ label, variant = 'neutral' }: Props) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
