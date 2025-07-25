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

// Mock Data with original rating system
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
    borrowDuration: 2,
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

// Original mockStats with averageRating
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
  monthlyBorrows: [2, 3, 4, 1, 2]
}

// Beautiful gradient icons
const BeautifulIcons = {
  Package: ({ size = 24 }) => (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Package size={size * 0.6} color="white" />
    </div>
  ),
  CheckCircle: ({ size = 24 }) => (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <CheckCircle size={size * 0.6} color="white" />
    </div>
  ),
  Clock: ({ size = 24 }) => (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Clock size={size * 0.6} color="white" />
    </div>
  ),
  Star: ({ size = 24 }) => (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Star size={size * 0.6} color="#8b5cf6" />
    </div>
  ),
  Calendar: ({ size = 24 }) => (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Calendar size={size * 0.6} color="white" />
    </div>
  )
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
          className={`${styles.star} ${star <= rating ? styles.starFilled : styles.starEmpty} ${interactive ? styles.starInteractive : ''}`}
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
  onRate: (record: any, rating: number) => void
}

function HistoryCard({ record, onViewDetails, onRate }: HistoryCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'returned':
        return <span className={`${styles.statusBadge} ${styles.statusReturned}`}>
          <CheckCircle size={14} />
          คืนแล้ว
        </span>
      case 'active':
        return <span className={`${styles.statusBadge} ${styles.statusActive}`}>
          <Clock size={14} />
          กำลังยืม
        </span>
      case 'overdue':
        return <span className={`${styles.statusBadge} ${styles.statusOverdue}`}>
          <AlertTriangle size={14} />
          เกินกำหนด
        </span>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={styles.historyCard}>
      <div className={styles.cardHeader}>
        <div className={styles.equipmentInfo}>
          <h3 className={styles.equipmentName}>{record.equipmentName}</h3>
          <p className={styles.equipmentModel}>{record.equipmentModel}</p>
          <div className={styles.locationInfo}>
            <MapPin size={14} />
            <span>{record.location}</span>
          </div>
        </div>
        {getStatusBadge(record.status)}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.dateInfo}>
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>วันที่ยืม:</span>
            <span className={styles.dateValue}>{formatDate(record.borrowDate)}</span>
          </div>
          {record.returnDate && (
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>วันที่คืน:</span>
              <span className={styles.dateValue}>{formatDate(record.returnDate)}</span>
            </div>
          )}
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>กำหนดคืน:</span>
            <span className={styles.dateValue}>{formatDate(record.dueDate)}</span>
          </div>
        </div>

        {record.lateReturn && record.lateDays && (
          <div className={styles.lateWarning}>
            <AlertTriangle size={16} />
            <span>คืนช้า {record.lateDays} วัน</span>
          </div>
        )}

        {record.status === 'active' && (
          <div className={styles.activeBorrowInfo}>
            {(() => {
              const dueDate = new Date(record.dueDate)
              const today = new Date()
              const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              
              return (
                <div className={styles.dueDateInfo}>
                  <Clock size={16} />
                  <span className={`${styles.daysLeft} ${daysLeft <= 1 ? styles.urgent : ''}`}>
                    {daysLeft > 0 ? `เหลือ ${daysLeft} วัน` : 'หมดเวลาแล้ว'}
                  </span>
                </div>
              )
            })()}
          </div>
        )}

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
            ใช้เวลา {record.borrowDuration} วัน
          </span>
        )}
      </div>
    </div>
  )
}

