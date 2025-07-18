'use client'

import { useState } from 'react'
import { 
  ClipboardCheck, Check, X, Clock, User, Calendar, 
  Package, AlertCircle, CheckCircle 
} from 'lucide-react'
import styles from '@/styles/admin-approvals.module.css'

interface ApprovalRequest {
  id: string
  requesterName: string
  requesterId: string
  equipmentName: string
  equipmentId: string
  requestDate: string
  startDate: string
  endDate: string
  purpose: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
}

export default function ApprovalsPage() {
  const [filter, setFilter] = useState('pending')

  const approvalRequests: ApprovalRequest[] = [
    {
      id: 'REQ001',
      requesterName: 'นิคม ใจดี',
      requesterId: '6606276',
      equipmentName: 'เครื่อง Ultrasound',
      equipmentId: 'EQ002',
      requestDate: '2025-01-07',
      startDate: '2025-01-08',
      endDate: '2025-01-10',
      purpose: 'การฝึกปฏิบัติคลินิก',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'REQ002',
      requesterName: 'สมชาย รักษ์ดี',
      requesterId: '6701234',
      equipmentName: 'เครื่องวัดความดันโลหิต',
      equipmentId: 'EQ001',
      requestDate: '2025-01-07',
      startDate: '2025-01-09',
      endDate: '2025-01-11',
      purpose: 'งานวิจัย',
      status: 'pending',
      priority: 'medium'
    }
  ]

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return styles.priorityHigh
      case 'medium': return styles.priorityMedium
      case 'low': return styles.priorityLow
      default: return styles.priorityMedium
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'สูง'
      case 'medium': return 'ปานกลาง'
      case 'low': return 'ต่ำ'
      default: return 'ปานกลาง'
    }
  }

  const handleApprove = (requestId: string) => {
    // Handle approval logic
    console.log('Approved:', requestId)
  }

  const handleReject = (requestId: string) => {
    // Handle rejection logic
    console.log('Rejected:', requestId)
  }

  return (
    <div className={styles.approvalsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <ClipboardCheck size={32} />
            อนุมัติคำขอ
          </h1>
          <p className={styles.pageSubtitle}>จัดการคำขอยืมอุปกรณ์ที่รอการอนุมัติ</p>
        </div>
        <div className={styles.statusBadges}>
          <div className={styles.statusBadge}>
            <Clock size={16} />
            รอการอนุมัติ: 7 รายการ
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            <Clock size={16} />
            รอการอนุมัติ (7)
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
            onClick={() => setFilter('approved')}
          >
            <CheckCircle size={16} />
            อนุมัติแล้ว
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'rejected' ? styles.active : ''}`}
            onClick={() => setFilter('rejected')}
          >
            <AlertCircle size={16} />
            ปฏิเสธ
          </button>
        </div>
      </div>

      <div className={styles.requestsList}>
        {approvalRequests.map((request) => (
          <div key={request.id} className={styles.requestCard}>
            <div className={styles.cardHeader}>
              <div className={styles.requestInfo}>
                <span className={styles.requestId}>#{request.id}</span>
                <span className={`${styles.priorityBadge} ${getPriorityClass(request.priority)}`}>
                  {getPriorityText(request.priority)}
                </span>
              </div>
              <div className={styles.requestDate}>
                📅 {request.requestDate}
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.requesterInfo}>
                <User size={20} />
                <div>
                  <h3 className={styles.requesterName}>{request.requesterName}</h3>
                  <p className={styles.requesterId}>ID: {request.requesterId}</p>
                </div>
              </div>

              <div className={styles.equipmentInfo}>
                <Package size={20} />
                <div>
                  <h4 className={styles.equipmentName}>{request.equipmentName}</h4>
                  <p className={styles.equipmentId}>รหัส: {request.equipmentId}</p>
                </div>
              </div>

              <div className={styles.scheduleInfo}>
                <Calendar size={20} />
                <div>
                  <p className={styles.schedule}>
                    <strong>ระยะเวลา:</strong> {request.startDate} ถึง {request.endDate}
                  </p>
                  <p className={styles.purpose}>
                    <strong>วัตถุประสงค์:</strong> {request.purpose}
                  </p>
                </div>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className={styles.cardActions}>
                <button 
                  className={`${styles.actionBtn} ${styles.approveBtn}`}
                  onClick={() => handleApprove(request.id)}
                >
                  <Check size={16} />
                  อนุมัติ
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.rejectBtn}`}
                  onClick={() => handleReject(request.id)}
                >
                  <X size={16} />
                  ปฏิเสธ
                </button>
                <button className={`${styles.actionBtn} ${styles.detailBtn}`}>
                  ดูรายละเอียด
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}