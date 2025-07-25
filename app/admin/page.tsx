// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package2, Users, ClipboardCheck, AlertTriangle,
  TrendingUp, TrendingDown, Activity, Plus,
  Eye, Edit, Trash2, CheckCircle, Clock, XCircle
} from 'lucide-react'
import styles from '@/styles/pages/admin-dashboard.module.css'

// Mock Data - ในอนาคตจะมาจาก API
const statsData = {
  totalEquipment: 124,
  availableEquipment: 89,
  borrowedEquipment: 23,
  maintenanceEquipment: 12,
  totalUsers: 1,
  activeUsers: 856,
  totalBorrows: 2341,
  overdueItems: 7
}

const recentActivities = [
  {
    id: 1,
    type: 'borrow',
    user: 'นิคม ใจดี',
    equipment: 'เครื่องวัดความดันโลหิต',
    action: 'ยืมอุปกรณ์',
    time: '10 นาทีที่แล้ว',
    status: 'success'
  },
  {
    id: 2,
    type: 'return',
    user: 'สมหญิง รักดี',
    equipment: 'ชุดตรวจหูคอจมูก',
    action: 'คืนอุปกรณ์',
    time: '25 นาทีที่แล้ว',
    status: 'success'
  },
  {
    id: 3,
    type: 'maintenance',
    user: 'ระบบ',
    equipment: 'เครื่อง Ultrasound',
    action: 'เข้าสู่การบำรุงรักษา',
    time: '1 ชั่วโมงที่แล้ว',
    status: 'warning'
  },
  {
    id: 4,
    type: 'overdue',
    user: 'วิชัย ใจเย็น',
    equipment: 'เครื่องวัดน้ำตาล',
    action: 'เกินกำหนดคืน',
    time: '2 ชั่วโมงที่แล้ว',
    status: 'danger'
  }
]

const pendingApprovals = [
  {
    id: 'BR001',
    requester: 'สมหญิง รักดี',
    studentId: '6606123',
    equipment: 'เครื่องวัดความดันโลหิต OMRON',
    requestDate: '2025-01-18',
    requestedDate: '2025-01-19',
    priority: 'normal',
    purpose: 'ฝึกปฏิบัติการพยาบาล'
  },
  {
    id: 'BR002',
    requester: 'วิชัย ใจเย็น',
    studentId: '6606124',
    equipment: 'ชุดตรวจหูคอจมูก',
    requestDate: '2025-01-18',
    requestedDate: '2025-01-20',
    priority: 'urgent',
    purpose: 'การสอบปฏิบัติ'
  }
]

interface StatCardProps {
  title: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
  href?: string
}

