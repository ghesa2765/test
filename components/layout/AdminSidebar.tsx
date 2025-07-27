// components/layout/AdminSidebar.tsx
'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Package2, Users, ClipboardCheck, 
  BarChart3, Settings, ChevronLeft, ChevronRight, 
  X, LogOut, UserCheck, AlertTriangle
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useSidebar } from '@/contexts/SidebarContext'
import styles from '@/styles/components/admin-sidebar.module.css'

interface MenuItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: 'warning' | 'danger' | 'success' | 'info'
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showSidebar, isCollapsed, isMobile, setShowSidebar, setIsCollapsed } = useSidebar()

  // Admin data (จะมาจาก Context ในอนาคต)
  const adminData = {
    id: 'ADM001',
    name: 'ดร.สมศักดิ์ ใจดี',
    role: 'admin' as const,
    department: 'แผนกเวชกรรม',
    isLoggedIn: true,
    permissions: ['equipment_manage', 'user_manage', 'reports_view']
  }

  const menuItems: MenuItem[] = [
    { 
      path: '/admin', 
      label: 'แดชบอร์ด', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/admin/equipment', 
      label: 'จัดการอุปกรณ์', 
      icon: <Package2 size={20} /> 
    },
    { 
      path: '/admin/approvals', 
      label: 'อนุมัติคำขอ', 
      icon: <ClipboardCheck size={20} />,
      badge: '7',
      badgeColor: 'warning'
    },
    { 
      path: '/admin/users', 
      label: 'จัดการผู้ใช้', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/admin/reports', 
      label: 'รายงาน', 
      icon: <BarChart3 size={20} /> 
    },
    { 
      path: '/admin/maintenance', 
      label: 'การบำรุงรักษา', 
      icon: <AlertTriangle size={20} />,
      badge: '3',
      badgeColor: 'danger'
    },
    { 
      path: '/admin/settings', 
      label: 'ตั้งค่าระบบ', 
      icon: <Settings size={20} /> 
    }
  ]

  const isActive = useCallback((path: string) => pathname === path, [pathname])

  const handleLogout = useCallback(() => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin/login')
  }, [router])

  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'warning': return styles.badgeWarning
      case 'danger': return styles.badgeDanger
      case 'success': return styles.badgeSuccess
      case 'info': return styles.badgeInfo
      default: return styles.badge
    }
  }

  return (
    <>
      <aside 
        data-sidebar
        className={`${styles.adminSidebar} ${showSidebar ? styles.sidebarOpen : ''} ${isCollapsed && !isMobile ? styles.collapsed : ''}`}
      >
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
          {(!isCollapsed || isMobile) && (
            <div className={styles.adminBadge}>
              <UserCheck size={16} />
              <span>ระบบแอดมิน</span>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className={styles.sidebarNav}>
          {menuItems.map(({ path, label, icon, badge, badgeColor }) => (
            <Link 
              key={path} 
              href={path} 
              className={`${styles.navLink} ${isActive(path) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{icon}</span>
              {(!isCollapsed || isMobile) && (
                <>
                  <span>{label}</span>
                  {badge && (
                    <span className={getBadgeClass(badgeColor)}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Admin Info */}
        <div className={styles.sidebarAdmin}>
          <div className={styles.adminAvatar}>
            <span>{adminData.name.charAt(2)}</span> {/* ดร.สมศักดิ์ -> ส */}
          </div>
          {(!isCollapsed || isMobile) && (
            <div className={styles.adminInfo}>
              <p className={styles.adminName}>{adminData.name}</p>
              <p className={styles.adminRole}>{adminData.department}</p>
              <p className={styles.adminId}>ID: {adminData.id}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Button */}
      {adminData.isLoggedIn && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} /> ออกจากระบบ
        </button>
      )}
    </>
  )
}