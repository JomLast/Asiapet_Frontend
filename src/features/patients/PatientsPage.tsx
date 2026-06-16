import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient } from '../../api/patients';
import type { CreatePatientRequest } from '@shared/types';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import PatientForm from './PatientForm';
import th from '../../i18n/th';
import styles from './PatientsPage.module.css';

export default function PatientsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => getPatients(search || undefined),
  });

  async function handleCreate(body: CreatePatientRequest) {
    await createPatient(body);
    await queryClient.invalidateQueries({ queryKey: ['patients'] });
    setShowCreate(false);
  }

  const patients = data?.items ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.patientList}</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
          type="button"
        >
          + {th.addPatient}
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder={th.searchPatient}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label={th.searchPatient}
        />
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <p className={styles.count}>
            {th.total} {data?.total ?? patients.length} {th.items}
          </p>
          {patients.length === 0 ? (
            <div className={styles.empty}>{th.noData}</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{th.hn}</th>
                    <th>{th.name}</th>
                    <th>{th.species}</th>
                    <th>{th.breed}</th>
                    <th>{th.sex}</th>
                    <th>{th.owner}</th>
                    <th>{th.ownerPhone}</th>
                    <th>{th.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr
                      key={p.hn}
                      className={styles.row}
                      onClick={() => navigate(`/patients/${encodeURIComponent(p.hn)}`)}
                    >
                      <td className={styles.hnCell}>{p.hn}</td>
                      <td className={styles.nameCell}>{p.name}</td>
                      <td>{p.species ?? '-'}</td>
                      <td>{p.breed ?? '-'}</td>
                      <td>{p.sex ?? '-'}</td>
                      <td>{p.owner ?? '-'}</td>
                      <td>{p.ownerPhone ?? '-'}</td>
                      <td>
                        <button
                          className="btn btn-ghost"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/patients/${encodeURIComponent(p.hn)}`);
                          }}
                          type="button"
                        >
                          {th.view}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showCreate && (
        <Modal title={th.createPatient} onClose={() => setShowCreate(false)} width="640px">
          <PatientForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      )}
    </div>
  );
}
