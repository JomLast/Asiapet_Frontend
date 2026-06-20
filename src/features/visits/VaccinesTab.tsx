import React, { useState, useEffect } from 'react';
import type { Visit, VaccineRecord } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './VaccinesTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_VACCINE: VaccineRecord = { name: '' };

export default function VaccinesTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(latestVisit?.vaccines ?? []);

  useEffect(() => {
    setVaccines(latestVisit?.vaccines ?? []);
    setEditMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function addVaccine() {
    setVaccines(prev => [...prev, { ...EMPTY_VACCINE }]);
  }

  function removeVaccine(i: number) {
    setVaccines(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateVaccine(i: number, field: string, value: string) {
    setVaccines(prev =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    );
  }

  function handleCancel() {
    setVaccines(latestVisit?.vaccines ?? []);
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (latestVisit) {
        await updateVisit(hn, latestVisit.date, { ...latestVisit, vaccines });
      } else {
        await createVisit(hn, { date: todayIso(), vaccines });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const displayVaccines = editMode ? vaccines : (latestVisit?.vaccines ?? []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>{th.vaccinesTab}</h3>
          {latestVisit && (
            <span className={styles.visitDate}>{latestVisit.date}</span>
          )}
        </div>
        <div className={styles.actions}>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setVaccines(latestVisit?.vaccines ?? []);
                setEditMode(true);
              }}
              type="button"
            >
              <SquarePen size={14} /> {th.edit}
            </button>
          )}
          {editMode && (
            <>
              <button className="btn btn-secondary" onClick={addVaccine} type="button">
                + {th.addVaccine}
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

      {displayVaccines.length === 0 ? (
        <div className={styles.empty}>
          <p>{th.noVaccines}</p>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setVaccines([{ ...EMPTY_VACCINE }]);
                setEditMode(true);
              }}
              type="button"
            >
              + {th.addVaccine}
            </button>
          )}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span>{th.vaccineName}</span>
            <span>{th.vaccineDate}</span>
            <span>{th.vet}</span>
            <span>{th.route}</span>
            <span>{th.vaccineNextDue}</span>
            {editMode && <span />}
          </div>
          {displayVaccines.map((v, i) => (
            <div key={i} className={styles.dataRow}>
              {editMode ? (
                <>
                  <input
                    value={v.name}
                    onChange={e => updateVaccine(i, 'name', e.target.value)}
                    placeholder={th.vaccineName}
                  />
                  <input
                    type="date"
                    value={v.date ?? ''}
                    onChange={e => updateVaccine(i, 'date', e.target.value)}
                  />
                  <input
                    value={v.vet ?? ''}
                    onChange={e => updateVaccine(i, 'vet', e.target.value)}
                    placeholder={th.vet}
                  />
                  <input
                    value={v.route ?? ''}
                    onChange={e => updateVaccine(i, 'route', e.target.value)}
                    placeholder={th.route}
                  />
                  <input
                    type="date"
                    value={v.nextDue ?? ''}
                    onChange={e => updateVaccine(i, 'nextDue', e.target.value)}
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeVaccine(i)}
                    type="button"
                    aria-label={th.delete}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.cellName}>{v.name}</span>
                  <span className={styles.cellDate}>{v.date ?? '—'}</span>
                  <span className={styles.cellVet}>{v.vet ?? '—'}</span>
                  <span className={styles.cellRoute}>{v.route ?? '—'}</span>
                  <span className={styles.cellNextDue}>{v.nextDue ?? '—'}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
