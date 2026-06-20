import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatient, updatePatient } from '../../api/patients';
import type { UpdatePatientRequest } from '@shared/types';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import PatientForm from './PatientForm';
import OpdTab from '../visits/OpdTab';
import RxTab from '../visits/RxTab';
import HistoryTab from '../visits/HistoryTab';
import LabTab from '../visits/LabTab';
import ImagingTab from '../visits/ImagingTab';
import IpdTab from '../visits/IpdTab';
import FollowupTab from '../visits/FollowupTab';
import VaccinesTab from '../visits/VaccinesTab';
import th from '../../i18n/th';
import { SquarePen } from 'lucide-react';
import styles from './PatientDetailPage.module.css';

type TabId = 'opd' | 'rx' | 'history' | 'lab' | 'imaging' | 'ipd' | 'followup' | 'vaccines';

const TABS: { id: TabId; label: string }[] = [
  { id: 'opd', label: th.opdTab },
  { id: 'rx', label: th.rxTab },
  { id: 'history', label: th.historyTab },
  { id: 'lab', label: th.labTab },
  { id: 'imaging', label: th.imagingTab },
  { id: 'ipd', label: th.ipdTab },
  { id: 'followup', label: th.followupTab },
  { id: 'vaccines', label: th.vaccinesTab },
];

export default function PatientDetailPage() {
  const { hn } = useParams<{ hn: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('opd');
  const [showEdit, setShowEdit] = useState(false);

  const safeHn = hn ?? '';

  const { data: patient, isLoading, isError, refetch } = useQuery({
    queryKey: ['patient', safeHn],
    queryFn: () => getPatient(safeHn),
    enabled: Boolean(safeHn),
  });

  async function handleUpdate(body: UpdatePatientRequest) {
    await updatePatient(safeHn, body);
    await queryClient.invalidateQueries({ queryKey: ['patient', safeHn] });
    setShowEdit(false);
  }

  if (isLoading) return <Spinner />;
  if (isError || !patient) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <div className="page">
      {/* Back button */}
      <button
        className={`btn btn-secondary ${styles.backBtn}`}
        onClick={() => navigate('/patients')}
        type="button"
      >
        ← {th.back}
      </button>

      {/* Patient header card */}
      <div className={`card ${styles.headerCard}`}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.patientName}>{patient.name}</h1>
            <p className={styles.hn}>HN: {patient.hn}</p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowEdit(true)}
            type="button"
          >
            <SquarePen size={14} /> {th.edit}
          </button>
        </div>

        <div className={styles.infoGrid}>
          <InfoItem label={th.species} value={patient.species} />
          <InfoItem label={th.breed} value={patient.breed} />
          <InfoItem label={th.sex} value={patient.sex} />
          <InfoItem label={th.birthdate} value={patient.birthdate} />
          <InfoItem label={th.color} value={patient.color} />
          <InfoItem label={th.owner} value={patient.owner} />
          <InfoItem label={th.ownerPhone} value={patient.ownerPhone} />
          {patient.ownerLine && <InfoItem label={th.ownerLine} value={patient.ownerLine} />}
          {patient.mainDisease && <InfoItem label={th.mainDisease} value={patient.mainDisease} />}
          {patient.allergies && (
            <InfoItem label={th.allergies} value={patient.allergies} danger />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className={`card ${styles.tabPanel}`} role="tabpanel">
        {activeTab === 'opd' && <OpdTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'rx' && <RxTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'history' && <HistoryTab visits={patient.visits} />}
        {activeTab === 'lab' && <LabTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'imaging' && <ImagingTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'ipd' && <IpdTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'followup' && <FollowupTab hn={safeHn} visits={patient.visits} />}
        {activeTab === 'vaccines' && <VaccinesTab hn={safeHn} visits={patient.visits} />}
      </div>

      {showEdit && (
        <Modal title={th.editPatient} onClose={() => setShowEdit(false)} width="640px">
          <PatientForm
            initial={patient}
            onSubmit={handleUpdate}
            onCancel={() => setShowEdit(false)}
            isEdit
          />
        </Modal>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value?: string | undefined;
  danger?: boolean | undefined;
}) {
  if (!value) return null;
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={`${styles.infoValue} ${danger ? styles.danger : ''}`}>{value}</span>
    </div>
  );
}
