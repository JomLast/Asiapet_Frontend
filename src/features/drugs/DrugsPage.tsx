import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDrugs } from '../../api/content';
import type { Drug, DrugDose } from '@shared/types';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import th from '../../i18n/th';
import { AlertTriangle, Calculator } from 'lucide-react';
import styles from './DrugsPage.module.css';

export default function DrugsPage() {
  const { data: drugs, isLoading, isError, refetch } = useQuery({
    queryKey: ['drugs'],
    queryFn: getDrugs,
    staleTime: Infinity, // static content
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Drug | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(drugs?.map(d => d.cat) ?? [])).sort(),
    [drugs],
  );

  const filtered = useMemo(() => {
    if (!drugs) return [];
    const q = search.toLowerCase();
    return drugs.filter(d => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.brand?.toLowerCase().includes(q) ?? false) ||
        d.cat.toLowerCase().includes(q) ||
        (d.cls?.toLowerCase().includes(q) ?? false);
      const matchCat = !category || d.cat === category;
      return matchSearch && matchCat;
    });
  }, [drugs, search, category]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.drugRef}</h1>
        <span className={styles.count}>{filtered.length} / {drugs?.length ?? 0} {th.drugCount}</span>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="search"
          placeholder={th.searchDrug}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label={th.searchDrug}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.catSelect}
          aria-label={th.category}
        >
          <option value="">{th.allCategories}</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Drug list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>{th.noDrugs}</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(drug => (
            <DrugCard key={drug.name} drug={drug} onClick={() => setSelected(drug)} />
          ))}
        </div>
      )}

      {selected && (
        <Modal
          title={selected.name}
          onClose={() => setSelected(null)}
          width="760px"
        >
          <DrugDetail drug={selected} />
        </Modal>
      )}
    </div>
  );
}

function DrugCard({ drug, onClick }: { drug: Drug; onClick: () => void }) {
  return (
    <button className={styles.drugCard} onClick={onClick} type="button">
      <div className={styles.drugCardTop}>
        <div>
          <span className={styles.drugName}>{drug.name}</span>
          {drug.brand && <span className={styles.drugBrand}>{drug.brand}</span>}
        </div>
        <span className={styles.catBadge}>{drug.cat}</span>
      </div>
      {drug.cls && <p className={styles.drugClass}>{drug.cls}</p>}
      {drug.use && <p className={styles.drugUse}>{drug.use}</p>}
      {drug.warn && (
        <p className={styles.warnPreview}><AlertTriangle size={14} /> {drug.warn.slice(0, 80)}{drug.warn.length > 80 ? '…' : ''}</p>
      )}
    </button>
  );
}

