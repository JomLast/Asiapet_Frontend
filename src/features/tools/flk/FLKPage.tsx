/**
 * FLK / FFP CRI Calculator
 * Formulas ported VERBATIM from AsiaPet.html renderFLK() (line 12929-12971).
 * Data: FLK_CONC (line 12927) → seed flk-conc.json
 *   { f: 0.05, l: 20, k: 50 }  (mg/ml stock concentrations)
 *
 * KEY FORMULAS (lines 12940-12946):
 *   fVol = (fRate * w * h_) / FLK_CONC.f      (ml Fentanyl)
 *   lVol = (lRate * w * h_) / FLK_CONC.l      (ml Lidocaine)
 *   kVol = (kRate * w * h_) / FLK_CONC.k      (ml Ketamine)
 *   totalDrug = fVol + lVol + kVol
 *   nss = syringe - totalDrug                  (ml NSS to top up)
 *   rate = syringe / h_                        (ml/h delivery rate)
 */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFlkConc } from '../../../api/content';
import Spinner from '../../../components/Spinner';
import ErrorMessage from '../../../components/ErrorMessage';
import th from '../../../i18n/th';
import styles from '../tools.module.css';

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

export default function FLKPage() {
  const { data: flkConc, isLoading, isError, refetch } = useQuery({
    queryKey: ['flk-conc'],
    queryFn: getFlkConc,
    staleTime: Infinity,
  });

  const [weight, setWeight] = useState('');
  // Default values from AsiaPet.html: duration=20h, syringe=20ml
  // fRate=0.003, lRate=3, kRate=0.3 (from element defaults, line 12933-12935)
  const [duration, setDuration] = useState('20');
  const [syringe, setSyringe] = useState('20');
  const [fRate, setFRate] = useState('0.003');
  const [lRate, setLRate] = useState('3');
  const [kRate, setKRate] = useState('0.3');

  const result = useMemo(() => {
    if (!flkConc) return null;
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;

    const h_ = parseFloat(duration) || 20;
    const syr = parseFloat(syringe) || 20;
    const fR = parseFloat(fRate) || 0.003;
    const lR = parseFloat(lRate) || 3;
    const kR = parseFloat(kRate) || 0.3;

    // Formulas verbatim — AsiaPet.html lines 12940-12945
    const fVol = (fR * w * h_) / flkConc.f;
    const lVol = (lR * w * h_) / flkConc.l;
    const kVol = (kR * w * h_) / flkConc.k;
    const totalDrug = fVol + lVol + kVol;
    const nss = syr - totalDrug;
    const rate = syr / h_;

    return { fVol, lVol, kVol, totalDrug, nss, rate, h_, syr, flkConc, exceeds: totalDrug > syr };
  }, [flkConc, weight, duration, syringe, fRate, lRate, kRate]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <div className={`page ${styles.toolPage}`}>
      <div className="page-header">
        <h1 className="page-title">{th.flkTitle}</h1>
      </div>
      <p className={styles.pageDesc}>{th.flkDesc}</p>

      {/* Inputs */}
      <div className={styles.inputCard}>
        <div className={styles.inputGrid}>
          <div className={styles.inputField}>
            <label htmlFor="flk-weight">{th.calcWeight}</label>
            <input
              id="flk-weight"
              type="number"
              min="0"
              step="0.001"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 1.0"
            />
          </div>

          {/* Duration — AsiaPet.html line 3584 default 20 */}
          <div className={styles.inputField}>
            <label htmlFor="flk-duration">{th.flkDuration}</label>
            <input
              id="flk-duration"
              type="number"
              min="1"
              step="1"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>

          {/* Syringe — AsiaPet.html line 3585 */}
          <div className={styles.inputField}>
            <label htmlFor="flk-syringe">{th.flkSyringe}</label>
            <select
              id="flk-syringe"
              value={syringe}
              onChange={e => setSyringe(e.target.value)}
            >
              <option value="10">10 ml</option>
              <option value="20">20 ml</option>
              <option value="30">30 ml</option>
              <option value="50">50 ml</option>
            </select>
          </div>

          {/* Rate inputs — defaults from AsiaPet.html line 12933-12935 */}
          <div className={styles.inputField}>
            <label htmlFor="flk-frate">{th.flkFRate}</label>
            <input
              id="flk-frate"
              type="number"
              min="0"
              step="0.001"
              value={fRate}
              onChange={e => setFRate(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="flk-lrate">{th.flkLRate}</label>
            <input
              id="flk-lrate"
              type="number"
              min="0"
              step="0.1"
              value={lRate}
              onChange={e => setLRate(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="flk-krate">{th.flkKRate}</label>
            <input
              id="flk-krate"
              type="number"
              min="0"
              step="0.01"
              value={kRate}
              onChange={e => setKRate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {!result ? (
        <div className={styles.emptyResult}>{th.calcEnterWeight}</div>
      ) : result.exceeds ? (
        /* Overflow warning — verbatim from AsiaPet.html line 12947-12949 */
        <div className={styles.overflowWarn}>
          ⚠ {th.flkExceeds}: Total drug volume ({result.totalDrug.toFixed(2)} ml) exceeds
          syringe size ({result.syr} ml). Choose a larger syringe or reduce duration.
        </div>
      ) : (
        <div className={styles.results}>
          {/* CRI recipe — AsiaPet.html line 12952 */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>CRI recipe</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.flkFentanyl}
                value={result.fVol.toFixed(2)}
                unit={`ml (${result.flkConc.f} mg/ml)`}
              />
              <ResultBox
                label={th.flkLidocaine}
                value={result.lVol.toFixed(2)}
                unit={`ml (${result.flkConc.l} mg/ml)`}
              />
              <ResultBox
                label={th.flkKetamine}
                value={result.kVol.toFixed(2)}
                unit={`ml (${result.flkConc.k} mg/ml)`}
              />
            </div>
          </div>

          {/* Top up + delivery — AsiaPet.html line 12958 */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Top up + delivery</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.flkTotalDrug}
                value={result.totalDrug.toFixed(2)}
                unit="ml"
                kind="warn"
              />
              <ResultBox
                label={th.flkNss}
                value={result.nss.toFixed(2)}
                unit="ml"
              />
              <ResultBox
                label={th.flkDeliveryRate}
                value={result.rate.toFixed(2)}
                unit="ml/h"
                kind="success"
              />
            </div>

            {/* Warning — verbatim from AsiaPet.html lines 12964-12968 */}
            <div className={styles.warnBlock}>
              <strong>Dose ranges:</strong> Fentanyl 0.002-0.005 mg/kg/h · Lidocaine 1-6 mg/kg/h ·
              Ketamine 0.1-1.2 mg/kg/h<br />
              <strong>⚠ Cats:</strong> Lidocaine CRI caution — risk of lidocaine toxicity
              (lower dose 0.5-2 mg/kg/h).<br />
              <strong>⚠ Hepatic disease:</strong> Reduce lidocaine + fentanyl rates by 50%.
              Monitor TPR + CRT + MM hourly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
