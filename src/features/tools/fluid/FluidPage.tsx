/**
 * Fluid Therapy Calculator
 * Formulas ported VERBATIM from AsiaPet.html renderFluidCalc() (line 9106-9180).
 * Data: FLUID_MAINT (line 9050) and FLUID_SPECIES_LABEL (line 9067) → seed fluid-maint.json
 */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFluidMaint } from '../../../api/content';
import Spinner from '../../../components/Spinner';
import ErrorMessage from '../../../components/ErrorMessage';
import th from '../../../i18n/th';
import styles from '../tools.module.css';

// FLUID_SPECIES_LABEL — AsiaPet.html line 9067
const FLUID_SPECIES_LABEL: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  ferret: 'Ferret',
  rabbit: 'Rabbit',
  'guinea-pig': 'Guinea Pig',
  chinchilla: 'Chinchilla',
  hamster: 'Hamster / Rat / Mouse',
  hedgehog: 'Hedgehog',
  'sugar-glider': 'Sugar Glider',
  bird: 'Bird (small)',
  'bird-large': 'Bird (large)',
  reptile: 'Reptile',
  tortoise: 'Chelonian',
  amphibian: 'Amphibian',
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

export default function FluidPage() {
  const { data: fluidMaint, isLoading, isError, refetch } = useQuery({
    queryKey: ['fluid-maint'],
    queryFn: getFluidMaint,
    staleTime: Infinity,
  });

  const [species, setSpecies] = useState('dog');
  const [weight, setWeight] = useState('');
  const [dehyd, setDehyd] = useState('0');
  const [hours, setHours] = useState('24');
  const [loss, setLoss] = useState('0');
  const [shock, setShock] = useState(false);

  const result = useMemo(() => {
    if (!fluidMaint) return null;
    const cfg = fluidMaint[species];
    const w = parseFloat(weight) || 0;
    if (!cfg || w <= 0) return null;

    // ---- Calculations (verbatim from renderFluidCalc, AsiaPet.html:9120-9135) ----
    const maintDaily = cfg.maint * w;                                 // ml/day
    const deficitMl  = (parseFloat(dehyd) / 100) * w * 1000;         // ml (5% dehyd = 50 ml/kg)
    const lossDaily  = (parseFloat(loss) || 0) * w;                  // ml/day
    // totalDaily NOT displayed but used for composite
    const h_         = parseFloat(hours) || 24;
    const total24h   = maintDaily + lossDaily + deficitMl * (24 / h_); // first-24h composite
    const replaceRate   = deficitMl / h_;                              // ml/hr (deficit only)
    const maintRate     = maintDaily / 24;                             // ml/hr
    const combinedRate  = maintRate + replaceRate + (lossDaily / 24); // ml/hr
    const shockBolus    = shock ? cfg.shock * w : 0;                  // ml bolus 1/4 increments q15min
    const shockIncrement = shockBolus / 4;
    // SC volume limit (mammals) — AsiaPet.html:9133
    const scMaxSite = w * 1000 * 0.05;  // 5% body weight per site
    const scNote = cfg.maint < 30
      ? 'IV/IO preferred over SC in birds/reptiles.'
      : `SC bolus max ~${Math.round(scMaxSite)} ml per site (5% BW) — split across multiple sites.`;

    return {
      maintDaily, deficitMl, lossDaily, total24h,
      replaceRate, maintRate, combinedRate,
      shockBolus, shockIncrement, scNote,
      cfg, h_,
    };
  }, [fluidMaint, species, weight, dehyd, hours, loss, shock]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;

  const dehyd_val = parseFloat(dehyd) || 0;
  const label = FLUID_SPECIES_LABEL[species] ?? species;

  return (
    <div className={`page ${styles.toolPage}`}>
      <div className="page-header">
        <h1 className="page-title">{th.fluidTitle}</h1>
      </div>
      <p className={styles.pageDesc}>{th.fluidDesc}</p>

      {/* Inputs */}
      <div className={styles.inputCard}>
        <div className={styles.inputGrid}>
          <div className={styles.inputField}>
            <label htmlFor="fl-species">{th.calcSpecies}</label>
            <select
              id="fl-species"
              value={species}
              onChange={e => setSpecies(e.target.value)}
            >
              {Object.entries(FLUID_SPECIES_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="fl-weight">{th.calcWeight}</label>
            <input
              id="fl-weight"
              type="number"
              min="0"
              step="0.01"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 3.5"
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="fl-dehyd">{th.fluidDehydration}</label>
            <select
              id="fl-dehyd"
              value={dehyd}
              onChange={e => setDehyd(e.target.value)}
            >
              <option value="0">0% (ไม่ขาดน้ำ)</option>
              <option value="5">5% (subclinical)</option>
              <option value="7">7% (skin tent)</option>
              <option value="10">10% (moderate)</option>
              <option value="12">12% (severe)</option>
              <option value="15">15% (life-threatening)</option>
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="fl-hours">{th.fluidReplaceHours}</label>
            <select
              id="fl-hours"
              value={hours}
              onChange={e => setHours(e.target.value)}
            >
              <option value="4">4 h (shock-level)</option>
              <option value="6">6 h</option>
              <option value="8">8 h</option>
              <option value="12">12 h</option>
              <option value="24">24 h (standard)</option>
            </select>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="fl-loss">{th.fluidOngoingLoss}</label>
            <input
              id="fl-loss"
              type="number"
              min="0"
              step="1"
              value={loss}
              onChange={e => setLoss(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          <div className={styles.checkboxRow}>
            <input
              id="fl-shock"
              type="checkbox"
              checked={shock}
              onChange={e => setShock(e.target.checked)}
            />
            <label htmlFor="fl-shock">{th.fluidShock}</label>
          </div>
        </div>
      </div>

      {/* Results */}
      {!result ? (
        <div className={styles.emptyResult}>{th.calcEnterWeight}</div>
      ) : (
        <div className={styles.results}>
          {/* Plan summary */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>
              Plan for {label} &middot; {parseFloat(weight).toFixed(2)} kg
            </p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.fluidMaint}
                value={result.maintDaily.toFixed(1)}
                unit="ml / 24h"
              />
              <ResultBox
                label={`${th.fluidDeficit} (${dehyd_val}%)`}
                value={result.deficitMl.toFixed(1)}
                unit="ml total"
              />
              <ResultBox
                label={th.fluidOngoing}
                value={result.lossDaily.toFixed(1)}
                unit="ml / 24h"
              />
              <ResultBox
                label={th.fluidTotal24h}
                value={result.total24h.toFixed(1)}
                unit="ml first 24h"
                kind="success"
              />
            </div>
          </div>

          {/* Hourly rates */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>Hourly delivery</p>
            <div className={styles.resultGrid}>
              <ResultBox
                label={th.fluidMaintRate}
                value={result.maintRate.toFixed(2)}
                unit="ml/h"
              />
              <ResultBox
                label={`${th.fluidDeficitRate} (${result.h_}h)`}
                value={result.replaceRate.toFixed(2)}
                unit="ml/h"
              />
              <ResultBox
                label={th.fluidCombinedRate}
                value={result.combinedRate.toFixed(2)}
                unit="ml/h"
                kind="success"
              />
            </div>
          </div>

          {/* Shock bolus (conditional) */}
          {shock && (
            <div className={styles.resultCard}>
              <p className={styles.resultCardTitle}>Shock bolus</p>
              <div className={styles.resultGrid}>
                <ResultBox
                  label={th.fluidShockDose}
                  value={result.shockBolus.toFixed(1)}
                  unit="ml IV/IO"
                  kind="danger"
                />
                <ResultBox
                  label={th.fluidShockIncrement}
                  value={result.shockIncrement.toFixed(1)}
                  unit="ml each"
                  kind="warn"
                />
              </div>
              <div className={styles.warnBlock}>
                ⚠ <strong>SHOCK PROTOCOL:</strong> Give 1/4 of calculated bolus (
                {result.shockIncrement.toFixed(1)} ml) over 10–15 min, reassess perfusion
                (CRT, pulse quality, MM color, BP). Repeat if no response. Do NOT give full{' '}
                {result.shockBolus.toFixed(1)} ml all at once — risk volume overload /
                pulmonary edema, especially in cats and birds.
              </div>
            </div>
          )}

          {/* Route notes */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>{th.fluidRouteNotes}</p>
            <div className={styles.warnBlock}>
              <strong>{label}:</strong> {result.cfg.notes}
              <br /><br />
              {result.scNote}
            </div>
          </div>

          {/* Crystalloid selection */}
          <div className={styles.resultCard}>
            <p className={styles.resultCardTitle}>{th.fluidCrystalloid}</p>
            <div className={styles.infoBlock}>
              <strong>Default:</strong> Lactated Ringer&apos;s (LRS, Hartmann&apos;s) — isotonic, balanced.<br />
              <strong>If hypoglycemia:</strong> add 2.5–5% dextrose to LRS (ferret, raptor, sugar glider, hummingbird).<br />
              <strong>If hyperkalemia (Addison&apos;s, urethral obstruction):</strong> 0.9% NaCl (no K+).<br />
              <strong>Amphibian:</strong> Amphibian Ringer&apos;s (or half-strength LRS) — bath route.<br />
              <strong>Reptile:</strong> ICTERIC fluid (Lactated Ringer&apos;s 1 : 0.9% NaCl 1 : 2.5% dextrose 1) often cited.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
