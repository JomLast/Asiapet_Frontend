import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Appointment, CreateAppointmentRequest } from '@shared/types';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../api/appointments';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import th from '../../i18n/th';
import styles from './AppointmentsPage.module.css';

type BadgeVariant = 'emergency' | 'urgent' | 'chronic' | 'routine' | 'info' | 'success' | 'neutral';

const STATUS_OPTIONS = ['pending', 'confirmed', 'done', 'cancelled'] as const;

function statusLabel(status?: string): string {
  switch (status) {
    case 'pending': return th.statusPending;
    case 'confirmed': return th.statusConfirmed;
    case 'done': return th.statusDone;
    case 'cancelled': return th.statusCancelled;
    default: return status ?? th.statusPending;
  }
}

function statusVariant(status?: string): BadgeVariant {
  switch (status) {
    case 'confirmed': return 'info';
    case 'done': return 'success';
    case 'cancelled': return 'neutral';
    default: return 'urgent';
  }
}

interface ApptFormData {
  date: string;
  time: string;
  patientHN: string;
  notes: string;
  status: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM: ApptFormData = {
  date: todayIso(),
  time: '',
  patientHN: '',
  notes: '',
  status: 'pending',
};

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [dateFilter, setDateFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<ApptFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments', dateFilter],
    queryFn: () => getAppointments(dateFilter || undefined),
  });

  const appointments = data?.items ?? [];

  // Group by date, sorted descending
  const groups = new Map<string, Appointment[]>();
  for (const appt of appointments) {
    const existing = groups.get(appt.date);
    if (existing) {
      existing.push(appt);
    } else {
      groups.set(appt.date, [appt]);
    }
  }
  const sortedDates = [...groups.keys()].sort((a, b) => b.localeCompare(a));

  function setField(field: keyof ApptFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function openCreate() {
    setForm({ ...EMPTY_FORM, date: todayIso() });
    setFormError('');
    setShowCreate(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date.trim()) return;
    setSaving(true);
    setFormError('');
    try {
      const body: CreateAppointmentRequest = {
        date: form.date,
        time: form.time,
        patientHN: form.patientHN,
        notes: form.notes,
        status: form.status,
      };
      await createAppointment(body);
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowCreate(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(appt: Appointment, newStatus: string) {
    setUpdatingId(appt.id);
    try {
      await updateAppointment(appt.id, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(appt: Appointment) {
    if (!window.confirm(`${th.confirmDelete}\n${appt.date}${appt.time ? ' ' + appt.time : ''}`)) return;
    try {
      await deleteAppointment(appt.id);
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch {
      // ignore
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.appointmentsList}</h1>
        <button className="btn btn-primary" onClick={openCreate} type="button">
          + {th.addAppointment}
        </button>
      </div>

      {/* Date filter */}
      <div className={styles.filterBar}>
        <label htmlFor="appt-date-filter" className={styles.filterLabel}>
          {th.filterByDate}
        </label>
        <input
          id="appt-date-filter"
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className={styles.dateInput}
        />
        {dateFilter && (
          <button
            className="btn btn-ghost"
            onClick={() => setDateFilter('')}
            type="button"
          >
            ✕ ล้าง
          </button>
        )}
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <p className={styles.count}>
            {th.total} {data?.total ?? appointments.length} {th.items}
          </p>

          {appointments.length === 0 ? (
            <div className={styles.empty}>{th.noData}</div>
          ) : (
            <div className={styles.groups}>
              {sortedDates.map(date => {
                const appts = groups.get(date) ?? [];
                return (
                  <div key={date} className={styles.dateGroup}>
                    <div className={styles.dateHeader}>{date}</div>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>{th.appointmentTime}</th>
                            <th>{th.patientHN}</th>
                            <th>{th.notes}</th>
                            <th>{th.status}</th>
                            <th>{th.actions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appts.map(appt => (
                            <tr key={appt.id}>
                              <td className={styles.timeCell}>{appt.time ?? '-'}</td>
                              <td className={styles.hnCell}>{appt.patientHN ?? '-'}</td>
                              <td className={styles.notesCell}>{appt.notes ?? '-'}</td>
                              <td>
                                <div className={styles.statusCell}>
                                  <Badge
                                    label={statusLabel(appt.status)}
                                    variant={statusVariant(appt.status)}
                                  />
                                  <select
                                    className={styles.statusSelect}
                                    value={appt.status ?? 'pending'}
                                    onChange={e => handleStatusChange(appt, e.target.value)}
                                    disabled={updatingId === appt.id}
                                    aria-label={th.status}
                                  >
                                    {STATUS_OPTIONS.map(s => (
                                      <option key={s} value={s}>
                                        {statusLabel(s)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <button
                                  className={`btn btn-ghost ${styles.deleteBtn}`}
                                  onClick={() => handleDelete(appt)}
                                  type="button"
                                  disabled={updatingId === appt.id}
                                >
                                  🗑 {th.delete}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showCreate && (
        <Modal title={th.createAppointment} onClose={() => setShowCreate(false)} width="480px">
          <form onSubmit={handleCreate} className={styles.form} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="af-date">{th.appointmentDate} *</label>
                <input
                  id="af-date"
                  type="date"
                  value={form.date}
                  onChange={e => setField('date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="af-time">{th.appointmentTime}</label>
                <input
                  id="af-time"
                  type="time"
                  value={form.time}
                  onChange={e => setField('time', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="af-hn">{th.patientHN}</label>
                <input
                  id="af-hn"
                  value={form.patientHN}
                  onChange={e => setField('patientHN', e.target.value)}
                  placeholder="เช่น PT001"
                />
              </div>
              <div className="form-group">
                <label htmlFor="af-status">{th.status}</label>
                <select
                  id="af-status"
                  value={form.status}
                  onChange={e => setField('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group full">
                <label htmlFor="af-notes">{th.notes}</label>
                <textarea
                  id="af-notes"
                  value={form.notes}
                  onChange={e => setField('notes', e.target.value)}
                  placeholder="หมายเหตุ"
                  rows={3}
                />
              </div>
            </div>

            {formError && (
              <div className={styles.error} role="alert">
                ⚠️ {formError}
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreate(false)}
                disabled={saving}
              >
                {th.cancel}
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? th.saving : th.save}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
