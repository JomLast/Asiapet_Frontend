import React, { useState, useEffect } from 'react';
import type { Visit, OpdRecord } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import th from '../../i18n/th';
import styles from './FollowupTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function FollowupTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recheckDate, setRecheckDate] = useState<string>(latestVisit?.opd?.recheckDate ?? '');
  const [recheckTime, setRecheckTime] = useState<string>(latestVisit?.opd?.recheckTime ?? '');
  const [recheckReason, setRecheckReason] = useState<string>(latestVisit?.opd?.recheckReason ?? '');

  useEffect(() => {
    setRecheckDate(latestVisit?.opd?.recheckDate ?? '');
    setRecheckTime(latestVisit?.opd?.recheckTime ?? '');
    setRecheckReason(latestVisit?.opd?.recheckReason ?? '');
    setEditMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisit?.date]);

  function handleCancel() {
    setRecheckDate(latestVisit?.opd?.recheckDate ?? '');
    setRecheckTime(latestVisit?.opd?.recheckTime ?? '');
    setRecheckReason(latestVisit?.opd?.recheckReason ?? '');
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      // Build updated OPD record, merging with existing and setting recheck fields.
      // recheckDate/Time/Reason are strings; exactOptionalPropertyTypes allows setting
      // optional string fields to any string value (including '').
      const baseOpd: OpdRecord = latestVisit?.opd ? { ...latestVisit.opd } : {};
      const updatedOpd: OpdRecord = {
        ...baseOpd,
        recheckDate,
        recheckTime,
        recheckReason,
      };

      if (latestVisit) {
        await updateVisit(hn, latestVisit.date, { ...latestVisit, opd: updatedOpd });
      } else {
        await createVisit(hn, { date: todayIso(), opd: updatedOpd });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  const displayDate = editMode ? recheckDate : (latestVisit?.opd?.recheckDate ?? '');
  const displayTime = editMode ? recheckTime : (latestVisit?.opd?.recheckTime ?? '');
  const displayReason = editMode ? recheckReason : (latestVisit?.opd?.recheckReason ?? '');
  const hasData = Boolean(displayDate || displayTime || displayReason);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>{th.followupTab}</h3>
          {latestVisit && (
            <span className={styles.visitDate}>{latestVisit.date}</span>
          )}
        </div>
        <div className={styles.actions}>
          {!editMode && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setRecheckDate(latestVisit?.opd?.recheckDate ?? '');
                setRecheckTime(latestVisit?.opd?.recheckTime ?? '');
                setRecheckReason(latestVisit?.opd?.recheckReason ?? '');
                setEditMode(true);
              }}
              type="button"
            >
              ✏️ {th.edit}
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
          ⚠️ {error}
        </div>
      )}

      {!editMode && !hasData ? (
        <div className={styles.empty}>
          <p>{th.noFollowup}</p>
          <button className="btn btn-primary" onClick={() => setEditMode(true)} type="button">
            + {th.edit}
          </button>
        </div>
      ) : (
        <div className={styles.fields}>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{th.recheckDate}</span>
            {editMode ? (
              <input
                type="date"
                value={recheckDate}
                onChange={e => setRecheckDate(e.target.value)}
                className={styles.fieldInput}
              />
            ) : (
              <span className={styles.fieldValue}>{displayDate || '—'}</span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{th.recheckTime}</span>
            {editMode ? (
              <input
                type="time"
                value={recheckTime}
                onChange={e => setRecheckTime(e.target.value)}
                className={styles.fieldInput}
              />
            ) : (
              <span className={styles.fieldValue}>{displayTime || '—'}</span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{th.recheckReason}</span>
            {editMode ? (
              <textarea
                value={recheckReason}
                onChange={e => setRecheckReason(e.target.value)}
                rows={3}
                placeholder="เหตุผลการนัดติดตาม"
                className={styles.reasonTextarea}
              />
            ) : (
              <span className={styles.fieldValue}>{displayReason || '—'}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