function DrugDetail({ drug }: { drug: Drug }) {
  return (
    <div className={styles.detail}>
      {/* Header info */}
      <div className={styles.detailHeader}>
        {drug.brand && (
          <p><span className={styles.detailLabel}>{th.brand}:</span> {drug.brand}</p>
        )}
        {drug.cls && (
          <p><span className={styles.detailLabel}>{th.drugClass}:</span> {drug.cls}</p>
        )}
        {drug.use && (
          <p><span className={styles.detailLabel}>{th.indication}:</span> {drug.use}</p>
        )}
        {drug.verified && (
          <p><span className={styles.detailLabel}>{th.verified}:</span> {drug.verified}</p>
        )}
      </div>

      {/* Warning */}
      {drug.warn && (
        <div className={styles.warnBox}>
          <strong><AlertTriangle size={14} /> {th.warning}</strong>
          <p>{drug.warn}</p>
        </div>
      )}

      {/* Contraindications */}
      {drug.contra && drug.contra.length > 0 && (
        <div className={styles.contraBox}>
          <strong>{th.contraindications}:</strong>
          <ul>
            {drug.contra.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {/* Dose table */}
      {drug.doses.length > 0 && (
        <div className={styles.doseSection}>
          <h3 className={styles.sectionTitle}>{th.doseTable}</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{th.dosingSpecies}</th>
                  <th>{th.dose}</th>
                  <th>{th.route}</th>
                  <th>{th.frequency}</th>
                  <th>{th.source}</th>
                </tr>
              </thead>
              <tbody>
                {drug.doses.map((dose, i) => (
                  <tr key={i}>
                    <td>{dose.sp}</td>
                    <td className={styles.doseCell}>{dose.d}</td>
                    <td>{dose.r}</td>
                    <td>{dose.f}</td>
                    <td className={styles.srcCell}>{dose.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dose calculator */}
          <DoseCalculator doses={drug.doses} />
        </div>
      )}
    </div>
  );
}

function parseDoseRange(doseStr: string): { min: number; max: number } | null {
  // Handles: "11–22 mg/kg", "5-10 mg/kg", "0.1 mg/kg", "2.2 mg/kg"
  const normalized = doseStr.replace(/–/g, '-').replace(/\s+/g, ' ');
  const rangeMatch = normalized.match(/([\d.]+)\s*[-]\s*([\d.]+)\s*mg\/kg/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1] ?? '0');
    const max = parseFloat(rangeMatch[2] ?? '0');
    if (!isNaN(min) && !isNaN(max)) return { min, max };
  }
  const singleMatch = normalized.match(/([\d.]+)\s*mg\/kg/i);
  if (singleMatch) {
    const v = parseFloat(singleMatch[1] ?? '0');
    if (!isNaN(v)) return { min: v, max: v };
  }
  return null;
}

function DoseCalculator({ doses }: { doses: DrugDose[] }) {
  const [weight, setWeight] = useState('');
  const [rowIndex, setRowIndex] = useState(0);

  const selectedDose = doses[rowIndex];
  const parsedWeight = parseFloat(weight);
  const doseRange = selectedDose ? parseDoseRange(selectedDose.d) : null;

  let result: string | null = null;
  if (doseRange && !isNaN(parsedWeight) && parsedWeight > 0) {
    if (doseRange.min === doseRange.max) {
      result = `${(doseRange.min * parsedWeight).toFixed(2)} mg`;
    } else {
      result = `${(doseRange.min * parsedWeight).toFixed(2)} – ${(doseRange.max * parsedWeight).toFixed(2)} mg`;
    }
  }

  return (
    <div className={styles.calculator}>
      <h4 className={styles.calcTitle}><Calculator size={16} /> {th.doseCalculator}</h4>
      <div className={styles.calcRow}>
        <div className={styles.calcField}>
          <label htmlFor="calc-weight">{th.bodyWeight}</label>
          <input
            id="calc-weight"
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="เช่น 5.5"
            style={{ width: '120px' }}
          />
        </div>
        <div className={styles.calcField}>
          <label htmlFor="calc-row">{th.selectDoseRow}</label>
          <select
            id="calc-row"
            value={rowIndex}
            onChange={e => setRowIndex(Number(e.target.value))}
          >
            {doses.map((dose, i) => (
              <option key={i} value={i}>
                {dose.sp} — {dose.d} {dose.r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Raw dose string — always shown */}
      {selectedDose && (
        <p className={styles.rawDose}>
          <span className={styles.rawDoseLabel}>{th.rawDoseString}:</span>{' '}
          <code>{selectedDose.d}</code> ({selectedDose.r}, {selectedDose.f})
        </p>
      )}

      {result !== null ? (
        <div className={styles.calcResult}>
          <span className={styles.calcResultLabel}>{th.calculatedDose}:</span>
          <span className={styles.calcResultValue}>{result}</span>
        </div>
      ) : (
        weight && !isNaN(parsedWeight) && parsedWeight > 0 && !doseRange && (
          <p className={styles.calcNote}>
            ไม่สามารถคำนวณอัตโนมัติได้จากข้อมูลขนาดยา กรุณาดูขนาดยาดิบด้านบน
          </p>
        )
      )}
    </div>
  );
}
