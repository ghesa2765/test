// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminHeader from '@/components/layout/Header'
import AdminFooter from '@/components/layout/Footer'
import styles from '@/styles/layout/admin-layout.module.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // หน้าที่ไม่ต้องการ layout (เฉพาะหน้าเปล่าๆ)
  const noLayoutPages = [
    '/admin/login',
    '/admin/forgot-password'
  ]
  
  const shouldShowLayout = !noLayoutPages.includes(pathname)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 1023
      setIsMobile(isMobileView)
      if (!isMobileView) {
        setShowSidebar(true)
      }
    }
    
    checkMobile()
    setIsLoading(false)
    
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle outside click for mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSidebar && isMobile) {
        const sidebar = document.querySelector(`.${styles.sidebar}`)
        const menuToggle = document.querySelector(`.${styles.menuToggle}`)
        if (sidebar && !sidebar.contains(e.target as Node) && 
            menuToggle && !menuToggle.contains(e.target as Node)) {
          setShowSidebar(false)
        }
      }
    }
    
    if (showSidebar && isMobile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSidebar, isMobile])

  // หากเป็นหน้า login - แสดงเฉพาะ children ไม่มี layout
  if (!shouldShowLayout) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลดระบบแอดมิน...</p>
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Overlay */}
      {showSidebar && isMobile && (
        <div 
          className={styles.overlay} 
          onClick={() => setShowSidebar(false)} 
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        showSidebar={showSidebar}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        setShowSidebar={setShowSidebar}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <main className={`${styles.mainContent} ${
        (!isMobile && showSidebar) 
          ? (isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded) 
          : ''
      }`}>
        
        {/* Admin Header */}
        <AdminHeader
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {/* Page Content */}
        <div className={styles.contentWrapper}>
          {children}
        </div>

        {/* Admin Footer */}
        <AdminFooter />
      </main>
    </div>
  )
}