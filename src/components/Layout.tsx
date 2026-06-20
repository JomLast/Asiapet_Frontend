import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PawPrint, Home, Dog, User, CalendarDays, Inbox, Pill, BookOpen, LogOut, Menu } from 'lucide-react';
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
          <PawPrint className={styles.brandIcon} size={22} />
          <span className={styles.brandName}>{th.appName}</span>
        </div>

        <nav className={styles.nav} aria-label="หลัก">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Home className={styles.navIcon} size={20} />
            {th.home}
          </NavLink>
          <NavLink
            to="/patients"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Dog className={styles.navIcon} size={20} />
            {th.patients}
          </NavLink>
          <NavLink
            to="/owners"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <User className={styles.navIcon} size={20} />
            {th.owners}
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <CalendarDays className={styles.navIcon} size={20} />
            {th.appointments}
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Inbox className={styles.navIcon} size={20} />
            {th.bookings}
          </NavLink>
          <NavLink
            to="/drugs"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Pill className={styles.navIcon} size={20} />
            {th.drugReference}
          </NavLink>
          <NavLink
            to="/diseases"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <BookOpen className={styles.navIcon} size={20} />
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
            <LogOut className={styles.navIcon} size={18} />
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
            <Menu size={24} />
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
