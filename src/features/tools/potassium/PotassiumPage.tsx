/**
 * Potassium Supplementation — K+ Sliding Scale
 * Formulas ported VERBATIM from AsiaPet.html renderKScott() (line 13041-13064).
 *
 * Sliding scale (AsiaPet.html line 13047-13053):
 *   k < 2       → kcl = 80 mEq/L,   maxRate = 6  ml/kg/h,  Severe hypokalemia
 *   k ≤ 2.5     → kcl = 60,          maxRate = 8,           Marked hypokalemia
 *   k ≤ 3       → kcl = 40,          maxRate = 12,          Moderate hypokalemia
 *   k ≤ 3.5     → kcl = 30,          maxRate = 18,          Mild hypokalemia
 *   k ≤ 5       → kcl = '0-20',      maxRate = 25,          Normal range
 *   k > 5       → HYPERKALEMIC (stop K+)
 *
 * NOTE: The task description cites renderPOTZ at line 13878 as the source for this
 * calculator, but renderPOTZ renders reptile temperature zones (POTZ data).
 * The correct source for "เสริมโพแทสเซียม / Sliding scale by serum K+" is
 * renderKScott at line 13041. The formulas here are ported from renderKScott exactly.
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import th from '../../../i18n/th';
import styles from '../tools.module.css';

type KclValue = number | '0-20';

interface KScaleRow {
  level: string;
  levelClass: string;
  kcl: KclValue;
  maxRate: number;
}

// Sliding scale — verbatim from renderKScott, AsiaPet.html line 13047-13052
function getKScale(k: number): KScaleRow | 'hyperkalemic' | null {
  if (k <= 0) return null;
  if (k < 2)       return { level: 'Severe hypokalemia',   levelClass: 'levelSevere', kcl: 80,     maxRate: 6 };
  if (k <= 2.5)    return { level: 'Marked hypokalemia',   levelClass: 'levelMarked', kcl: 60,     maxRate: 8 };
  if (k <= 3)      return { level: 'Moderate hypokalemia', levelClass: 'levelMod',    kcl: 40,     maxRate: 12 };
  if (k <= 3.5)    return { level: 'Mild hypokalemia',     levelClass: 'levelMild',   kcl: 30,     maxRate: 18 };
  if (k <= 5)      return { level: 'Normal range',         levelClass: 'levelNormal', kcl: '0-20', maxRate: 25 };
  return 'hyperkalemic';
}

interface ResultBoxProps {
  label: string;
  value: string;
  unit: string;
  kind?: 'success' | 'warn' | 'danger' | undefined;
}
function ResultBox({ label, value, unit, kind }: ResultBoxProps) {
  const cls = [
    styles.resultBox,
    kind === 'success' ? styles.success : '',
    kind === 'warn' ? styles.warn : '',
    kind === 'danger' ? styles.danger : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls}>
      <div className={styles.resultLabel}>{label}</div>
      <div className={styles.resultValue}>
        {value}
        {unit && <span className={styles.resultUnit}>{unit}</span>}
      </div>
    </div>
  );
}

export default function PotassiumPage() {
  const [serumK, setSerumK] = useState('');

  const kVal = parseFloat(serumK);

  const scale = useMemo(() => {
    if (!serumK || isNaN(kVal) || kVal <= 0) return null;
    return getKScale(kVal);
  }, [serumK, kVal]);

  return (
    <div className={`page ${styles.toolPage}`}>
      <div className="page-header">
        <h1 className="page-title">{th.potassiumTitle}</h1>
      </div>
      <p className={styles.pageDesc}>{th.potassiumDesc}</p>

      {/* Input */}
      <div className={styles.inputCard}>
        <div className={styles.inputGrid}>
          <div className={styles.inputField}>
            <label htmlFor="k-serum">{th.potassiumSerum}</label>
            <input
              id="k-serum"
              type="number"
              min="0"
              step="0.1"
              value={serumK}
              onChange={e => setSerumK(e.target.value)}
              placeholder="e.g. 2.8"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {!scale ? (
        <div className={styles.emptyResult}>{th.potassiumEnterK}</div>
      ) : scale === 'hyperkalemic' ? (
        /* HYPERKALEMIC — verbatim from renderKScott line 13053 */
        <div className={styles.dangerBlock}>
          <strong><AlertTriangle size={14} /> K+ = {kVal} is HYPERKALEMIC.</strong> Stop K+ supplementation.
          Consider: calcium gluconate (cardioprotection), insulin + dextrose, NaHCO3,
          or hemodialysis depending on severity.
        </div>
      ) : (
        <div className={styles.results}>
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>
              Recommendation for K+ = {kVal}
            </p>
            <div className={styles.resultGrid}>
              {/* Diagnosis — verbatim boxResult call, AsiaPet.html line 13057 */}
              <ResultBox
                label={th.potassiumDiagnosis}
                value={scale.level}
                unit=""
                kind="warn"
              />
              {/* KCl — verbatim boxResult call, AsiaPet.html line 13058 */}
              <ResultBox
                label={th.potassiumKcl}
                value={`${scale.kcl}`}
                unit="mEq/L"
                kind="success"
              />
              {/* Max rate — verbatim boxResult call, AsiaPet.html line 13059 */}
              <ResultBox
                label={th.potassiumMaxRate}
                value={`${scale.maxRate}`}
                unit="ml/kg/h"
                kind="danger"
              />
            </div>

            {/* Warning — verbatim from renderKScott line 13061 */}
            <div className={styles.warnBlock}>
              <strong><AlertTriangle size={14} /> NEVER exceed max fluid rate</strong> — K+ infusion rate &gt; 0.5 mEq/kg/h
              causes fatal cardiac arrhythmia. Recheck serum K+ q4-6h until normal. Monitor ECG
              continuously if K+ &lt; 2 or supplementing at high rate.
            </div>
          </div>

          {/* Reference table */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Sliding scale reference</p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Serum K+ (mEq/L)</th>
                    <th>Level</th>
                    <th>KCl in 1L fluids</th>
                    <th>Max fluid rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: '< 2.0',     level: 'Severe hypokalemia',   kcl: '80',   rate: '6 ml/kg/h' },
                    { range: '2.0 – 2.5', level: 'Marked hypokalemia',   kcl: '60',   rate: '8 ml/kg/h' },
                    { range: '2.5 – 3.0', level: 'Moderate hypokalemia', kcl: '40',   rate: '12 ml/kg/h' },
                    { range: '3.0 – 3.5', level: 'Mild hypokalemia',     kcl: '30',   rate: '18 ml/kg/h' },
                    { range: '3.5 – 5.0', level: 'Normal range',         kcl: '0-20', rate: '25 ml/kg/h' },
                    { range: '> 5.0',     level: 'HYPERKALEMIC',         kcl: 'STOP', rate: '—' },
                  ].map(row => (
                    <tr key={row.range}>
                      <td><code>{row.range}</code></td>
                      <td>{row.level}</td>
                      <td><strong>{row.kcl}</strong> mEq/L</td>
                      <td>{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
