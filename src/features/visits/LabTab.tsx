import React, { useState, useEffect } from 'react';
import type { Visit, LabRecord, LabValue } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './LabTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_ROW: LabValue = { name: '' };

export default function LabTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [species, setSpecies] = useState<string>(latestVisit?.lab?.species ?? '');
  const [rows, setRows] = useState<LabValue[]>(latestVisit?.lab?.values ?? []);
  const [smear, setSmear] = useState<string>(latestVisit?.lab?.smear ?? '');

  useEffect(() => {
    setSpecies(latestVisit?.lab?.species ?? '');
    setRows(latestVisit?.lab?.values ?? []);
    setSmear(latestVisit?.lab?.smear ?? '');
    setEditMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function addRow() {
    setRows(prev => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(i: number) {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: string, value: string) {
    setRows(prev =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)),
    );
  }

  function handleCancel() {
    setSpecies(latestVisit?.lab?.species ?? '');
    setRows(latestVisit?.lab?.values ?? []);
    setSmear(latestVisit?.lab?.smear ?? '');
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const labRecord: LabRecord = {
        values: rows,
        savedAt: new Date().toISOString(),
        ...(species ? { species } : {}),
        ...(smear ? { smear } : {}),
      };
      if (latestVisit) {
        await updateVisit(hn, latestVisit.date, { ...latestVisit, lab: labRecord });
      } else {
        await createVisit(hn, { date: todayIso(), lab: labRecord });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const displayRows = editMode ? rows : (latestVisit?.lab?.values ?? []);
  const displaySpecies = editMode ? species : (latestVisit?.lab?.species ?? '');
  const displaySmear = editMode ? smear : (latestVisit?.lab?.smear ?? '');

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>{th.labTab}</h3>
          {latestVisit && (
            <span className={styles.visitDate}>{latestVisit.date}</span>
          )}
        </div>
        <div className={styles.actions}>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setSpecies(latestVisit?.lab?.species ?? '');
                setRows(latestVisit?.lab?.values ?? []);
                setSmear(latestVisit?.lab?.smear ?? '');
                setEditMode(true);
              }}
              type="button"
            >
              <SquarePen size={14} /> {th.edit}
            </button>
          )}
          {editMode && (
            <>
              <button
                className="btn btn-secondary"
                onClick={addRow}
                type="button"
              >
                + {th.addLabRow}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
                type="button"
              >
                {th.cancel}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                type="button"
              >
                {saving ? th.saving : th.save}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* Species field */}
      <div className={styles.speciesRow}>
        <span className={styles.fieldLabel}>{th.labSpecies}</span>
        {editMode ? (
          <input
            value={species}
            onChange={e => setSpecies(e.target.value)}
            placeholder="เช่น สุนัข, แมว"
            className={styles.speciesInput}
          />
        ) : (
          <span className={styles.fieldValue}>{displaySpecies || '—'}</span>
        )}
      </div>

      {/* Lab values table */}
      {(displayRows.length > 0 || editMode) ? (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span>{th.labName}</span>
            <span>{th.labResult}</span>
            <span>{th.labUnit}</span>
            <span>{th.labMin}</span>
            <span>{th.labMax}</span>
            {editMode && <span />}
          </div>
          {displayRows.map((row, i) => (
            <div key={i} className={styles.dataRow}>
              {editMode ? (
                <>
                  <input
                    value={row.name}
                    onChange={e => updateRow(i, 'name', e.target.value)}
                    placeholder={th.labName}
                  />
                  <input
                    value={String(row.result ?? '')}
                    onChange={e => updateRow(i, 'result', e.target.value)}
                    placeholder={th.labResult}
                  />
                  <input
                    value={String(row.unit ?? '')}
                    onChange={e => updateRow(i, 'unit', e.target.value)}
                    placeholder={th.labUnit}
                  />
                  <input
                    value={String(row.normal_min ?? '')}
                    onChange={e => updateRow(i, 'normal_min', e.target.value)}
                    placeholder={th.labMin}
                  />
                  <input
                    value={String(row.normal_max ?? '')}
                    onChange={e => updateRow(i, 'normal_max', e.target.value)}
                    placeholder={th.labMax}
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeRow(i)}
                    type="button"
                    aria-label={th.delete}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.cellName}>{row.name}</span>
                  <span className={styles.cellResult}>{String(row.result ?? '—')}</span>
                  <span className={styles.cellUnit}>{String(row.unit ?? '—')}</span>
                  <span className={styles.cellNormal}>{String(row.normal_min ?? '—')}</span>
                  <span className={styles.cellNormal}>{String(row.normal_max ?? '—')}</span>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{th.noLab}</p>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
              type="button"
            >
              + {th.addLabRow}
            </button>
          )}
        </div>
      )}

      {/* Blood smear */}
      <div className={styles.smearGroup}>
        <label className={styles.smearLabel}>{th.labSmear}</label>
        {editMode ? (
          <textarea
            value={smear}
            onChange={e => setSmear(e.target.value)}
            rows={3}
            placeholder="บันทึกผล Blood Smear"
          />
        ) : (
          <div className={styles.smearDisplay}>
            {displaySmear || <span className="text-muted">—</span>}
          </div>
        )}
      </div>

      {latestVisit?.lab?.savedAt && !editMode && (
        <p className={styles.savedAt}>{th.savedAt}: {latestVisit.lab.savedAt}</p>
      )}
    </div>
  );
}
