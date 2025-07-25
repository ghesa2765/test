// app/user/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SearchBox from '@/components/dashboard/SearchBox'
import QuickActionCard from '@/components/dashboard/QuickActionCard'
import ActivityItem from '@/components/dashboard/ActivityItem'
import EquipmentCard from '@/components/dashboard/EquipmentCard'
import styles from '@/styles/components/dashboard.module.css'

// Type definitions
interface Equipment {
  id: string
  name: string
  code: string
  category: string
  status: 'available' | 'borrowed' | 'maintenance'
  location: string
  rating: number
  description: string
  dueDate?: string
  borrower?: string
  maintenanceUntil?: string
}

interface IconProps {
  size?: number
  style?: React.CSSProperties
}

// Mock equipment data - อุปกรณ์จริงที่มีในระบบ
const equipmentData: Equipment[] = [
  {
    id: 'EQ001',
    name: 'ไม้ค้ำยัน (คู่)',
    code: 'CR001',
    category: 'อุปกรณ์ช่วยเหลือ',
    status: 'available',
    location: 'ห้องเก็บอุปกรณ์ A',
    rating: 4.8,
    description: 'ไม้ค้ายันสำหรับผู้ป่วยที่มีปัญหาการเดิน ปรับระดับความสูงได้'
  },
  {
    id: 'EQ002',
    name: 'Walker 4 ขา',
    code: 'WK004',
    category: 'อุปกรณ์ช่วยเหลือ',
    status: 'borrowed',
    location: 'ห้องกายภาพบำบัด',
    rating: 4.9,
    description: 'เครื่องช่วยเดิน 4 ขา สำหรับผู้ป่วยที่ต้องการความคงตัว',
    dueDate: '2025-01-25',
    borrower: 'นิคม ใจดี'
  },
  {
    id: 'EQ003',
    name: 'Walker 1 ขา',
    code: 'WK001',
    category: 'อุปกรณ์ช่วยเหลือ',
    status: 'available',
    location: 'ห้องกายภาพบำบัด',
    rating: 4.7,
    description: 'เครื่องช่วยเดิน 1 ขา น้ำหนักเบา เหมาะสำหรับผู้สูงอายุ'
  },
  {
    id: 'EQ004',
    name: 'หุ่น CPR (ตัว)',
    code: 'CPR001',
    category: 'อุปกรณ์ฝึกอบรม',
    status: 'available',
    location: 'ห้องฝึกปฏิบัติ',
    rating: 4.8,
    description: 'หุ่นฝึกปฏิบัติการช่วยชีวิตขั้นพื้นฐาน (CPR) พร้อมเซนเซอร์'
  },
  {
    id: 'EQ005',
    name: 'วิลแชร์',
    code: 'WC001',
    category: 'อุปกรณ์ช่วยเหลือ',
    status: 'borrowed',
    location: 'ห้องผู้ป่วยนอก',
    rating: 4.6,
    description: 'รถเข็นผู้ป่วย สำหรับผู้ป่วยที่ไม่สามารถเดินได้',
    dueDate: '2025-01-23',
    borrower: 'สมชาย ดีใจ'
  },
  {
    id: 'EQ006',
    name: 'เครื่องวัดความดัน',
    code: 'BP001',
    category: 'อุปกรณ์ตรวจวัด',
    status: 'available',
    location: 'ห้องตรวจทั่วไป',
    rating: 4.9,
    description: 'เครื่องวัดความดันโลหิตแบบดิจิทัล แม่นยำสูง'
  },
  {
    id: 'EQ007',
    name: 'กระเป๋าวัคซีน',
    code: 'EB001',
    category: 'อุปกรณ์การแพทย์',
    status: 'maintenance',
    location: 'ห้องซ่อมบำรุง',
    rating: 4.7,
    description: 'กระเป๋าเก็บวัคซีนแบบควบคุมอุณหภูมิ',
    maintenanceUntil: '2025-01-20'
  },
  {
    id: 'EQ008',
    name: 'กระเป๋าน้ำร้อน',
    code: 'HB001',
    category: 'อุปกรณ์บำบัด',
    status: 'available',
    location: 'ห้องฟิสิโอเธอราปี',
    rating: 4.5,
    description: 'กระเป๋าน้ำร้อนสำหรับบำบัดอาการปวดกล้ามเนื้อ'
  },
  {
    id: 'EQ009',
    name: 'วัดอุณหภูมิศีรษะดิจิทัล',
    code: 'PC001',
    category: 'อุปกรณ์ตรวจวัด',
    status: 'available',
    location: 'ห้องตรวจทั่วไป',
    rating: 4.8,
    description: 'เครื่องวัดอุณหภูมิแบบดิจิทัล วัดจากศีรษะแบบไม่สัมผัส'
  },
  {
    id: 'EQ010',
    name: 'ปรอทวัดไข้',
    code: 'TH001',
    category: 'อุปกรณ์ตรวจวัด',
    status: 'borrowed',
    location: 'ห้องพยาบาล',
    rating: 4.4,
    description: 'เทอร์โมมิเตอร์แบบดิจิทัล สำหรับวัดอุณหภูมิร่างกาย',
    dueDate: '2025-01-22',
    borrower: 'พยาบาลสุดา'
  },
  {
    id: 'EQ011',
    name: 'เสาน้ำเกลือ',
    code: 'IV001',
    category: 'อุปกรณ์การแพทย์',
    status: 'available',
    location: 'ห้องฉีดยา',
    rating: 4.7,
    description: 'เสาแขวนถุงน้ำเกลือ ปรับความสูงได้ มีล้อเลื่อน'
  }
]

