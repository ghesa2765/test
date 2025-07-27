// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminHeader from '@/components/layout/Header'
import AdminFooter from '@/components/layout/Footer'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import styles from '@/styles/layout/admin-layout.module.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { showSidebar, isCollapsed, isMobile, setShowSidebar } = useSidebar()
  const [isLoading, setIsLoading] = useState(true)

  // หน้าที่ไม่ต้องการ layout (เฉพาะหน้าเปล่าๆ)
  const noLayoutPages = [
    '/admin/login',
    '/admin/forgot-password'
  ]
  
  const shouldShowLayout = !noLayoutPages.includes(pathname)

  useEffect(() => {
    setIsLoading(false)
  }, [])

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
      <AdminSidebar />

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

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  )
}