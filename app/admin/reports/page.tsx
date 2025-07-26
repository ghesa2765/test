// app/admin/reports/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  Printer,
  Mail,
  Share2,
  TrendingUp,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import styles from '@/styles/pages/admin-reports.module.css'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'equipment' | 'bookings' | 'users' | 'maintenance' | 'analytics'
  icon: string
  formats: ('pdf' | 'excel' | 'csv' | 'word')[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  lastGenerated?: string
  isPopular?: boolean
}

interface ReportData {
  totalEquipment: number
  totalBookings: number
  totalUsers: number
  equipmentUtilization: number
  averageBookingDuration: number
  topEquipment: Array<{
    name: string
    usage: number
    category: string
  }>
  monthlyTrends: Array<{
    month: string
    bookings: number
    equipment: number
  }>
  departmentUsage: Array<{
    department: string
    bookings: number
    users: number
  }>
}

// Mock data สำหรับรายงาน
const reportTemplates: ReportTemplate[] = [
  {
    id: 'equipment-usage',
    name: 'รายงานการใช้งานอุปกรณ์',
    description: 'สถิติการใช้งานอุปกรณ์แต่ละประเภท พร้อมอัตราการใช้งาน',
    category: 'equipment',
    icon: '📊',
    formats: ['pdf', 'excel', 'csv'],
    frequency: 'monthly',
    lastGenerated: '2024-01-25',
    isPopular: true
  },
  {
    id: 'booking-summary',
    name: 'สรุปการจองรายเดือน',
    description: 'รายงานสรุปการจองอุปกรณ์ รวมสถิติการอนุมัติและปฏิเสธ',
    category: 'bookings',
    icon: '📅',
    formats: ['pdf', 'excel', 'word'],
    frequency: 'monthly',
    lastGenerated: '2024-01-20',
    isPopular: true
  },
  {
    id: 'user-activity',
    name: 'รายงานกิจกรรมผู้ใช้',
    description: 'สถิติการใช้งานของผู้ใช้แต่ละแผนก และความถี่ในการยืมอุปกรณ์',
    category: 'users',
    icon: '👥',
    formats: ['pdf', 'excel', 'csv'],
    frequency: 'weekly',
    lastGenerated: '2024-01-22'
  },
  {
    id: 'maintenance-schedule',
    name: 'ตารางบำรุงรักษาอุปกรณ์',
    description: 'รายการอุปกรณ์ที่ต้องบำรุงรักษา และกำหนดการซ่อมแซม',
    category: 'maintenance',
    icon: '🔧',
    formats: ['pdf', 'excel'],
    frequency: 'weekly',
    lastGenerated: '2024-01-24'
  },
  {
    id: 'department-usage',
    name: 'การใช้งานแยกตามแผนก',
    description: 'สถิติการใช้งานอุปกรณ์ของแต่ละแผนก และอุปกรณ์ที่ได้รับความนิยม',
    category: 'analytics',
    icon: '🏢',
    formats: ['pdf', 'excel', 'csv', 'word'],
    frequency: 'monthly',
    lastGenerated: '2024-01-18'
  },
  {
    id: 'overdue-items',
    name: 'รายงานอุปกรณ์เกินกำหนด',
    description: 'รายการอุปกรณ์ที่เกินกำหนดคืน และการติดตาม',
    category: 'bookings',
    icon: '⚠️',
    formats: ['pdf', 'excel'],
    frequency: 'daily',
    lastGenerated: '2024-01-26',
    isPopular: true
  },
  {
    id: 'financial-summary',
    name: 'สรุปการเงินและค่าใช้จ่าย',
    description: 'รายงานค่าใช้จ่ายในการบำรุงรักษา และมูลค่าอุปกรณ์',
    category: 'analytics',
    icon: '💰',
    formats: ['pdf', 'excel', 'word'],
    frequency: 'monthly',
    lastGenerated: '2024-01-15'
  },
  {
    id: 'approval-workflow',
    name: 'รายงานขั้นตอนการอนุมัติ',
    description: 'สถิติเวลาในการอนุมัติ และประสิทธิภาพของระบบ',
    category: 'bookings',
    icon: '✅',
    formats: ['pdf', 'excel'],
    frequency: 'weekly',
    lastGenerated: '2024-01-23'
  }
]

