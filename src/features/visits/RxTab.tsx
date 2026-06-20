import React, { useState } from 'react';
import type { Visit, RxItem } from '@shared/types';
import { createVisit, updateVisit } from '../../api/patients';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, SquarePen } from 'lucide-react';
import th from '../../i18n/th';
import styles from './RxTab.module.css';

interface Props {
  hn: string;
  visits: Visit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RxTab({ hn, visits }: Props) {
  const queryClient = useQueryClient();
  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));
  const latestVisit = sorted[0];

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<RxItem[]>(latestVisit?.rx?.items ?? []);

  function addItem() {
    setItems(prev => [...prev, { name: '', instruction: '', qty: '' }]);
  }

  function updateItem(index: number, field: keyof RxItem, value: string) {
    setItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const visitDate = latestVisit?.date ?? todayIso();
      const rxRecord = { items, savedAt: new Date().toISOString() };
      if (latestVisit) {
        await updateVisit(hn, visitDate, { ...latestVisit, rx: rxRecord });
      } else {
        await createVisit(hn, { date: visitDate, rx: rxRecord });
      }
      await queryClient.invalidateQueries({ queryKey: ['patient', hn] });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setItems(latestVisit?.rx?.items ?? []);
    setEditMode(false);
  }

  const rxItems = editMode ? items : (latestVisit?.rx?.items ?? []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>{th.rxItems}</h3>
        <div className={styles.actions}>
          {!editMode && (
            <button className="btn btn-primary" onClick={() => { setItems(latestVisit?.rx?.items ?? []); setEditMode(true); }} type="button">
              <SquarePen size={14} /> {th.edit}
            </button>
          )}
          {editMode && (
            <>
              <button className="btn btn-secondary" onClick={addItem} type="button">
                + {th.addRxItem}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel} disabled={saving} type="button">
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

      {rxItems.length === 0 ? (
        <div className={styles.empty}>
          <p>{th.noRx}</p>
          {!editMode && (
            <button className="btn btn-primary" onClick={() => setEditMode(true)} type="button">
              + {th.addRxItem}
            </button>
          )}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span>{th.drugName}</span>
            <span>{th.instruction}</span>
            <span>{th.qty}</span>
            {editMode && <span></span>}
          </div>
          {rxItems.map((item, i) => (
            <div key={i} className={styles.dataRow}>
              {editMode ? (
                <>
                  <input
                    value={item.name}
                    onChange={e => updateItem(i, 'name', e.target.value)}
                    placeholder={th.drugName}
                  />
                  <input
                    value={item.instruction ?? ''}
                    onChange={e => updateItem(i, 'instruction', e.target.value)}
                    placeholder={th.instruction}
                  />
                  <input
                    value={item.qty ?? ''}
                    onChange={e => updateItem(i, 'qty', e.target.value)}
                    placeholder={th.qty}
                    style={{ width: '80px' }}
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(i)}
                    type="button"
                    aria-label="ลบ"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.drugName}>{item.name}</span>
                  <span className={styles.instruction}>{item.instruction ?? '—'}</span>
                  <span className={styles.qty}>{item.qty ?? '—'}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {latestVisit?.rx?.savedAt && !editMode && (
        <p className={styles.savedAt}>{th.savedAt}: {latestVisit.rx.savedAt}</p>
      )}
    </div>
  );
}
