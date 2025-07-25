// app/user/history/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, Search, Filter, Package, MapPin, 
  Star, CheckCircle, AlertTriangle, XCircle, Download,
  Eye, ThumbsUp, ThumbsDown, MessageSquare, BarChart3,
  TrendingUp, Award, History as HistoryIcon
} from 'lucide-react'
import styles from './history.module.css'

// Mock Data
const mockHistory = [
  {
    id: 'BH001',
    equipmentId: 'EQ001',
    equipmentName: 'เครื่องวัดความดันโลหิต OMRON',
    equipmentModel: 'HEM-7120',
    location: 'ห้องตรวจ A',
    borrowDate: '2025-01-15',
    returnDate: '2025-01-17',
    dueDate: '2025-01-17',
    status: 'returned',
    purpose: 'ฝึกปฏิบัติการพยาบาล',
    condition: 'ดี',
    rating: 5,
    feedback: 'ใช้งานง่าย ผลลัพธ์แม่นยำ เหมาะสำหรับการเรียนรู้',
    borrowDuration: 2, // วัน
    lateReturn: false
  },
  {
    id: 'BH002',
    equipmentId: 'EQ003',
    equipmentName: 'ชุดตรวจหูคอจมูก',
    equipmentModel: 'Welch Allyn 3.5V',
    location: 'ห้องตรวจ C',
    borrowDate: '2025-01-10',
    returnDate: '2025-01-12',
    dueDate: '2025-01-12',
    status: 'returned',
    purpose: 'การสอบปฏิบัติ ENT',
    condition: 'ดี',
    rating: 4,
    feedback: 'อุปกรณ์ครบครัน แต่ไฟฉายค่อนข้างมืด',
    borrowDuration: 2,
    lateReturn: false
  },
  {
    id: 'BH003',
    equipmentId: 'EQ001',
    equipmentName: 'เครื่องวัดความดันโลหิต OMRON',
    equipmentModel: 'HEM-7120',
    location: 'ห้องตรวจ A',
    borrowDate: '2025-01-18',
    dueDate: '2025-01-20',
    status: 'active',
    purpose: 'ฝึกปฏิบัติการตรวจสุขภาพ',
    borrowDuration: null,
    lateReturn: false
  },
  {
    id: 'BH004',
    equipmentId: 'EQ004',
    equipmentName: 'เครื่องวัดน้ำตาลในเลือด',
    equipmentModel: 'Accu-Chek Active',
    location: 'ห้องตรวจ A',
    borrowDate: '2025-01-05',
    returnDate: '2025-01-08',
    dueDate: '2025-01-07',
    status: 'returned',
    purpose: 'การวิจัยระดับน้ำตาล',
    condition: 'ดี',
    rating: 4,
    feedback: 'ทำงานได้ดี แต่ต้องใช้แถบทดสอบเยอะ',
    borrowDuration: 3,
    lateReturn: true,
    lateDays: 1
  },
  {
    id: 'BH005',
    equipmentId: 'EQ002',
    equipmentName: 'เครื่อง Ultrasound พกพา',
    equipmentModel: 'SonoSite MicroMaxx',
    location: 'ห้องตรวจ B',
    borrowDate: '2024-12-20',
    returnDate: '2024-12-22',
    dueDate: '2024-12-22',
    status: 'returned',
    purpose: 'ฝึกการใช้เครื่อง Ultrasound',
    condition: 'ดี',
    rating: 5,
    feedback: 'เครื่องมือที่ยอดเยี่ยม ภาพชัดเจน',
    borrowDuration: 2,
    lateReturn: false
  }
]

const mockStats = {
  totalBorrows: 12,
  completedBorrows: 10,
  activeBorrows: 1,
  pendingBorrows: 1,
  averageRating: 4.4,
  onTimeReturns: 9,
  lateReturns: 1,
  favoriteCategory: 'การตรวจวัด',
  totalDays: 28,
  monthlyBorrows: [2, 3, 4, 1, 2] // ล่าสุด 5 เดือน
}

interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

function RatingStars({ rating, interactive = false, onRate }: RatingStarsProps) {
  return (
    <div className={styles.ratingStars}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`${styles.star} ${star <= rating ? styles.starFilled : ''} ${
            interactive ? styles.starInteractive : ''
          }`}
          onClick={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
        >
          <Star size={16} />
        </button>
      ))}
    </div>
  )
}

interface HistoryCardProps {
  record: any
  onViewDetails: (record: any) => void
  onRate?: (record: any, rating: number) => void
}