function StatCard({ title, value, change, changeType, icon, color, href }: StatCardProps) {
  const content = (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statCardHeader}>
        <div className={styles.statCardIcon}>
          {icon}
        </div>
        {change && (
          <div className={`${styles.statCardChange} ${styles[changeType || 'increase']}`}>
            {changeType === 'increase' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className={styles.statCardBody}>
        <h3 className={styles.statCardValue}>{value}</h3>
        <p className={styles.statCardTitle}>{title}</p>
      </div>
      
      {change && (
        <div className={styles.statCardFooter}>
          <span className={styles.changeText}>
            {changeType === 'increase' ? 'เพิ่มขึ้น' : 'ลดลง'} จากเดือนที่แล้ว
          </span>
        </div>
      )}
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>แดชบอร์ดแอดมิน</h1>
          <p className={styles.pageSubtitle}>ภาพรวมระบบยืมคืนอุปกรณ์การแพทย์</p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link href="/admin/equipment/add" className={styles.primaryButton}>
            <Plus size={20} />
            เพิ่มอุปกรณ์ใหม่
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="อุปกรณ์ทั้งหมด"
          value={statsData.totalEquipment}
          change={5.2}
          changeType="increase"
          icon={<Package2 size={24} />}
          color="blue"
          href="/admin/equipment"
        />
        
        <StatCard
          title="อุปกรณ์พร้อมใช้"
          value={statsData.availableEquipment}
          change={2.1}
          changeType="decrease"
          icon={<CheckCircle size={24} />}
          color="green"
          href="/admin/equipment?status=available"
        />
        
        <StatCard
          title="อุปกรณ์ถูกยืม"
          value={statsData.borrowedEquipment}
          change={12.5}
          changeType="increase"
          icon={<Clock size={24} />}
          color="yellow"
          href="/admin/equipment?status=borrowed"
        />
        
        <StatCard
          title="ต้องบำรุงรักษา"
          value={statsData.maintenanceEquipment}
          change={8.3}
          changeType="decrease"
          icon={<AlertTriangle size={24} />}
          color="red"
          href="/admin/maintenance"
        />
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        
        {/* Pending Approvals */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>คำขออนุมัติล่าสุด</h2>
              <div className={styles.cardBadge}>
                {pendingApprovals.length} รายการ
              </div>
            </div>
            
            <div className={styles.cardBody}>
              {pendingApprovals.length > 0 ? (
                <div className={styles.approvalsList}>
                  {pendingApprovals.map((request) => (
                    <div key={request.id} className={styles.approvalItem}>
                      <div className={styles.approvalInfo}>
                        <h4 className={styles.approvalRequester}>{request.requester}</h4>
                        <p className={styles.approvalEquipment}>{request.equipment}</p>
                        <p className={styles.approvalDate}>วันที่ต้องการ: {request.requestedDate}</p>
                        <p className={styles.approvalPurpose}>{request.purpose}</p>
                      </div>
                      
                      <div className={styles.approvalActions}>
                        <span className={`${styles.priorityBadge} ${styles[request.priority]}`}>
                          {request.priority === 'urgent' ? 'ด่วน' : 'ปกติ'}
                        </span>
                        <div className={styles.actionButtons}>
                          <button className={styles.approveBtn}>อนุมัติ</button>
                          <button className={styles.rejectBtn}>ปฏิเสธ</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <ClipboardCheck size={48} />
                  <p>ไม่มีคำขอรออนุมัติ</p>
                </div>
              )}
            </div>
            
            <div className={styles.cardFooter}>
              <Link href="/admin/approvals" className={styles.viewAllLink}>
                ดูทั้งหมด
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>กิจกรรมล่าสุด</h2>
              <div className={styles.cardActions}>
                <button className={styles.refreshBtn}>
                  <Activity size={16} />
                </button>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.status]}`}>
                      {activity.type === 'borrow' && <Plus size={16} />}
                      {activity.type === 'return' && <CheckCircle size={16} />}
                      {activity.type === 'maintenance' && <AlertTriangle size={16} />}
                      {activity.type === 'overdue' && <XCircle size={16} />}
                    </div>
                    
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>
                        <span className={styles.activityUser}>{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className={styles.activityEquipment}>{activity.equipment}</span>
                      </p>
                      <p className={styles.activityTime}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <Link href="/admin/activities" className={styles.viewAllLink}>
                ดูกิจกรรมทั้งหมด
              </Link>
            </div>
          </div>
        </div>

        {/* Equipment Status Overview */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>สถานะอุปกรณ์</h2>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.statusOverview}>
                <div className={styles.statusItem}>
                  <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${styles.available}`}></div>
                    <span>พร้อมใช้งาน</span>
                  </div>
                  <span className={styles.statusCount}>89 (72%)</span>
                </div>
                
                <div className={styles.statusItem}>
                  <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${styles.borrowed}`}></div>
                    <span>ถูกยืม</span>
                  </div>
                  <span className={styles.statusCount}>23 (18%)</span>
                </div>
                
                <div className={styles.statusItem}>
                  <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${styles.maintenance}`}></div>
                    <span>ซ่อมบำรุง</span>
                  </div>
                  <span className={styles.statusCount}>8 (7%)</span>
                </div>
                
                <div className={styles.statusItem}>
                  <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${styles.broken}`}></div>
                    <span>เสียหาย</span>
                  </div>
                  <span className={styles.statusCount}>4 (3%)</span>
                </div>
              </div>
              
              <div className={styles.statusChart}>
                <div className={styles.chartBar}>
                  <div className={`${styles.chartSegment} ${styles.available}`} style={{width: '72%'}}></div>
                  <div className={`${styles.chartSegment} ${styles.borrowed}`} style={{width: '18%'}}></div>
                  <div className={`${styles.chartSegment} ${styles.maintenance}`} style={{width: '7%'}}></div>
                  <div className={`${styles.chartSegment} ${styles.broken}`} style={{width: '3%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>การจัดการด่วน</h2>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.quickActions}>
                <Link href="/admin/equipment/add" className={styles.quickAction}>
                  <Plus size={24} />
                  <span>เพิ่มอุปกรณ์</span>
                </Link>
                
                <Link href="/admin/users/add" className={styles.quickAction}>
                  <Users size={24} />
                  <span>เพิ่มผู้ใช้</span>
                </Link>
                
                <Link href="/admin/reports" className={styles.quickAction}>
                  <Activity size={24} />
                  <span>ดูรายงาน</span>
                </Link>
                
                <Link href="/admin/settings" className={styles.quickAction}>
                  <AlertTriangle size={24} />
                  <span>ตั้งค่าระบบ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}