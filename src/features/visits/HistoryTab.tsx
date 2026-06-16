import type { Visit } from '@shared/types';
import th from '../../i18n/th';
import styles from './HistoryTab.module.css';

interface Props {
  visits: Visit[];
}

export default function HistoryTab({ visits }: Props) {
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📅</span>
        <p>{th.noHistory}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{th.visitHistory}</h3>
      <div className={styles.timeline}>
        {sorted.map((visit, index) => (
          <VisitCard key={visit.date} visit={visit} number={sorted.length - index} />
        ))}
      </div>
    </div>
  );
}

function VisitCard({ visit, number }: { visit: Visit; number: number }) {
  const opd = visit.opd;
  const rx = visit.rx;
  const lab = visit.lab;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.dateBlock}>
          <span className={styles.visitNum}>ครั้งที่ {number}</span>
          <span className={styles.date}>{visit.date}</span>
        </div>
        <div className={styles.badges}>
          {opd && <span className={styles.badge}>OPD</span>}
          {rx && rx.items.length > 0 && <span className={`${styles.badge} ${styles.badgeRx}`}>Rx</span>}
          {lab && <span className={`${styles.badge} ${styles.badgeLab}`}>Lab</span>}
        </div>
      </div>

      {opd && (
        <div className={styles.section}>
          {/* Vitals */}
          {(opd.weight || opd.temp || opd.hr || opd.rr) && (
            <div className={styles.vitals}>
              {opd.weight && <Vital label="BW" value={`${opd.weight} kg`} />}
              {opd.temp && <Vital label="T" value={`${opd.temp} °C`} />}
              {opd.hr && <Vital label="HR" value={`${opd.hr}`} />}
              {opd.rr && <Vital label="RR" value={`${opd.rr}`} />}
            </div>
          )}
          {opd.cc && <HistoryField label="CC" value={opd.cc} />}
          {opd.dx && <HistoryField label="Dx" value={opd.dx} highlight />}
          {opd.plan && <HistoryField label="Plan" value={opd.plan} />}
        </div>
      )}

      {rx && rx.items.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>ใบยา</p>
          <ul className={styles.rxList}>
            {rx.items.map((item, i) => (
              <li key={i}>
                <strong>{item.name}</strong>
                {item.instruction ? ` — ${item.instruction}` : ''}
                {item.qty ? ` (${item.qty})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <span className={styles.vital}>
      <span className={styles.vitalLabel}>{label}</span>
      <span className={styles.vitalValue}>{value}</span>
    </span>
  );
}

function HistoryField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={styles.histField}>
      <span className={styles.histLabel}>{label}</span>
      <span className={`${styles.histValue} ${highlight ? styles.highlight : ''}`}>{value}</span>
    </div>
  );
}
