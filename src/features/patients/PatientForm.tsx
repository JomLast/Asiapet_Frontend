import React, { useState } from 'react';
import type { CreatePatientRequest } from '@shared/types';
import th from '../../i18n/th';
import { AlertTriangle } from 'lucide-react';
import styles from './PatientForm.module.css';

interface Props {
  initial?: Partial<CreatePatientRequest>;
  onSubmit: (data: CreatePatientRequest) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const SPECIES_OPTIONS = ['สุนัข (Dog)', 'แมว (Cat)', 'กระต่าย (Rabbit)', 'นก (Bird)', 'หนู (Rodent)', 'เฟอร์เรต (Ferret)', 'สัตว์เลื้อยคลาน (Reptile)', 'อื่นๆ'];
const SEX_OPTIONS = ['ผู้ (Male)', 'เมีย (Female)', 'ผู้ตอน (Neutered Male)', 'เมียตอน (Spayed Female)'];

export default function PatientForm({ initial = {}, onSubmit, onCancel, isEdit = false }: Props) {
  const [form, setForm] = useState<CreatePatientRequest>({
    hn: initial.hn ?? '',
    name: initial.name ?? '',
    species: initial.species ?? '',
    breed: initial.breed ?? '',
    sex: initial.sex ?? '',
    birthdate: initial.birthdate ?? '',
    color: initial.color ?? '',
    owner: initial.owner ?? '',
    ownerPhone: initial.ownerPhone ?? '',
    ownerLine: initial.ownerLine ?? '',
    ownerFacebook: initial.ownerFacebook ?? '',
    allergies: initial.allergies ?? '',
    mainDisease: initial.mainDisease ?? '',
    visits: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof CreatePatientRequest, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.hn.trim() || !form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : th.errorSave);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{th.patientInfo}</legend>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pf-hn">{th.hn} *</label>
            <input
              id="pf-hn"
              value={form.hn}
              onChange={e => set('hn', e.target.value)}
              required
              disabled={isEdit}
              placeholder="เช่น PT001"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-name">{th.name} *</label>
            <input
              id="pf-name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              placeholder="ชื่อสัตว์"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-species">{th.species}</label>
            <select
              id="pf-species"
              value={form.species ?? ''}
              onChange={e => set('species', e.target.value)}
            >
              <option value="">-- เลือกชนิด --</option>
              {SPECIES_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pf-breed">{th.breed}</label>
            <input
              id="pf-breed"
              value={form.breed ?? ''}
              onChange={e => set('breed', e.target.value)}
              placeholder="พันธุ์"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-sex">{th.sex}</label>
            <select
              id="pf-sex"
              value={form.sex ?? ''}
              onChange={e => set('sex', e.target.value)}
            >
              <option value="">-- เลือกเพศ --</option>
              {SEX_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pf-birth">{th.birthdate}</label>
            <input
              id="pf-birth"
              type="date"
              value={form.birthdate ?? ''}
              onChange={e => set('birthdate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-color">{th.color}</label>
            <input
              id="pf-color"
              value={form.color ?? ''}
              onChange={e => set('color', e.target.value)}
              placeholder="สีขน"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-allergies">{th.allergies}</label>
            <input
              id="pf-allergies"
              value={form.allergies ?? ''}
              onChange={e => set('allergies', e.target.value)}
              placeholder="ยาที่แพ้"
            />
          </div>
          <div className="form-group full">
            <label htmlFor="pf-disease">{th.mainDisease}</label>
            <input
              id="pf-disease"
              value={form.mainDisease ?? ''}
              onChange={e => set('mainDisease', e.target.value)}
              placeholder="โรคประจำตัว"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{th.ownerInfo}</legend>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pf-owner">{th.owner}</label>
            <input
              id="pf-owner"
              value={form.owner ?? ''}
              onChange={e => set('owner', e.target.value)}
              placeholder="ชื่อเจ้าของ"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-phone">{th.ownerPhone}</label>
            <input
              id="pf-phone"
              type="tel"
              value={form.ownerPhone ?? ''}
              onChange={e => set('ownerPhone', e.target.value)}
              placeholder="เบอร์โทร"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-line">{th.ownerLine}</label>
            <input
              id="pf-line"
              value={form.ownerLine ?? ''}
              onChange={e => set('ownerLine', e.target.value)}
              placeholder="Line ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pf-fb">{th.ownerFacebook}</label>
            <input
              id="pf-fb"
              value={form.ownerFacebook ?? ''}
              onChange={e => set('ownerFacebook', e.target.value)}
              placeholder="Facebook"
            />
          </div>
        </div>
      </fieldset>

      {error && (
        <div className={styles.error} role="alert"><AlertTriangle size={14} /> {error}</div>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          {th.cancel}
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? th.saving : th.save}
        </button>
      </div>
    </form>
  );
}
