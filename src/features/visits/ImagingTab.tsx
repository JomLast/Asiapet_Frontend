import React, { useState, useEffect } from 'react';
import type { Visit } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './ImagingTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function getImagingNotes(visit: Visit | undefined): string {
  const val = visit?.imaging?.['notes'];
  return typeof val === 'string' ? val : '';
}

export default function ImagingTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<string>(getImagingNotes(latestVisit));

  useEffect(() => {
    setNotes(getImagingNotes(latestVisit));
    setEditMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function handleCancel() {
    setNotes(getImagingNotes(latestVisit));
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const imaging: Record<string, unknown> = { notes };
      if (latestVisit) {
        await updateVisit(hn, latestVisit.date, { ...latestVisit, imaging });
      } else {
        await createVisit(hn, { date: todayIso(), imaging });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const displayNotes = editMode ? notes : getImagingNotes(latestVisit);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>{th.imagingTab}</h3>
          {latestVisit && (
            <span className={styles.visitDate}>{latestVisit.date}</span>
          )}
        </div>
        <div className={styles.actions}>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setNotes(getImagingNotes(latestVisit));
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

      <div className={styles.notesGroup}>
        <label className={styles.notesLabel}>{th.imagingNotes}</label>
        {editMode ? (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={8}
            placeholder="บันทึกผลภาพถ่าย X-ray, Ultrasound ฯลฯ"
          />
        ) : displayNotes ? (
          <div className={styles.notesDisplay}>{displayNotes}</div>
        ) : (
          <div className={styles.empty}>
            <p>{th.noImaging}</p>
            {!editMode && (
              <button className="btn btn-primary" onClick={() => setEditMode(true)} type="button">
                + {th.edit}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