// PDF Export Function - สร้าง PDF จริงๆ
const exportToPDF = async (filteredHistory: any[], searchTerm: string, statusFilter: string) => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      alert('กรุณาอนุญาตให้เปิด popup window เพื่อสร้าง PDF')
      return
    }

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>ประวัติการใช้งานอุปกรณ์</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          
          body { 
            font-family: 'Sarabun', 'Arial', sans-serif; 
            margin: 20px;
            line-height: 1.4;
            color: #333;
          }
          
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
          }
          
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1f2937; 
            margin-bottom: 8px;
          }
          
          .subtitle { 
            font-size: 16px; 
            color: #6b7280; 
            margin: 4px 0;
          }
          
          .filters { 
            margin-bottom: 20px; 
            padding: 15px; 
            background: #f8fafc; 
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .record { 
            margin-bottom: 20px; 
            padding: 15px; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px;
            page-break-inside: avoid;
          }
          
          .equipment-name { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1f2937; 
            margin-bottom: 5px;
          }
          
          .equipment-model { 
            font-size: 14px; 
            color: #6b7280; 
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .info-row { 
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .label { 
            font-weight: bold; 
            color: #374151;
            min-width: 100px;
          }
          
          .value { 
            color: #6b7280;
            text-align: right;
          }
          
          .status { 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: bold;
            display: inline-block;
          }
          
          .status-returned { 
            background: #dcfce7; 
            color: #166534; 
          }
          
          .status-active { 
            background: #fef3c7; 
            color: #92400e; 
          }
          
          .purpose { 
            margin: 15px 0;
            padding: 10px;
            background: #f9fafb;
            border-left: 4px solid #3b82f6;
            font-style: italic;
          }
          
          .rating { 
            margin: 10px 0;
            padding: 8px;
            background: #fffbeb;
            border-radius: 6px;
          }
          
          .feedback { 
            margin: 10px 0;
            padding: 8px;
            background: #f0f9ff;
            border-radius: 6px;
            font-style: italic; 
            color: #0369a1;
          }
          
          .late-warning {
            margin: 10px 0;
            padding: 8px;
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            color: #dc2626;
            font-weight: bold;
          }
          
          .footer {
            margin-top: 30px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            z-index: 1000;
          }
          
          .print-button:hover {
            background: #2563eb;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ พิมพ์/บันทึก PDF</button>
        
        <div class="header">
          <div class="title">ประวัติการใช้งานอุปกรณ์</div>
          <div class="subtitle">ระบบยืม-จองอุปกรณ์</div>
          <div class="subtitle">คลินิกแพทย์ รพ.มหาวิทยาลัยรังสิต</div>
          <div class="subtitle">วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
        </div>
        
        <div class="filters">
          <strong>📋 เงื่อนไขการค้นหา:</strong><br>
          <strong>คำค้นหา:</strong> "${searchTerm || 'ทั้งหมด'}" | 
          <strong>สถานะ:</strong> "${statusFilter === 'all' ? 'ทุกสถานะ' : 
            statusFilter === 'returned' ? 'คืนแล้ว' :
            statusFilter === 'active' ? 'กำลังยืม' : 
            statusFilter === 'overdue' ? 'เกินกำหนด' : statusFilter}"<br>
          <strong>จำนวนรายการ:</strong> ${filteredHistory.length} รายการ
        </div>

        ${filteredHistory.map((record, index) => `
          <div class="record">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <div class="equipment-name">${index + 1}. ${record.equipmentName}</div>
                <div class="equipment-model">รุ่น: ${record.equipmentModel}</div>
              </div>
              <span class="status ${record.status === 'returned' ? 'status-returned' : 'status-active'}">
                ${record.status === 'returned' ? '✅ คืนแล้ว' : '🔄 กำลังยืม'}
              </span>
            </div>
            
            <div class="info-grid">
              <div class="info-row">
                <span class="label">🏷️ รหัสอุปกรณ์:</span>
                <span class="value">${record.equipmentId}</span>
              </div>
              <div class="info-row">
                <span class="label">📍 สถานที่:</span>
                <span class="value">${record.location}</span>
              </div>
              <div class="info-row">
                <span class="label">📅 วันที่ยืม:</span>
                <span class="value">${new Date(record.borrowDate).toLocaleDateString('th-TH')}</span>
              </div>
              <div class="info-row">
                <span class="label">⏰ กำหนดคืน:</span>
                <span class="value">${new Date(record.dueDate).toLocaleDateString('th-TH')}</span>
              </div>
              ${record.returnDate ? `
              <div class="info-row">
                <span class="label">✅ วันที่คืน:</span>
                <span class="value">${new Date(record.returnDate).toLocaleDateString('th-TH')}</span>
              </div>
              ` : ''}
              ${record.borrowDuration ? `
              <div class="info-row">
                <span class="label">⏱️ ระยะเวลาใช้:</span>
                <span class="value">${record.borrowDuration} วัน</span>
              </div>
              ` : ''}
            </div>
            
            <div class="purpose">
              <strong>🎯 วัตถุประสงค์:</strong> ${record.purpose}
            </div>
            
            ${record.rating ? `
            <div class="rating">
              <strong>⭐ คะแนนประเมิน:</strong> ${'★'.repeat(record.rating)}${'☆'.repeat(5-record.rating)} (${record.rating}/5 ดาว)
            </div>
            ` : ''}
            
            ${record.feedback ? `
            <div class="feedback">
              <strong>💬 ความคิดเห็น:</strong> "${record.feedback}"
            </div>
            ` : ''}
            
            ${record.lateReturn ? `
            <div class="late-warning">
              ⚠️ คืนช้า ${record.lateDays} วัน
            </div>
            ` : ''}
          </div>
        `).join('')}
        
        <div class="footer">
          <div>📊 รายงานนี้สร้างโดยระบบยืม-จองอุปกรณ์ RSU Medical Clinic</div>
          <div>สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}</div>
        </div>
        
        <script>
          // Auto focus for better printing experience
          window.addEventListener('load', function() {
            setTimeout(function() {
              if (confirm('🖨️ ต้องการพิมพ์หรือบันทึกเป็น PDF หรือไม่?')) {
                window.print();
              }
            }, 500);
          });
          
          // Close window after printing (optional)
          window.addEventListener('afterprint', function() {
            if (confirm('ปิดหน้าต่างนี้หรือไม่?')) {
              window.close();
            }
          });
        </script>
      </body>
      </html>
    `

    // Write content to new window
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Success message
    setTimeout(() => {
      alert('✅ เปิดหน้าต่างใหม่สำเร็จ!\n📋 กดปุ่ม "พิมพ์/บันทึก PDF" เพื่อสร้าง PDF\n💡 หรือใช้ Ctrl+P')
    }, 100)
    
  } catch (error) {
    console.error('Export failed:', error)
    alert('❌ เกิดข้อผิดพลาดในการสร้าง PDF\nกรุณาลองใหม่อีกครั้ง')
  }
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [activeTab, setActiveTab] = useState('history')

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setShowDetails(true)
  }

  const handleRate = (record: any, rating: number) => {
    console.log(`Rating ${record.id} with ${rating} stars`)
    // TODO: Implement rating API call
  }

  const handleExportPDF = () => {
    exportToPDF(filteredHistory, searchTerm, statusFilter)
  }

  // Filter and sort history
  const filteredHistory = mockHistory
    .filter(record => {
      const matchesSearch = record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.equipmentModel.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        case 'date-asc':
          return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime()
        case 'name':
          return a.equipmentName.localeCompare(b.equipmentName)
        default:
          return 0
      }
    })

  const generateMonthlyChart = () => {
    const maxValue = Math.max(...mockStats.monthlyBorrows)
    return mockStats.monthlyBorrows.map((value, index) => (
      <div key={index} className={styles.chartBar}>
        <div 
          className={styles.chartBarFill}
          style={{ height: `${(value / maxValue) * 100}%` }}
        />
        <span className={styles.chartValue}>{value}</span>
      </div>
    ))
  }

  return (
    <div className={styles.historyPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>ประวัติการใช้งาน</h1>
        <p className={styles.pageDescription}>ดูประวัติการยืม-คืนอุปกรณ์และสถิติการใช้งานของคุณ</p>
      </div>

      {/* Beautiful Stats Container */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <BeautifulIcons.Package size={48} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.totalBorrows}</span>
            <span className={styles.statLabel}>ยืมทั้งหมด</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <BeautifulIcons.CheckCircle size={48} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.completedBorrows}</span>
            <span className={styles.statLabel}>คืนสำเร็จ</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <BeautifulIcons.Star size={48} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.averageRating}</span>
            <span className={styles.statLabel}>คะแนนเฉลี่ย</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <BeautifulIcons.Calendar size={48} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{mockStats.totalDays}</span>
            <span className={styles.statLabel}>วันที่ใช้รวม</span>
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
          รายการยืม-คืน
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
          {/* Filters Section - Layout ที่ดีขึ้น */}
          <div className={styles.filtersSection}>
            {/* ช่องค้นหา - บรรทัดบน */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาอุปกรณ์หรือรุ่นที่ต้องการ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* Filters + ปุ่ม - บรรทัดล่าง */}
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>สถานะ:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="active">กำลังยืม</option>
                  <option value="returned">คืนแล้ว</option>
                  <option value="overdue">เกินกำหนด</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>เรียงตาม:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="date-desc">วันที่ล่าสุด</option>
                  <option value="date-asc">วันที่เก่าสุด</option>
                  <option value="name">ชื่ออุปกรณ์</option>
                </select>
              </div>

              <button 
                onClick={handleExportPDF}
                className={styles.exportButton}
              >
                <Download size={16} />
                ส่งออก PDF
              </button>
            </div>
          </div>

          {/* History List */}
          <div className={styles.historyContainer}>
            {filteredHistory.length > 0 ? (
              <div className={styles.historyList}>
                {filteredHistory.map(record => (
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
                    <span className={styles.achievementName}>ผู้ใช้งานตัวอย่าง</span>
                    <span className={styles.achievementDesc}>คืนอุปกรณ์ตรงเวลา 10 ครั้งติดต่อกัน</span>
                  </div>
                </div>
                <div className={styles.achievement}>
                  <TrendingUp className={styles.achievementIcon} />
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>นักเรียนรู้</span>
                    <span className={styles.achievementDesc}>ใช้อุปกรณ์หลากหลายประเภท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Pattern */}
            <div className={styles.patternCard}>
              <h3 className={styles.patternTitle}>รูปแบบการใช้งาน</h3>
              <div className={styles.patternStats}>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>ประเภทที่ใช้บ่อย</span>
                  <span className={styles.patternValue}>{mockStats.favoriteCategory}</span>
                </div>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>คืนตรงเวลา</span>
                  <span className={styles.patternValue}>{mockStats.onTimeReturns}/{mockStats.completedBorrows}</span>
                </div>
                <div className={styles.patternItem}>
                  <span className={styles.patternLabel}>การยืมเฉลี่ยต่อเดือน</span>
                  <span className={styles.patternValue}>{(mockStats.totalBorrows / 5).toFixed(1)} ครั้ง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}