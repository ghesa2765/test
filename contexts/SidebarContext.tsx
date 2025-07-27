// contexts/SidebarContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  showSidebar: boolean
  isCollapsed: boolean
  isMobile: boolean
  setShowSidebar: (show: boolean) => void
  setIsCollapsed: (collapsed: boolean) => void
  setIsMobile: (mobile: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle outside click for mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSidebar && isMobile) {
        const sidebar = document.querySelector('[data-sidebar]')
        const menuToggle = document.querySelector('[data-menu-toggle]')
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

  const value = {
    showSidebar,
    isCollapsed,
    isMobile,
    setShowSidebar,
    setIsCollapsed,
    setIsMobile
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}