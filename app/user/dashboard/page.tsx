// app/user/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SearchBox from '@/components/dashboard/SearchBox'
import QuickActionCard from '@/components/dashboard/QuickActionCard'
import ActivityItem from '@/components/dashboard/ActivityItem'
import styles from '@/styles/components/dashboard.module.css'

// SVG Icons  
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

const ClipboardList = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="m16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="m12 11h4"/>
    <path d="m12 16h4"/>
    <path d="m8 11h.01"/>
    <path d="m8 16h.01"/>
  </svg>
)

const CheckCircle = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const AlertCircle = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const Send = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
)

const FileText = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
)

const LogOut = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function UserDashboardPage() {
  const router = useRouter()

  // =============== STATE ===============
  const [isLoading, setIsLoading] = useState(true)

  // =============== DATA ===============
  const userData = {
    id: '6606276',
    name: 'นิคม ใจดี',
    role: 'student' as const,
    faculty: 'วิทยาลัยแพทยศาสตร์',
    isLoggedIn: true
  }

  // =============== EFFECTS ===============
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // =============== HANDLERS ===============
  const handleLogout = useCallback(() => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/user')
  }, [router])

  // =============== LOADING STATE ===============
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลด...</p>
      </div>
    )
  }

  // =============== RENDER ===============
  return (
    <div className={styles.dashboardContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        
        {/* Content Wrapper */}
        <div className={styles.contentWrapper}>
          
          {/* =============== SEARCH SECTION =============== */}
          <section className={styles.searchSection}>
            <SearchBox placeholder="ค้นหาอุปกรณ์..." />
          </section>

          {/* =============== QUICK ACTIONS =============== */}
          <section className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>ใช้งานด่วน</h2>
            <div className={styles.actionGrid}>
              <QuickActionCard 
                href="/user/borrow" 
                icon={<Plus size={24} />} 
                title="ยืมอุปกรณ์ทันที" 
                description="Walk-in ยืมอุปกรณ์โดยไม่ต้องจอง" 
              />
              <QuickActionCard 
                href="/user/smart-booking" 
                icon={<Calendar size={24} />} 
                title="จองล่วงหน้า" 
                description="จองอุปกรณ์พร้อมเลือกเวลาได้" 
              />
              <QuickActionCard 
                href="/user/history" 
                icon={<ClipboardList size={24} />} 
                title="ประวัติการใช้งาน" 
                description="ดูรายการยืม-คืนและสถานะ" 
              />
            </div>
          </section>

          {/* =============== RECENT ACTIVITIES =============== */}
          <section className={styles.recentActivities}>
            <h2 className={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
            <div className={styles.activityList}>
              <ActivityItem 
                icon={<CheckCircle size={20} />} 
                text="คืนเครื่องวัดความดันโลหิตเรียบร้อยแล้ว" 
                time="2 ชั่วโมงที่แล้ว" 
                type="success"
              />
              <ActivityItem 
                icon={<Calendar size={20} />} 
                text="จองเครื่อง Ultrasound สำหรับวันพรุ่งนี้ 14:00 น." 
                time="1 วันที่แล้ว" 
                type="info"
              />
              <ActivityItem 
                icon={<AlertCircle size={20} />} 
                text="เตือน: ต้องคืนเครื่องตรวจหูคอจมูกภายในวันนี้" 
                time="3 วันที่แล้ว" 
                type="warning"
              />
              <ActivityItem 
                icon={<Send size={20} />} 
                text="ยืมชุดตรวจการได้ยินสำเร็จ" 
                time="5 วันที่แล้ว" 
                type="success"
              />
              <ActivityItem 
                icon={<FileText size={20} />} 
                text="ประวัติการยืมเดือนที่แล้ว: 3 รายการ" 
                time="1 สัปดาห์ที่แล้ว" 
                type="info"
              />
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

// =============== SUB COMPONENTS ===============
// Components are now imported from @/components/dashboard/