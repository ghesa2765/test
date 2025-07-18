// app/user/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import UserSidebar from '@/components/layout/UsersSidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import styles from '@/styles/layout/user-layout.module.css'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Overlay */}
      {showSidebar && isMobile && (
        <div 
          className={styles.overlay} 
          onClick={() => setShowSidebar(false)} 
        />
      )}

      {/* Sidebar */}
      <UserSidebar
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
        
        {/* Header */}
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {/* Page Content */}
        <div className={styles.contentWrapper}>
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}