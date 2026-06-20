/**
 * Blood Transfusion Calculator
 * Formulas ported VERBATIM from AsiaPet.html renderBloodTx() (line 12831-12884).
 *
 * KEY FORMULA (line 12841):
 *   volume = (w * K * (desPCV - curPCV)) / donorPCV
 *
 * Other computed values (lines 12842-12846):
 *   cpd = volume / 7                      (1:7 anticoagulant ratio)
 *   cpmDose = w * 0.5                     (Chlorpheniramine mg)
 *   initRate = w * 1                      (ml/h first 15 min)
 *   fullRate.lo = w * 4                   (ml/h after 15 min, lower)
 *   fullRate.hi = w * 10                  (ml/h after 15 min, upper)
 *   donorReplace = volume * 3             (ml LRS 3× volume drawn)
 *
 * Species K factors from HTML select (line 3530-3533):
 *   Dog K=90, Cat K=70, Rabbit K=66 (default)
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
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

export default function TransfusionPage() {
  // Species K factor select — mirrors bx-species select (AsiaPet.html line 3530-3533)
  const [kFactor, setKFactor] = useState('66');
  const [weight, setWeight] = useState('');
  const [curPCV, setCurPCV] = useState('');
  // Desired PCV select — mirrors bx-desired-pcv (AsiaPet.html line 3541-3544)
  const [desPCV, setDesPCV] = useState('33');
  const [donorPCV, setDonorPCV] = useState('45');

  const result = useMemo(() => {
    const K = parseFloat(kFactor) || 66;
    const w = parseFloat(weight) || 0;
    const cur = parseFloat(curPCV);
    const des = parseFloat(desPCV);
    const donor = parseFloat(donorPCV) || 45;

    // Validation — AsiaPet.html line 12837
    if (w <= 0 || isNaN(cur) || isNaN(des)) return null;

    // All formulas verbatim — AsiaPet.html lines 12841-12846
    const volume = (w * K * (des - cur)) / donor;
    const cpd = volume / 7;
    const cpmDose = w * 0.5;
    const initRate = w * 1;
    const fullRateLo = w * 4;
    const fullRateHi = w * 10;
    const donorReplace = volume * 3;

    return { volume, cpd, cpmDose, initRate, fullRateLo, fullRateHi, donorReplace, K, w, cur, des, donor };
  }, [kFactor, weight, curPCV, desPCV, donorPCV]);

  return (
    <div className={`page ${styles.toolPage}`}>
      <div className="page-header">
        <h1 className="page-title">{th.transfusionTitle}</h1>
      </div>
      <p className={styles.pageDesc}>{th.transfusionDesc}</p>

      {/* Inputs */}
      <div className={styles.inputCard}>
        <div className={styles.inputGrid}>
          {/* Species K — AsiaPet.html line 3530 */}
          <div className={styles.inputField}>
            <label htmlFor="bx-species">{th.transfusionKFactor}</label>
            <select
              id="bx-species"
              value={kFactor}
              onChange={e => setKFactor(e.target.value)}
            >
              <option value="90">Dog (K = 90)</option>
              <option value="70">Cat (K = 70)</option>
              <option value="66">Rabbit (K = 66)</option>
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="bx-weight">{th.calcWeight}</label>
            <input
              id="bx-weight"
              type="number"
              min="0"
              step="0.001"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="bx-curpcv">{th.transfusionCurrentPcv}</label>
            <input
              id="bx-curpcv"
              type="number"
              min="0"
              max="60"
              step="1"
              value={curPCV}
              onChange={e => setCurPCV(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>

          {/* Desired PCV select — AsiaPet.html line 3541-3544 */}
          <div className={styles.inputField}>
            <label htmlFor="bx-despcv">{th.transfusionDesiredPcv}</label>
            <select
              id="bx-despcv"
              value={desPCV}
              onChange={e => setDesPCV(e.target.value)}
            >
              <option value="30">Chronic anemia (25-30%) — use 30</option>
              <option value="33">Acute anemia (30-35%) — use 33</option>
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="bx-donorpcv">{th.transfusionDonorPcv}</label>
            <input
              id="bx-donorpcv"
              type="number"
              min="20"
              max="60"
              step="1"
              value={donorPCV}
              onChange={e => setDonorPCV(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {!result ? (
        <div className={styles.emptyResult}>
          กรอกน้ำหนัก + PCV ปัจจุบัน เพื่อคำนวณปริมาตรเลือด
        </div>
      ) : (
        <div className={styles.results}>
          {/* Step 3 — Volume needed (AsiaPet.html line 12848) */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Step 3 — Volume needed</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.transfusionVolume}
                value={result.volume.toFixed(2)}
                unit="ml whole blood"
                kind="success"
              />
              <ResultBox
                label={th.transfusionCpd}
                value={result.cpd.toFixed(2)}
                unit="ml (1:7 ratio)"
              />
              <ResultBox
                label={th.transfusionDonorFluid}
                value={result.donorReplace.toFixed(1)}
                unit="ml LRS (3× volume drawn)"
                kind="warn"
              />
            </div>
            <p className={styles.formulaNote}>
              Formula: {result.w.toFixed(2)} × {result.K} × ({result.des} − {result.cur}) / {result.donor} = {result.volume.toFixed(2)} ml
            </p>
          </div>

          {/* Step 5 — Recipient prep (AsiaPet.html line 12857) */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Step 5 — Recipient preparation</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.transfusionCpm}
                value={result.cpmDose.toFixed(3)}
                unit="mg IV/SC, 30 min before"
              />
            </div>
            <div className={styles.infoBlock}>
              Also: change fluid line to <strong>0.9% NaCl (NSS)</strong> — LRS contains
              calcium which can clot with citrated blood.
            </div>
          </div>

          {/* Step 6 — Administration (AsiaPet.html line 12864) */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Step 6 — Administration</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.transfusionInitRate}
                value={result.initRate.toFixed(2)}
                unit="ml/h (1 ml/kg/h)"
                kind="warn"
              />
              <ResultBox
                label={th.transfusionFullRate}
                value={`${result.fullRateLo.toFixed(1)}–${result.fullRateHi.toFixed(1)}`}
                unit="ml/h (4-10 ml/kg/h)"
                kind="success"
              />
            </div>
            <div className={styles.warnBlock}>
              <strong><AlertTriangle size={14} /> Monitor vitals every 15-30 min.</strong> Maximum infusion time 4-6 h.
              Watch for: tachycardia, dyspnea, hyperthermia, hemoglobinuria, vomiting →
              STOP transfusion + treat reaction.
            </div>
          </div>

          {/* Complete protocol checklist (AsiaPet.html line 12872) */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Complete protocol checklist</p>
            <div className={styles.checklist}>
              <strong>Step 1.</strong> Confirm PCV &lt; 20% or life-threatening anemia<br />
              <strong>Step 2.</strong> Crossmatch (major + minor) — repeat at every transfusion<br />
              <strong>Step 3.</strong> Calculate volume = {result.volume.toFixed(2)} ml<br />
              <strong>Step 4.</strong> Mix with CPD {result.cpd.toFixed(2)} ml (1:7 whole blood)<br />
              <strong>Step 5.</strong> Pretreat recipient with CPM {result.cpmDose.toFixed(3)} mg + switch fluid to NSS<br />
              <strong>Step 6.</strong> Start {result.initRate.toFixed(2)} ml/h × 15 min → {result.fullRateLo.toFixed(1)}–{result.fullRateHi.toFixed(1)} ml/h<br />
              <strong>Step 7.</strong> Monitor vitals q15-30 min. Replace donor with {result.donorReplace.toFixed(1)} ml LRS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
