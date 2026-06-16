import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/auth/HomePage';
import PatientsPage from './features/patients/PatientsPage';
import PatientDetailPage from './features/patients/PatientDetailPage';
import OwnersPage from './features/owners/OwnersPage';
import AppointmentsPage from './features/appointments/AppointmentsPage';
import BookingsPage from './features/bookings/BookingsPage';
import DrugsPage from './features/drugs/DrugsPage';
import DiseasesPage from './features/diseases/DiseasesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — inside Layout shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/:hn" element={<PatientDetailPage />} />
              <Route path="owners" element={<OwnersPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="drugs" element={<DrugsPage />} />
              <Route path="diseases" element={<DiseasesPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