const mockReportData: ReportData = {
  totalEquipment: 124,
  totalBookings: 567,
  totalUsers: 89,
  equipmentUtilization: 73,
  averageBookingDuration: 2.4,
  topEquipment: [
    { name: 'เครื่องวัดความดัน', usage: 89, category: 'อุปกรณ์ตรวจวัด' },
    { name: 'วอกเกอร์ 4 ขา', usage: 67, category: 'อุปกรณ์ช่วยเหลือ' },
    { name: 'หุ่นจำลอง CPR', usage: 45, category: 'อุปกรณ์ฝึกอบรม' }
  ],
  monthlyTrends: [
    { month: 'ต.ค.', bookings: 45, equipment: 120 },
    { month: 'พ.ย.', bookings: 52, equipment: 122 },
    { month: 'ธ.ค.', bookings: 67, equipment: 124 },
    { month: 'ม.ค.', bookings: 71, equipment: 124 }
  ],
  departmentUsage: [
    { department: 'อายุรกรรม', bookings: 156, users: 23 },
    { department: 'พยาบาล', bookings: 134, users: 31 },
    { department: 'กายภาพบำบัด', bookings: 89, users: 12 }
  ]
}

const categories = ['ทั้งหมด', 'equipment', 'bookings', 'users', 'maintenance', 'analytics']
const formats = ['pdf', 'excel', 'csv', 'word']

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedFormat, setSelectedFormat] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })
  const [filteredTemplates, setFilteredTemplates] = useState<ReportTemplate[]>(reportTemplates)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [reportData] = useState<ReportData>(mockReportData)

  // Filter templates based on category
  useEffect(() => {
    let filtered = reportTemplates
    
    if (selectedCategory !== 'ทั้งหมด') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }, [selectedCategory])

  const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, { name: string; icon: string; color: string }> = {
      'equipment': { name: 'อุปกรณ์', icon: '📦', color: 'blue' },
      'bookings': { name: 'การจอง', icon: '📅', color: 'green' },
      'users': { name: 'ผู้ใช้', icon: '👥', color: 'purple' },
      'maintenance': { name: 'บำรุงรักษา', icon: '🔧', color: 'orange' },
      'analytics': { name: 'วิเคราะห์', icon: '📊', color: 'red' }
    }
    return categoryMap[category] || { name: category, icon: '📄', color: 'gray' }
  }

  const getFormatIcon = (format: string) => {
    const formatIcons: Record<string, string> = {
      'pdf': '📄',
      'excel': '📊',
      'csv': '📋',
      'word': '📝'
    }
    return formatIcons[format] || '📄'
  }

  const handleGenerateReport = async (templateId: string, format: string) => {
    setIsGenerating(templateId)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log(`Generating report: ${templateId} in ${format} format`)
    console.log('Date range:', dateRange)
    
    // In real implementation, this would call the API
    // const response = await fetch(`/api/admin/reports/generate`, {
    //   method: 'POST',
    //   body: JSON.stringify({ templateId, format, dateRange })
    // })
    
    setIsGenerating(null)
  }

  const handleQuickGenerate = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId)
    if (template && template.formats.length > 0) {
      handleGenerateReport(templateId, template.formats[0])
    }
  }

  const handleScheduleReport = (templateId: string) => {
    console.log(`Scheduling automatic report generation for: ${templateId}`)
    // Implement scheduling logic
  }

  const handleShareReport = (templateId: string) => {
    console.log(`Sharing report: ${templateId}`)
    // Implement sharing functionality
  }

  const formatLastGenerated = (dateString?: string) => {
    if (!dateString) return 'ยังไม่เคยสร้าง'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const popularTemplates = reportTemplates.filter(t => t.isPopular)

  return (
    <div className={styles.reportsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>📊 รายงานและการวิเคราะห์</h1>
            <p className={styles.pageSubtitle}>
              สร้างรายงานและส่งออกข้อมูลในรูปแบบต่าง ๆ เพื่อการนำเสนอและการตัดสินใจ
            </p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.secondaryButton}
              onClick={() => setShowPreview(!showPreview)}
            >
              <BarChart3 size={18} />
              {showPreview ? 'ซ่อนตัวอย่าง' : 'แสดงตัวอย่าง'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats & Preview */}
      {showPreview && (
        <div className={styles.previewSection}>
          <h2 className={styles.sectionTitle}>📈 ข้อมูลสำคัญ</h2>
          
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📦</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{reportData.totalEquipment}</div>
                <div className={styles.statLabel}>อุปกรณ์ทั้งหมด</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{reportData.totalBookings}</div>
                <div className={styles.statLabel}>การจองทั้งหมด</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{reportData.totalUsers}</div>
                <div className={styles.statLabel}>ผู้ใช้ทั้งหมด</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{reportData.equipmentUtilization}%</div>
                <div className={styles.statLabel}>อัตราการใช้งาน</div>
              </div>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3>🏆 อุปกรณ์ยอดนิยม</h3>
              <div className={styles.topItemsList}>
                {reportData.topEquipment.map((item, index) => (
                  <div key={index} className={styles.topItem}>
                    <div className={styles.itemRank}>#{index + 1}</div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemCategory}>{item.category}</div>
                    </div>
                    <div className={styles.itemUsage}>{item.usage} ครั้ง</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>📈 แนวโน้มรายเดือน</h3>
              <div className={styles.trendChart}>
                {reportData.monthlyTrends.map((trend, index) => (
                  <div key={index} className={styles.trendItem}>
                    <div className={styles.trendMonth}>{trend.month}</div>
                    <div className={styles.trendBars}>
                      <div 
                        className={styles.trendBar}
                        style={{ 
                          height: `${(trend.bookings / 80) * 100}%`,
                          background: '#3b82f6'
                        }}
                        title={`การจอง: ${trend.bookings}`}
                      ></div>
                    </div>
                    <div className={styles.trendValue}>{trend.bookings}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Reports */}
      {popularTemplates.length > 0 && (
        <div className={styles.popularSection}>
          <h2 className={styles.sectionTitle}>⭐ รายงานยอดนิยม</h2>
          <div className={styles.popularGrid}>
            {popularTemplates.map((template) => (
              <div key={template.id} className={styles.popularCard}>
                <div className={styles.popularHeader}>
                  <div className={styles.popularIcon}>{template.icon}</div>
                  <div className={styles.popularInfo}>
                    <div className={styles.popularName}>{template.name}</div>
                    <div className={styles.popularDesc}>{template.description}</div>
                  </div>
                </div>
                <div className={styles.popularActions}>
                  <button
                    className={styles.generateButton}
                    onClick={() => handleQuickGenerate(template.id)}
                    disabled={isGenerating === template.id}
                  >
                    {isGenerating === template.id ? (
                      <><div className={styles.spinner}></div> กำลังสร้าง...</>
                    ) : (
                      <><Download size={16} /> สร้างรายงาน</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label>หมวดหมู่:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ทั้งหมด' ? category : getCategoryDisplay(category).name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>ช่วงวันที่:</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className={styles.dateInput}
              />
              <span>ถึง</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className={styles.templatesSection}>
        <h2 className={styles.sectionTitle}>📋 เทมเพลตรายงาน</h2>
        
        <div className={styles.templatesList}>
          {filteredTemplates.map((template) => {
            const categoryInfo = getCategoryDisplay(template.category)
            
            return (
              <div key={template.id} className={styles.templateCard}>
                <div className={styles.templateHeader}>
                  <div className={styles.templateIcon}>{template.icon}</div>
                  <div className={styles.templateInfo}>
                    <div className={styles.templateName}>
                      {template.name}
                      {template.isPopular && (
                        <span className={styles.popularBadge}>⭐</span>
                      )}
                    </div>
                    <div className={styles.templateDesc}>{template.description}</div>
                    <div className={styles.templateMeta}>
                      <span className={`${styles.categoryBadge} ${styles[categoryInfo.color]}`}>
                        {categoryInfo.icon} {categoryInfo.name}
                      </span>
                      <span className={styles.frequency}>
                        🔄 {template.frequency === 'daily' ? 'รายวัน' :
                             template.frequency === 'weekly' ? 'รายสัปดาห์' :
                             template.frequency === 'monthly' ? 'รายเดือน' : 'กำหนดเอง'}
                      </span>
                      <span className={styles.lastGenerated}>
                        📅 สร้างล่าสุด: {formatLastGenerated(template.lastGenerated)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.templateActions}>
                  <div className={styles.formatButtons}>
                    {template.formats.map((format) => (
                      <button
                        key={format}
                        className={`${styles.formatButton} ${selectedFormat === format ? styles.active : ''}`}
                        onClick={() => handleGenerateReport(template.id, format)}
                        disabled={isGenerating === template.id}
                        title={`ส่งออกเป็น ${format.toUpperCase()}`}
                      >
                        {getFormatIcon(format)}
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleScheduleReport(template.id)}
                      title="ตั้งเวลาสร้างอัตโนมัติ"
                    >
                      <Clock size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleShareReport(template.id)}
                      title="แชร์รายงาน"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      title="พิมพ์รายงาน"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      title="ส่งทางอีเมล"
                    >
                      <Mail size={16} />
                    </button>
                  </div>
                </div>

                {isGenerating === template.id && (
                  <div className={styles.generatingOverlay}>
                    <div className={styles.spinner}></div>
                    <span>กำลังสร้างรายงาน...</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3>ไม่พบเทมเพลตรายงาน</h3>
            <p>ไม่มีเทมเพลตรายงานในหมวดหมู่ที่เลือก</p>
            <button
              className={styles.primaryButton}
              onClick={() => setSelectedCategory('ทั้งหมด')}
            >
              แสดงทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>⚡ การดำเนินการด่วน</h2>
        
        <div className={styles.quickActionsGrid}>
          <div className={styles.quickAction}>
            <div className={styles.quickActionIcon}>📈</div>
            <div className={styles.quickActionContent}>
              <div className={styles.quickActionTitle}>รายงานประจำวัน</div>
              <div className={styles.quickActionDesc}>สรุปกิจกรรมและสถิติของวันนี้</div>
            </div>
            <button className={styles.quickActionButton}>สร้าง</button>
          </div>

          <div className={styles.quickAction}>
            <div className={styles.quickActionIcon}>⚠️</div>
            <div className={styles.quickActionContent}>
              <div className={styles.quickActionTitle}>รายงานปัญหาด่วน</div>
              <div className={styles.quickActionDesc}>อุปกรณ์เสียหายและเกินกำหนด</div>
            </div>
            <button className={styles.quickActionButton}>สร้าง</button>
          </div>

          <div className={styles.quickAction}>
            <div className={styles.quickActionIcon}>📊</div>
            <div className={styles.quickActionContent}>
              <div className={styles.quickActionTitle}>สรุปประจำเดือน</div>
              <div className={styles.quickActionDesc}>รายงานครบวงจรสำหรับผู้บริหาร</div>
            </div>
            <button className={styles.quickActionButton}>สร้าง</button>
          </div>

          <div className={styles.quickAction}>
            <div className={styles.quickActionIcon}>🎯</div>
            <div className={styles.quickActionContent}>
              <div className={styles.quickActionTitle}>รายงานเฉพาะเจาะจง</div>
              <div className={styles.quickActionDesc}>สร้างรายงานตามต้องการ</div>
            </div>
            <button className={styles.quickActionButton}>กำหนดเอง</button>
          </div>
        </div>
      </div>
    </div>
  )
}