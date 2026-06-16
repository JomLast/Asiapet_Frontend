import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Owner, CreateOwnerRequest, UpdateOwnerRequest } from '@shared/types';
import { getOwners, createOwner, updateOwner, deleteOwner } from '../../api/owners';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import th from '../../i18n/th';
import styles from './OwnersPage.module.css';

interface OwnerFormData {
  name: string;
  phone: string;
  lineId: string;
  facebook: string;
  notes: string;
}

const EMPTY_FORM: OwnerFormData = { name: '', phone: '', lineId: '', facebook: '', notes: '' };

function ownerToForm(o: Owner): OwnerFormData {
  return {
    name: o.name,
    phone: o.phone ?? '',
    lineId: o.lineId ?? '',
    facebook: o.facebook ?? '',
    notes: o.notes ?? '',
  };
}

export default function OwnersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Owner | null>(null);
  const [form, setForm] = useState<OwnerFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['owners', search],
    queryFn: () => getOwners(search || undefined),
  });

  const owners = data?.items ?? [];

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(owner: Owner) {
    setEditTarget(owner);
    setForm(ownerToForm(owner));
    setFormError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  function setField(field: keyof OwnerFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setFormError('');
    try {
      if (editTarget) {
        const body: UpdateOwnerRequest = {
          name: form.name,
          phone: form.phone,
          lineId: form.lineId,
          facebook: form.facebook,
          notes: form.notes,
        };
        await updateOwner(editTarget.id, body);
      } else {
        const body: CreateOwnerRequest = {
          name: form.name,
          phone: form.phone,
          lineId: form.lineId,
          facebook: form.facebook,
          notes: form.notes,
        };
        await createOwner(body);
      }
      await queryClient.invalidateQueries({ queryKey: ['owners'] });
      closeModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(owner: Owner) {
    if (!window.confirm(`${th.confirmDelete}\n${owner.name}`)) return;
    try {
      await deleteOwner(owner.id);
      await queryClient.invalidateQueries({ queryKey: ['owners'] });
    } catch {
      // ignore — user stays on page
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.ownersList}</h1>
        <button className="btn btn-primary" onClick={openCreate} type="button">
          + {th.addOwner}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder={th.searchOwner}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label={th.searchOwner}
        />
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <p className={styles.count}>
            {th.total} {data?.total ?? owners.length} {th.items}
          </p>
          {owners.length === 0 ? (
            <div className={styles.empty}>{th.noData}</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{th.name}</th>
                    <th>{th.ownerPhone}</th>
                    <th>{th.ownerLine}</th>
                    <th>{th.ownerFacebook}</th>
                    <th>{th.notes}</th>
                    <th>{th.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map(owner => (
                    <tr key={owner.id}>
                      <td className={styles.nameCell}>{owner.name}</td>
                      <td>{owner.phone ?? '-'}</td>
                      <td>{owner.lineId ?? '-'}</td>
                      <td>{owner.facebook ?? '-'}</td>
                      <td className={styles.notesCell}>{owner.notes ?? '-'}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className="btn btn-ghost"
                            onClick={() => openEdit(owner)}
                            type="button"
                          >
                            ✏️ {th.edit}
                          </button>
                          <button
                            className={`btn btn-ghost ${styles.deleteBtn}`}
                            onClick={() => handleDelete(owner)}
                            type="button"
                          >
                            🗑 {th.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showModal && (
        <Modal
          title={editTarget ? th.editOwner : th.createOwner}
          onClose={closeModal}
          width="560px"
        >
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor="of-name">{th.name} *</label>
                <input
                  id="of-name"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  required
                  placeholder="ชื่อเจ้าของ"
                />
              </div>
              <div className="form-group">
                <label htmlFor="of-phone">{th.ownerPhone}</label>
                <input
                  id="of-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  placeholder="เบอร์โทร"
                />
              </div>
              <div className="form-group">
                <label htmlFor="of-line">{th.ownerLine}</label>
                <input
                  id="of-line"
                  value={form.lineId}
                  onChange={e => setField('lineId', e.target.value)}
                  placeholder="Line ID"
                />
              </div>
              <div className="form-group full">
                <label htmlFor="of-fb">{th.ownerFacebook}</label>
                <input
                  id="of-fb"
                  value={form.facebook}
                  onChange={e => setField('facebook', e.target.value)}
                  placeholder="Facebook"
                />
              </div>
              <div className="form-group full">
                <label htmlFor="of-notes">{th.notes}</label>
                <textarea
                  id="of-notes"
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
                onClick={closeModal}
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