// SVG Icons  
const Plus = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const Calendar = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ClipboardList = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="m16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="m12 11h4"/>
    <path d="m12 16h4"/>
    <path d="m8 11h.01"/>
    <path d="m8 16h.01"/>
  </svg>
)

const CheckCircle = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const AlertCircle = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const Send = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
)

const FileText = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
)

const Package = ({ size = 20, style }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={style}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

export default function UserDashboardPage() {
  const router = useRouter()

  // =============== STATE ===============
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Equipment[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

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

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
    } else {
      const filtered = equipmentData.filter(equipment =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filtered)
      setShowSearchResults(true)
    }
  }, [searchTerm])

  // =============== HANDLERS ===============
  const handleLogout = useCallback(() => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/user')
  }, [router])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setShowSearchResults(false)
  }

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
            <SearchBox 
              placeholder="ค้นหาอุปกรณ์..." 
              value={searchTerm}
              onSearch={handleSearch}
            />
          </section>

          {/* =============== SEARCH RESULTS =============== */}
          {showSearchResults && (
            <section className={styles.searchResultsSection}>
              <div className={styles.searchResultsHeader}>
                <h2 className={styles.sectionTitle}>
                  ผลการค้นหา ({searchResults.length} รายการ)
                </h2>
                <button 
                  onClick={clearSearch}
                  className={styles.clearButton}
                >
                  ล้างการค้นหา
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className={styles.equipmentGrid}>
                  {searchResults.map(equipment => (
                    <EquipmentCard key={equipment.id} equipment={equipment} />
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <Package size={48} style={{color: '#9ca3af', marginBottom: '16px'}} />
                  <p style={{color: '#6b7280'}}>ไม่พบอุปกรณ์ที่ตรงกับการค้นหา</p>
                </div>
              )}
            </section>
          )}

          {/* =============== QUICK ACTIONS - แสดงเมื่อไม่ค้นหา =============== */}
          {!showSearchResults && (
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
          )}

          {/* =============== RECENT ACTIVITIES - แสดงเมื่อไม่ค้นหา =============== */}
          {!showSearchResults && (
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
          )}

        </div>
      </main>
    </div>
  )
}

// =============== SUB COMPONENTS ===============
// Components are now imported from @/components/dashboard/