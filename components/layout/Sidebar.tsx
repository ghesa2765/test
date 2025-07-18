// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/components/sidebar.module.css'

// Icons
const Package = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

const Plus = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const Calendar = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const History = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 7v5l4 2"/>
  </svg>
)

const Search = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const ChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
)

const ChevronRight = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
)

const X = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

interface MenuItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: string
}

interface SidebarProps {
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobile: boolean
  userData: {
    id: string
    name: string
    role: string
    faculty: string
    isLoggedIn: boolean
  }
  pathname: string
}

const RSULogo = ({ size = 64, collapsed = false }: { size?: number; collapsed?: boolean }) => (
  <div className={styles.logoContainer}>
    <div className={styles.logoIcon} style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="RSU Medical Clinic Logo"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
    {!collapsed && (
      <div className={styles.logoTextContainer}>
        <div className={styles.logoTextThai}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</div>
        <div className={styles.logoTextEn}>RSU MEDICAL CLINIC</div>
      </div>
    )}
  </div>
)

export default function Sidebar({ 
  showSidebar, 
  setShowSidebar, 
  isCollapsed, 
  setIsCollapsed, 
  isMobile, 
  userData, 
  pathname 
}: SidebarProps) {
  
  const menuItems: MenuItem[] = [
    { path: '/user/dashboard', label: 'หน้าหลัก', icon: <Package size={20} /> },
    { path: '/user/borrow', label: 'ยืมอุปกรณ์', icon: <Plus size={20} /> },
    { path: '/user/smart-booking', label: 'จองล่วงหน้า', icon: <Calendar size={20} /> },
    { path: '/user/history', label: 'ประวัติการใช้งาน', icon: <History size={20} />, badge: userData.isLoggedIn ? '2' : undefined },
    { path: '/user/search', label: 'ค้นหาอุปกรณ์', icon: <Search size={20} /> }
  ]

  const isActive = (path: string) => pathname === path

  return (
    <aside className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ''} ${isCollapsed && !isMobile ? styles.collapsed : ''}`}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        {!isMobile && (
          <button onClick={() => setIsCollapsed(!isCollapsed)} className={styles.collapseBtn}>
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
        {isMobile && (
          <button onClick={() => setShowSidebar(false)} className={styles.sidebarClose}>
            <X size={16} />
          </button>
        )}
        <RSULogo size={isCollapsed && !isMobile ? 56 : 64} collapsed={isCollapsed && !isMobile} />
      </div>

      {/* Sidebar Navigation */}
      <nav className={styles.sidebarNav}>
        {menuItems.map(({ path, label, icon, badge }) => (
          <Link key={path} href={path} className={`${styles.navLink} ${isActive(path) ? styles.active : ''}`}>
            <span className={styles.navIcon}>{icon}</span>
            {(!isCollapsed || isMobile) && (
              <>
                <span>{label}</span>
                {badge && <span className={styles.badge}>{badge}</span>}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Sidebar User */}
      <div className={styles.sidebarUser}>
        <div className={styles.userAvatar}>
          <span>{userData.name.charAt(0)}</span>
        </div>
        {(!isCollapsed || isMobile) && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userData.name}</p>
            <p className={styles.userRole}>ID: {userData.id}</p>
          </div>
        )}
      </div>
    </aside>
  )
}