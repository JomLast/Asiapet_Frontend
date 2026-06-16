import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@shared/types';
import { getBookings, updateBooking } from '../../api/bookings';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import th from '../../i18n/th';
import styles from './BookingsPage.module.css';

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

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const bookings = data?.items ?? [];

  async function handleStatusChange(booking: Booking, newStatus: string) {
    try {
      await updateBooking(booking.id, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch {
      // ignore
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{th.bookingsList}</h1>
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <p className={styles.count}>
            {th.total} {data?.total ?? bookings.length} {th.items}
          </p>

          {bookings.length === 0 ? (
            <div className={styles.empty}>{th.noData}</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{th.bookingName}</th>
                    <th>{th.ownerPhone}</th>
                    <th>{th.bookingPetName}</th>
                    <th>{th.species}</th>
                    <th>{th.date}</th>
                    <th>{th.time}</th>
                    <th>{th.bookingReason}</th>
                    <th>{th.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className={styles.nameCell}>{booking.name ?? '-'}</td>
                      <td>{booking.phone ?? '-'}</td>
                      <td>{booking.petName ?? '-'}</td>
                      <td>{booking.species ?? '-'}</td>
                      <td className={styles.dateCell}>{booking.date ?? '-'}</td>
                      <td className={styles.timeCell}>{booking.time ?? '-'}</td>
                      <td className={styles.reasonCell}>{booking.reason ?? '-'}</td>
                      <td>
                        <div className={styles.statusCell}>
                          <Badge
                            label={statusLabel(booking.status)}
                            variant={statusVariant(booking.status)}
                          />
                          <select
                            className={styles.statusSelect}
                            value={booking.status ?? 'pending'}
                            onChange={e => handleStatusChange(booking, e.target.value)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