function HistoryCard({ record, onViewDetails, onRate }: HistoryCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'returned': return <CheckCircle className={styles.statusIconReturned} />
      case 'active': return <Clock className={styles.statusIconActive} />
      case 'overdue': return <AlertTriangle className={styles.statusIconOverdue} />
      case 'cancelled': return <XCircle className={styles.statusIconCancelled} />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'returned': return 'คืนแล้ว'
      case 'active': return 'กำลังยืม'
      case 'overdue': return 'เกินกำหนด'
      case 'cancelled': return 'ยกเลิก'
      default: return 'ไม่ทราบ'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'returned': return styles.statusReturned
      case 'active': return styles.statusActive
      case 'overdue': return styles.statusOverdue
      case 'cancelled': return styles.statusCancelled
      default: return ''
    }
  }

  const getDaysLeft = () => {
    if (record.status !== 'active') return null
    const dueDate = new Date(record.dueDate)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysLeft()

  return (
    <div className={styles.historyCard}>
      <div className={styles.cardHeader}>
        <div className={styles.equipmentInfo}>
          <h3 className={styles.equipmentName}>{record.equipmentName}</h3>
          <p className={styles.equipmentModel}>{record.equipmentModel}</p>
          <div className={styles.equipmentMeta}>
            <span className={styles.metaItem}>
              <MapPin size={14} />
              {record.location}
            </span>
          </div>
        </div>
        
        <div className={styles.statusContainer}>
          <span className={`${styles.statusBadge} ${getStatusClass(record.status)}`}>
            {getStatusIcon(record.status)}
            {getStatusText(record.status)}
          </span>
          {record.lateReturn && (
            <span className={styles.lateTag}>
              คืนล่าช้า {record.lateDays} วัน
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.dateInfo}>
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>วันที่ยืม:</span>
            <span className={styles.dateValue}>
              {new Date(record.borrowDate).toLocaleDateString('th-TH')}
            </span>
          </div>
          
          {record.returnDate && (
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>วันที่คืน:</span>
              <span className={styles.dateValue}>
                {new Date(record.returnDate).toLocaleDateString('th-TH')}
              </span>
            </div>
          )}
          
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>กำหนดคืน:</span>
            <span className={styles.dateValue}>
              {new Date(record.dueDate).toLocaleDateString('th-TH')}
            </span>
          </div>

          {record.status === 'active' && daysLeft !== null && (
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>เหลืออีก:</span>
              <span className={`${styles.dateValue} ${daysLeft <= 1 ? styles.urgent : ''}`}>
                {daysLeft > 0 ? `${daysLeft} วัน` : 'หมดเวลาแล้ว'}
              </span>
            </div>
          )}
        </div>

        <div className={styles.purposeInfo}>
          <span className={styles.purposeLabel}>วัตถุประสงค์:</span>
          <span className={styles.purposeText}>{record.purpose}</span>
        </div>

        {record.status === 'returned' && (
          <div className={styles.reviewInfo}>
            {record.rating ? (
              <div className={styles.existingReview}>
                <div className={styles.ratingSection}>
                  <span className={styles.ratingLabel}>คะแนนที่ให้:</span>
                  <RatingStars rating={record.rating} />
                </div>
                {record.feedback && (
                  <div className={styles.feedbackSection}>
                    <span className={styles.feedbackLabel}>ความคิดเห็น:</span>
                    <p className={styles.feedbackText}>"{record.feedback}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.rateSection}>
                <span className={styles.rateLabel}>ให้คะแนนการใช้งาน:</span>
                <RatingStars 
                  rating={0} 
                  interactive 
                  onRate={(rating) => onRate && onRate(record, rating)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button 
          onClick={() => onViewDetails(record)}
          className={styles.detailButton}
        >
          <Eye size={16} />
          ดูรายละเอียด
        </button>
        
        {record.status === 'returned' && record.borrowDuration && (
          <span className={styles.durationInfo}>
            ยืม {record.borrowDuration} วัน
          </span>
        )}
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [activeTab, setActiveTab] = useState('history') // 'history' or 'stats'

  const filteredHistory = mockHistory.filter(record => {
    const matchesSearch = record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
      case 'date-asc':
        return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime()
      case 'name':
        return a.equipmentName.localeCompare(b.equipmentName)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setShowDetails(true)
  }

  const handleRate = (record: any, rating: number) => {
    // Simulate rating submission
    console.log(`Rating ${rating} for record ${record.id}`)
    alert(`ขอบคุณสำหรับการให้คะแนน ${rating} ดาว!`)
  }

  const generateMonthlyChart = () => {
    const maxValue = Math.max(...mockStats.monthlyBorrows)
    return mockStats.monthlyBorrows.map((value, index) => (
      <div key={index} className={styles.chartBar}>
        <div 
          className={styles.chartBarFill}
          style={{ height: `${(value / maxValue) * 100}%` }}
        />
        <span className={styles.chartBarValue}>{value}</span>
      </div>
    ))
  }

  return (
    <div className={styles.historyPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>ประวัติการใช้งาน</h1>
        <p className={styles.pageDescription}>
          ดูประวัติการยืม-คืนอุปกรณ์และสถิติการใช้งาน
        </p>
      </div>

      {/* Stats Summary */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Package className={styles.statIconBlue} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.totalBorrows}</span>
            <span className={styles.statLabel}>ยืมทั้งหมด</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle className={styles.statIconGreen} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.onTimeReturns}</span>
            <span className={styles.statLabel}>คืนตรงเวลา</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Star className={styles.statIconYellow} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.averageRating}</span>
            <span className={styles.statLabel}>คะแนนเฉลี่ย</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock className={styles.statIconPurple} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.totalDays}</span>
            <span className={styles.statLabel}>วันทั้งหมด</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <HistoryIcon size={20} />
          ประวัติการยืม
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={20} />
          สถิติการใช้งาน
        </button>
      </div>

      {activeTab === 'history' ? (
        <>
          {/* Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="ค้นหาอุปกรณ์หรือวัตถุประสงค์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.filterControls}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="returned">คืนแล้ว</option>
                <option value="active">กำลังยืม</option>
                <option value="overdue">เกินกำหนด</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="date-desc">วันที่ล่าสุด</option>
                <option value="date-asc">วันที่เก่าสุด</option>
                <option value="name">ชื่ออุปกรณ์</option>
                <option value="rating">คะแนนสูงสุด</option>
              </select>

              <button className={styles.exportButton}>
                <Download size={16} />
                ส่งออก PDF
              </button>
            </div>
          </div>

          {/* History List */}
          <div className={styles.historyContainer}>
            {sortedHistory.length > 0 ? (
              <div className={styles.historyList}>
                {sortedHistory.map(record => (
                  <HistoryCard
                    key={record.id}
                    record={record}
                    onViewDetails={handleViewDetails}
                    onRate={handleRate}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <HistoryIcon size={64} />
                <h3>ไม่พบประวัติการใช้งาน</h3>
                <p>ลองเปลี่ยนเงื่อนไขการค้นหา</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Statistics Tab */
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {/* Monthly Usage Chart */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>การใช้งานรายเดือน</h3>
              <div className={styles.monthlyChart}>
                {generateMonthlyChart()}
              </div>
              <div className={styles.chartLabels}>
                {['5 เดือนก่อน', '4 เดือนก่อน', '3 เดือนก่อน', '2 เดือนก่อน', 'เดือนที่แล้ว'].map(label => (
                  <span key={label} className={styles.chartLabel}>{label}</span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className={styles.achievementsCard}>
              <h3 className={styles.achievementsTitle}>ความสำเร็จ</h3>
              <div className={styles.achievementsList}>
                <div className={styles.achievement}>
                  <Award className={styles.achievementIcon} />
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>ผู้ใช้งานดีเด่น</span>
                    <span className={styles.achievementDesc}>คืนตรงเวลา 90%</span>
                  </div>
                </div>
                
                <div className={styles.achievement}>
                  <Star className={styles.achievementIcon} />
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>นักรีวิว</span>
                    <span className={styles.achievementDesc}>ให้คะแนน 5+ ครั้ง</span>
                  </div>
                </div>
                
                <div className={styles.achievement}>
                  <TrendingUp className={styles.achievementIcon} />
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>ผู้ใช้งานประจำ</span>
                    <span className={styles.achievementDesc}>ยืม 10+ ครั้ง</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Pattern */}
            <div className={styles.patternCard}>
              <h3 className={styles.patternTitle}>รูปแบบการใช้งาน</h3>
              <div className={styles.patternStats}>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>หมวดหมู่ที่ชื่นชอบ:</span>
                  <span className={styles.patternValue}>{mockStats.favoriteCategory}</span>
                </div>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>ระยะเวลายืมเฉลี่ย:</span>
                  <span className={styles.patternValue}>2.5 วัน</span>
                </div>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>อัตราการคืนตรงเวลา:</span>
                  <span className={styles.patternValue}>90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetails && selectedRecord && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>รายละเอียดการยืม</h3>
              <button
                onClick={() => setShowDetails(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h4>ข้อมูลอุปกรณ์</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span>ชื่ออุปกรณ์:</span>
                    <span>{selectedRecord.equipmentName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>รุ่น:</span>
                    <span>{selectedRecord.equipmentModel}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>สถานที่:</span>
                    <span>{selectedRecord.location}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4>ข้อมูลการยืม</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span>วันที่ยืม:</span>
                    <span>{new Date(selectedRecord.borrowDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  {selectedRecord.returnDate && (
                    <div className={styles.detailRow}>
                      <span>วันที่คืน:</span>
                      <span>{new Date(selectedRecord.returnDate).toLocaleDateString('th-TH')}</span>
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span>กำหนดคืน:</span>
                    <span>{new Date(selectedRecord.dueDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>วัตถุประสงค์:</span>
                    <span>{selectedRecord.purpose}</span>
                  </div>
                </div>
              </div>

              {selectedRecord.feedback && (
                <div className={styles.detailSection}>
                  <h4>การประเมิน</h4>
                  <div className={styles.reviewDetail}>
                    <div className={styles.ratingDetail}>
                      <span>คะแนน:</span>
                      <RatingStars rating={selectedRecord.rating} />
                    </div>
                    <div className={styles.feedbackDetail}>
                      <span>ความคิดเห็น:</span>
                      <p>"{selectedRecord.feedback}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowDetails(false)}
                className={styles.closeModalButton}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}