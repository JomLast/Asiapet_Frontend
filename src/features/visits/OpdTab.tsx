import React, { useState, useEffect } from 'react';
import type { Visit, OpdRecord } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './OpdTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function OpdTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();

  // Pick the most recent visit
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(!latestVisit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [visitDate, setVisitDate] = useState(latestVisit?.date ?? todayIso());

  const [opd, setOpd] = useState<OpdRecord>(latestVisit?.opd ?? {});

  // Reset when visits change
  useEffect(() => {
    if (latestVisit) {
      setOpd(latestVisit.opd ?? {});
      setVisitDate(latestVisit.date);
      setEditMode(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function setField(field: string, value: string) {
    setOpd(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const visitBody: Visit = { date: visitDate, opd };
      if (latestVisit && latestVisit.date === visitDate) {
        await updateVisit(hn, visitDate, { ...latestVisit, opd });
      } else if (latestVisit) {
        // New date — create new visit
        await createVisit(hn, visitBody);
      } else {
        await createVisit(hn, visitBody);
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  function handleNewVisit() {
    setOpd({});
    setVisitDate(todayIso());
    setEditMode(true);
  }

  if (!latestVisit && !editMode) {
    return (
      <div className={styles.empty}>
        <p>{th.noVisit}</p>
        <button className="btn btn-primary" onClick={handleNewVisit} type="button">
          + {th.addVisit}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.dateRow}>
          <label htmlFor="opd-date">{th.visitDate}</label>
          {editMode ? (
            <input
              id="opd-date"
              type="date"
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              className={styles.dateInput}
            />
          ) : (
            <span className={styles.dateDisplay}>{visitDate}</span>
          )}
        </div>
        <div className={styles.toolbarActions}>
          {!editMode && (
            <>
              <button className="btn btn-secondary" onClick={handleNewVisit} type="button">
                + {th.addVisit}
              </button>
              <button className="btn btn-primary" onClick={() => setEditMode(true)} type="button">
                <SquarePen size={14} /> {th.edit}
              </button>
            </>
          )}
          {editMode && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setOpd(latestVisit?.opd ?? {});
                  setEditMode(false);
                }}
                disabled={saving}
                type="button"
              >
                {th.cancel}
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} type="button">
                {saving ? th.saving : th.save}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className={styles.error} role="alert"><AlertTriangle size={14} /> {error}</div>}

      <div className={styles.grid}>
        <OpdField label={th.weight} value={opd.weight} field="weight" editMode={editMode} onChange={setField} placeholder="kg" />
        <OpdField label={th.temp} value={opd.temp} field="temp" editMode={editMode} onChange={setField} placeholder="°C" />
        <OpdField label={th.heartRate} value={opd.hr} field="hr" editMode={editMode} onChange={setField} placeholder="ครั้ง/นาที" />
        <OpdField label={th.respRate} value={opd.rr} field="rr" editMode={editMode} onChange={setField} placeholder="ครั้ง/นาที" />
        <OpdField label={th.bloodPressure} value={opd.bp} field="bp" editMode={editMode} onChange={setField} placeholder="mmHg" />
      </div>

      <div className={styles.textFields}>
        <OpdTextarea label={th.chiefComplaint} value={opd.cc} field="cc" editMode={editMode} onChange={setField} />
        <OpdTextarea label={th.history} value={opd.hx} field="hx" editMode={editMode} onChange={setField} />
        <OpdTextarea
          label={th.physicalExam}
          value={typeof opd.pe === 'string' ? opd.pe : ''}
          field="pe"
          editMode={editMode}
          onChange={(f, v) => setOpd(prev => ({ ...prev, [f]: v }))}
        />
        <OpdTextarea label={th.diffDiagnosis} value={opd.ddx} field="ddx" editMode={editMode} onChange={setField} />
        <OpdTextarea label={th.diagnosis} value={opd.dx} field="dx" editMode={editMode} onChange={setField} />
        <OpdTextarea label={th.treatmentPlan} value={opd.plan} field="plan" editMode={editMode} onChange={setField} />
      </div>

      {opd.savedAt && !editMode && (
        <p className={styles.savedAt}>{th.savedAt}: {opd.savedAt}</p>
      )}
    </div>
  );
}

function OpdField({
  label, value, field, editMode, onChange, placeholder,
}: {
  label: string;
  value?: string | undefined;
  field: keyof OpdRecord;
  editMode: boolean;
  onChange: (f: string, v: string) => void;
  placeholder?: string | undefined;
}) {
  return (
    <div className={styles.fieldItem}>
      <span className={styles.fieldLabel}>{label}</span>
      {editMode ? (
        <input
          value={value ?? ''}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          className={styles.fieldInput}
        />
      ) : (
        <span className={styles.fieldValue}>{value ?? '—'}</span>
      )}
    </div>
  );
}

function OpdTextarea({
  label, value, field, editMode, onChange,
}: {
  label: string;
  value?: string | undefined;
  field: string;
  editMode: boolean;
  onChange: (f: string, v: string) => void;
}) {
  return (
    <div className={styles.textareaGroup}>
      <label className={styles.textareaLabel}>{label}</label>
      {editMode ? (
        <textarea
          value={value ?? ''}
          onChange={e => onChange(field, e.target.value)}
          rows={3}
        />
      ) : (
        <div className={styles.textareaDisplay}>
          {value || <span className="text-muted">—</span>}
        </div>
      )}
    </div>
  );
}
