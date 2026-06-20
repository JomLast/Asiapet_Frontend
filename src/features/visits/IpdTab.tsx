import React, { useState, useEffect } from 'react';
import type { Visit, IpdRecord } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './IpdTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function IpdTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<string>(latestVisit?.ipd?.notes ?? '');

  useEffect(() => {
    setNotes(latestVisit?.ipd?.notes ?? '');
    setEditMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function handleCancel() {
    setNotes(latestVisit?.ipd?.notes ?? '');
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const ipdRecord: IpdRecord = {
        notes,
        savedAt: new Date().toISOString(),
      };
      if (latestVisit) {
        await updateVisit(hn, latestVisit.date, { ...latestVisit, ipd: ipdRecord });
      } else {
        await createVisit(hn, { date: todayIso(), ipd: ipdRecord });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const displayNotes = editMode ? notes : (latestVisit?.ipd?.notes ?? '');

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>{th.ipdTab}</h3>
          {latestVisit && (
            <span className={styles.visitDate}>{latestVisit.date}</span>
          )}
        </div>
        <div className={styles.actions}>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setNotes(latestVisit?.ipd?.notes ?? '');
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
        <label className={styles.notesLabel}>{th.ipdNotes}</label>
        {editMode ? (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={10}
            placeholder="บันทึกการรักษาผู้ป่วยใน IPD"
          />
        ) : displayNotes ? (
          <div className={styles.notesDisplay}>{displayNotes}</div>
        ) : (
          <div className={styles.empty}>
            <p>{th.noIpd}</p>
            {!editMode && (
              <button className="btn btn-primary" onClick={() => setEditMode(true)} type="button">
                + {th.edit}
              </button>
            )}
          </div>
        )}
      </div>

      {latestVisit?.ipd?.savedAt && !editMode && (
        <p className={styles.savedAt}>{th.savedAt}: {latestVisit.ipd.savedAt}</p>
      )}
    </div>
  );
}
