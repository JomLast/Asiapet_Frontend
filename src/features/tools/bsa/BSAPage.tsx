/**
 * BSA (Body Surface Area) Dosing Calculator
 * Formulas ported VERBATIM from AsiaPet.html renderBSA() (line 13812-13852).
 * Data: BSA_K (line 13784) → seed bsa-k.json
 *       BSA_DRUG_INFO (line 13786) → seed bsa-drug-info.json
 *
 * KEY FORMULA (line 13822):
 *   weightG = w * 1000   (convert kg → g)
 *   bsa = (K * Math.pow(weightG, 2/3)) / 10000   (m²)
 */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBsaK, getBsaDrugInfo } from '../../../api/content';
import Spinner from '../../../components/Spinner';
import ErrorMessage from '../../../components/ErrorMessage';
import th from '../../../i18n/th';
import styles from '../tools.module.css';

// BSA_SPECIES_LABEL — AsiaPet.html near line 13785
const BSA_SPECIES_LABEL: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  ferret: 'Ferret',
  rabbit: 'Rabbit',
  rat: 'Rat',
  mouse: 'Mouse',
  primate: 'Primate',
};

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

export default function BSAPage() {
  const { data: bsaKData, isLoading: loadingK, isError: errorK, refetch: refetchK } = useQuery({
    queryKey: ['bsa-k'],
    queryFn: getBsaK,
    staleTime: Infinity,
  });
  const { data: drugData, isLoading: loadingD, isError: errorD, refetch: refetchD } = useQuery({
    queryKey: ['bsa-drug-info'],
    queryFn: getBsaDrugInfo,
    staleTime: Infinity,
  });

  const [species, setSpecies] = useState('dog');
  const [weight, setWeight] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');

  const result = useMemo(() => {
    if (!bsaKData) return null;
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;
    const K = bsaKData[species];
    if (K === undefined) return null;

    // BSA formula — AsiaPet.html line 13821-13822
    const weightG = w * 1000;
    const bsa = (K * Math.pow(weightG, 2 / 3)) / 10000; // m²

    return { bsa, K, weightG, w };
  }, [bsaKData, species, weight]);

  const drugResult = useMemo(() => {
    if (!drugData || !result || !selectedDrug) return null;
    const drug = drugData[selectedDrug];
    if (!drug) return null;

    // Drug dose — AsiaPet.html line 13835-13845
    if (drug.isKg === true) {
      // Weight-based drug (e.g. L-Asparaginase, Vincristine rabbit)
      const loMg = drug.lo * result.w;
      const hiMg = drug.hi * result.w;
      const range = loMg === hiMg ? loMg.toFixed(3) : `${loMg.toFixed(3)}–${hiMg.toFixed(3)}`;
      const perKg = drug.lo === drug.hi ? `${drug.lo}` : `${drug.lo}–${drug.hi}`;
      return { range, perDoseLabel: perKg, unit: drug.unit, note: drug.note, isKg: true };
    } else {
      const loMg = drug.lo * result.bsa;
      const hiMg = drug.hi * result.bsa;
      const range = loMg === hiMg ? loMg.toFixed(3) : `${loMg.toFixed(3)}–${hiMg.toFixed(3)}`;
      const perM2 = drug.lo === drug.hi ? `${drug.lo}` : `${drug.lo}–${drug.hi}`;
      return { range, perDoseLabel: perM2, unit: drug.unit, note: drug.note, isKg: false };
    }
  }, [drugData, result, selectedDrug]);

  const isLoading = loadingK || loadingD;
  const isError = errorK || errorD;
  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <ErrorMessage
        onRetry={() => { void refetchK(); void refetchD(); }}
      />
    );

  const drugEntries = drugData ? Object.entries(drugData) : [];
  const spLabel = BSA_SPECIES_LABEL[species] ?? species;

  return (
    <div className={`page ${styles.toolPage}`}>
      <div className="page-header">
        <h1 className="page-title">{th.bsaTitle}</h1>
      </div>
      <p className={styles.pageDesc}>{th.bsaDesc}</p>

      {/* Inputs */}
      <div className={styles.inputCard}>
        <div className={styles.inputGrid}>
          <div className={styles.inputField}>
            <label htmlFor="bsa-species">{th.calcSpecies}</label>
            <select
              id="bsa-species"
              value={species}
              onChange={e => setSpecies(e.target.value)}
            >
              {Object.entries(BSA_SPECIES_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="bsa-weight">{th.calcWeight}</label>
            <input
              id="bsa-weight"
              type="number"
              min="0"
              step="0.001"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 5.0"
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="bsa-drug">{th.bsaSelectDrug}</label>
            <select
              id="bsa-drug"
              value={selectedDrug}
              onChange={e => setSelectedDrug(e.target.value)}
            >
              <option value="">{th.bsaNoDrug}</option>
              {drugEntries.map(([k, d]) => (
                <option key={k} value={k}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {!result ? (
        <div className={styles.emptyResult}>{th.calcEnterWeight}</div>
      ) : (
        <div className={styles.results}>
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>
              {th.bsaResult} — {spLabel} {parseFloat(weight).toFixed(2)} kg
            </p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.bsaResult}
                value={result.bsa.toFixed(4)}
                unit="m²"
                kind="success"
              />
              <ResultBox label={th.bsaConstK} value={`${result.K}`} unit="" />
              <ResultBox
                label={th.bsaFormula}
                value={`${result.K} × ${result.weightG}^⅔ ÷ 10⁴`}
                unit=""
              />
            </div>
            <p className={styles.formulaNote}>
              Formula: BSA = K × (weight_g)^(2/3) / 10000 — AsiaPet.html line 13822
            </p>
          </div>

          {/* Drug dose section */}
          {drugResult && selectedDrug && drugData && (
            <div className={styles.resultCard}>
              <p className={styles.resultCardTitle}>
                {drugData[selectedDrug]?.name ?? selectedDrug} — Total dose
              </p>
              <div className={styles.resultGrid}>
                <ResultBox
                  label={th.bsaTotalDose}
                  value={drugResult.range}
                  unit="mg"
                  kind="success"
                />
                <ResultBox
                  label={drugResult.isKg ? 'Dose/kg' : th.bsaDosePerM2}
                  value={drugResult.perDoseLabel}
                  unit={drugResult.unit}
                />
              </div>
              <div className={styles.warnBlock}>{drugResult.note}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
