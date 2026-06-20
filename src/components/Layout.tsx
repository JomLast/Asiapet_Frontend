import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import th from '../i18n/th';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <span className={styles.demoBadge} title="โหมดสาธิต — ข้อมูลตัวอย่าง">DEMO</span>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🐾</span>
          <span className={styles.brandName}>{th.appName}</span>
        </div>

        <nav className={styles.nav} aria-label="หลัก">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>🏠</span>
            {th.home}
          </NavLink>
          <NavLink
            to="/patients"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>🐶</span>
            {th.patients}
          </NavLink>
          <NavLink
            to="/owners"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>👤</span>
            {th.owners}
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>📅</span>
            {th.appointments}
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>📲</span>
            {th.bookings}
          </NavLink>
          <NavLink
            to="/drugs"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>💊</span>
            {th.drugReference}
          </NavLink>
          <NavLink
            to="/diseases"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>📋</span>
            {th.diseaseLibrary}
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{user.displayName?.[0] ?? user.email[0]?.toUpperCase() ?? 'U'}</div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{user.displayName ?? user.email}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout} type="button">
            <span className={styles.navIcon}>🚪</span>
            {th.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="เปิดเมนู"
            type="button"
          >
            ☰
          </button>
          <h1 className={styles.pageTitle}>{th.clinicSystem}</h1>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
