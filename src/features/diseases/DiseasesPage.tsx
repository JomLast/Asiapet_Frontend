import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDiseases } from '../../api/content';
import type { Disease, DiseaseSeverity } from '@shared/types';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import th from '../../i18n/th';
import styles from './DiseasesPage.module.css';

const SEVERITY_LABELS: Record<DiseaseSeverity, string> = {
  emergency: th.emergency,
  urgent: th.urgent,
  chronic: th.chronic,
  routine: th.routine,
};

const PREVENTABLE_LABELS: Record<string, string> = {
  yes: th.yes,
  partial: th.partial,
  no: th.no,
};

export default function DiseasesPage() {
  const { data: diseases, isLoading, isError, refetch } = useQuery({
    queryKey: ['diseases'],
    queryFn: getDiseases,
    staleTime: Infinity,
  });

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<DiseaseSeverity | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState<Disease | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(diseases?.map(d => d.cat) ?? [])).sort(),
    [diseases],
  );

  const filtered = useMemo(() => {
    if (!diseases) return [];
    const q = search.toLowerCase();
    return diseases.filter(d => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.also?.toLowerCase().includes(q) ?? false) ||
        d.cat.toLowerCase().includes(q) ||
        d.species.some(s => s.toLowerCase().includes(q));
      const matchSev = !severityFilter || d.sev === severityFilter;
      const matchCat = !categoryFilter || d.cat === categoryFilter;
      return matchSearch && matchSev && matchCat;
    });
  }, [diseases, search, severityFilter, categoryFilter]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.diseaseLib}</h1>
        <span className={styles.count}>{filtered.length} / {diseases?.length ?? 0} {th.diseaseCount}</span>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="search"
          placeholder={th.searchDisease}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label={th.searchDisease}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label={th.category}
        >
          <option value="">{th.allCategories}</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value as DiseaseSeverity | '')}
          className={styles.filterSelect}
          aria-label={th.severity}
        >
          <option value="">{th.allSeverities}</option>
          {(Object.keys(SEVERITY_LABELS) as DiseaseSeverity[]).map(s => (
            <option key={s} value={s}>{SEVERITY_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Disease list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>{th.noDisease}</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(disease => (
            <DiseaseCard
              key={disease.name}
              disease={disease}
              onClick={() => setSelected(disease)}
            />
          ))}
        </div>
      )}

      {selected && (
        <Modal
          title={selected.name}
          onClose={() => setSelected(null)}
          width="680px"
        >
          <DiseaseDetail disease={selected} />
        </Modal>
      )}
    </div>
  );
}

function DiseaseCard({ disease, onClick }: { disease: Disease; onClick: () => void }) {
  return (
    <button className={styles.card} onClick={onClick} type="button">
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <span className={styles.diseaseName}>{disease.name}</span>
          {disease.also && <span className={styles.alsoKnown}>{disease.also}</span>}
        </div>
        <div className={styles.cardBadges}>
          <Badge
            label={SEVERITY_LABELS[disease.sev] ?? disease.sev}
            variant={disease.sev}
          />
        </div>
      </div>
      <div className={styles.cardMeta}>
        <span className={styles.catTag}>{disease.cat}</span>
        <span className={styles.speciesList}>{disease.species.join(', ')}</span>
      </div>
    </button>
  );
}

function DiseaseDetail({ disease }: { disease: Disease }) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{th.category}:</span>
          <span>{disease.cat}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{th.severity}:</span>
          <Badge
            label={SEVERITY_LABELS[disease.sev] ?? disease.sev}
            variant={disease.sev}
          />
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{th.affectedSpecies}:</span>
          <span>{disease.species.join(', ')}</span>
        </div>
        {disease.also && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{th.alsoKnownAs}:</span>
            <span className={styles.metaItalic}>{disease.also}</span>
          </div>
        )}
        {disease.preventable && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{th.preventable}:</span>
            <span>{PREVENTABLE_LABELS[disease.preventable] ?? disease.preventable}</span>
          </div>
        )}
      </div>

      {disease.cause && (
        <DetailSection title={th.cause} content={disease.cause} />
      )}
      {disease.script && (
        <DetailSection title={th.clientScript} content={disease.script} highlight />
      )}
      {disease.prognosis && (
        <DetailSection title={th.prognosis} content={disease.prognosis} />
      )}
      {disease.prevention && (
        <DetailSection title={th.prevention} content={disease.prevention} />
      )}
      {disease.preventableNote && (
        <DetailSection title={th.preventableNote} content={disease.preventableNote} />
      )}
    </div>
  );
}

function DetailSection({
  title,
  content,
  highlight = false,
}: {
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${styles.detailSection} ${highlight ? styles.highlighted : ''}`}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <p className={styles.sectionContent}>{content}</p>
    </div>
  );
}
