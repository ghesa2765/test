// components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu, Bell } from 'lucide-react'
import styles from '@/styles/components/header.module.css'

interface HeaderProps {
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
}

export default function Header({ showSidebar, setShowSidebar }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // User data (จะมาจาก Context ในอนาคต)
  const userData = {
    name: 'นิคม ใจดี',
    faculty: 'วิทยาลัยแพทยศาสตร์',
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (d: Date) =>
    d.toLocaleDateString('th-TH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) + ' น.'

  return (
    <header className={styles.header}>
      <button 
        className={styles.menuToggle} 
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu size={20} />
      </button>
      
      <div className={styles.headerInfo}>
        <h1 className={styles.pageTitle}>ระบบยืม-จองอุปกรณ์</h1>
        <p className={styles.subtitle}>
          ยินดีต้อนรับ {userData.name} - {userData.faculty}
        </p>
      </div>
      
      <div className={styles.headerActions}>
        <button className={styles.notificationBtn}>
          <Bell size={20} />
          <span className={styles.notificationBadge}>2</span>
        </button>
        <div className={styles.currentDateTime}>
          <p className={styles.currentDate}>{formatDate(currentTime)}</p>
          <p className={styles.currentTime}>{formatTime(currentTime)}</p>
        </div>
      </div>
    </header>
  )
}