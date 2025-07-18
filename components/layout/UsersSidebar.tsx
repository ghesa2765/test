// components/layout/UserSidebar.tsx
'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, ClipboardList, Search, Plus, 
  ChevronLeft, ChevronRight, X, Package, 
  History, LogOut 
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import styles from '@/styles/components/sidebar.module.css'

interface MenuItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: string
}

interface UserSidebarProps {
  showSidebar: boolean
  isCollapsed: boolean
  isMobile: boolean
  setShowSidebar: (show: boolean) => void
  setIsCollapsed: (collapsed: boolean) => void
}

export default function UserSidebar({
  showSidebar,
  isCollapsed,
  isMobile,
  setShowSidebar,
  setIsCollapsed
}: UserSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  // User data (จะมาจาก Context ในอนาคต)
  const userData = {
    id: '6606276',
    name: 'นิคม ใจดี',
    role: 'student' as const,
    faculty: 'วิทยาลัยแพทยศาสตร์',
    isLoggedIn: true
  }

  const menuItems: MenuItem[] = [
    { path: '/user/dashboard', label: 'หน้าหลัก', icon: <Package size={20} /> },
    { path: '/user/borrow', label: 'ยืมอุปกรณ์', icon: <Plus size={20} /> },
    { path: '/user/smart-booking', label: 'จองล่วงหน้า', icon: <Calendar size={20} /> },
    { 
      path: '/user/history', 
      label: 'ประวัติการใช้งาน', 
      icon: <History size={20} />, 
      badge: userData.isLoggedIn ? '2' : undefined 
    },
    { path: '/user/search', label: 'ค้นหาอุปกรณ์', icon: <Search size={20} /> }
  ]

  const isActive = useCallback((path: string) => pathname === path, [pathname])

  const handleLogout = useCallback(() => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }, [router])

  return (
    <>
      <aside className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ''} ${isCollapsed && !isMobile ? styles.collapsed : ''}`}>
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          {!isMobile && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={styles.collapseBtn}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
          {isMobile && (
            <button 
              onClick={() => setShowSidebar(false)} 
              className={styles.sidebarClose}
            >
              <X size={16} />
            </button>
          )}
          <Logo 
            size={isCollapsed && !isMobile ? 56 : 64} 
            collapsed={isCollapsed && !isMobile} 
          />
        </div>

        {/* Sidebar Navigation */}
        <nav className={styles.sidebarNav}>
          {menuItems.map(({ path, label, icon, badge }) => (
            <Link 
              key={path} 
              href={path} 
              className={`${styles.navLink} ${isActive(path) ? styles.active : ''}`}
            >
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

      {/* Logout Button */}
      {userData.isLoggedIn && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} /> ออกจากระบบ
        </button>
      )}
    </>
  )
}