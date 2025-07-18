// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '@/styles/pages/admin-dashboard.module.css'

// SVG Icons
const DashboardIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const EquipmentIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="6" width="20" height="8" rx="1"/>
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
)

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // ตรวจสอบการเข้าสู่ระบบ
    const adminToken = localStorage.getItem('adminToken')
    const adminUserData = localStorage.getItem('adminUser')
    
    if (!adminToken) {
      router.push('/admin')
      return
    }

    if (adminUserData) {
      setAdminUser(JSON.parse(adminUserData))
    }
    
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin')
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img 
            src="/logo.png" 
            alt="RSU Logo" 
            className={styles.logo}
          />
          <div>
            <h1 className={styles.headerTitle}>ระบบผู้ดูแล</h1>
            <p className={styles.headerSubtitle}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</p>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.adminBadge}>
            <span>🛡️</span>
            <span>Admin: {adminUser?.username || 'admin'}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <LogoutIcon />
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>ยินดีต้อนรับสู่ระบบผู้ดูแล</h2>
          <p className={styles.welcomeText}>
            จัดการระบบยืม-จองอุปกรณ์การแพทย์ คลินิกเวชกรรมมหาวิทยาลัยรังสิต
          </p>
        </section>

        {/* Statistics */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>156</div>
            <div className={styles.statLabel}>รายการยืมทั้งหมด</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>24</div>
            <div className={styles.statLabel}>รออนุมัติ</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>89</div>
            <div className={styles.statLabel}>อุปกรณ์ว่าง</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>12</div>
            <div className={styles.statLabel}>ผู้ใช้ออนไลน์</div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h3 className={styles.sectionTitle}>เมนูการจัดการ</h3>
          <div className={styles.actionsGrid}>
            
            <Link href="/admin/dashboard" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <DashboardIcon />
              </div>
              <span className={styles.actionText}>แดชบอร์ด</span>
            </Link>

            <Link href="/admin/users" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <UsersIcon />
              </div>
              <span className={styles.actionText}>จัดการผู้ใช้</span>
            </Link>

            <Link href="/admin/equipment" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <EquipmentIcon />
              </div>
              <span className={styles.actionText}>จัดการอุปกรณ์</span>
            </Link>

            <Link href="/admin/settings" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <SettingsIcon />
              </div>
              <span className={styles.actionText}>ตั้งค่าระบบ</span>
            </Link>
          </div>

          {/* Coming Soon Notice */}
          <div className={styles.comingSoon}>
            <strong>🚧 กำลังพัฒนา</strong>
            <br />
            ฟีเจอร์การจัดการต่างๆ กำลังอยู่ในระหว่างการพัฒนา จะเปิดให้ใช้งานเร็วๆ นี้
          </div>
        </section>
      </main>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {/* Home Button */}
        <Link href="/" className={styles.homeButton}>
          <HomeIcon />
          หน้าหลัก
        </Link>
        
        {/* Home Link (Red) */}
        <Link href="/" className={styles.floatingLogoutButton}>
          <LogoutIcon />
          ออกจากระบบ
        </Link>
      </div>
    </div>
  )
}