// app/admin/approvals/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  Package,
  MapPin,
  MessageSquare,
  Check,
  X,
  Eye,
  Filter,
  Download
} from 'lucide-react'
import styles from '@/styles/pages/admin-approvals.module.css'

interface BookingRequest {
  id: string
  bookingNo: string
  user: {
    firstName: string
    lastName: string
    department: string
    position: string
    phone: string
    email: string
  }
  equipment: {
    id: string
    name: string
    code: string
    category: {
      name: string
      icon: string
    }
    location: {
      name: string
    }
  }
  purpose: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  requestedAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  notes?: string
}

// Mock data สำหรับคำขออนุมัติ
const mockRequests: BookingRequest[] = [
  {
    id: '1',
    bookingNo: 'BK000001',
    user: {
      firstName: 'นพ.สมชาย',
      lastName: 'ใจดี',
      department: 'อายุรกรรม',
      position: 'แพทย์ประจำ',
      phone: '02-997-2201',
      email: 'doctor1@rsu.ac.th'
    },
    equipment: {
      id: 'eq1',
      name: 'เครื่องวัดความดันโลหิต OMRON',
      code: 'HEM-001',
      category: { name: 'อุปกรณ์ตรวจวัด', icon: '🩺' },
      location: { name: 'ห้องตรวจ A' }
    },
    purpose: 'ตรวจสุขภาพประจำปีสำหรับพนักงาน',
    startDate: '2024-01-27',
    endDate: '2024-01-27',
    startTime: '08:00',
    endTime: '12:00',
    status: 'PENDING',
    priority: 'HIGH',
    requestedAt: '2024-01-26 10:30:00'
  },
  {
    id: '2',
    bookingNo: 'BK000002',
    user: {
      firstName: 'พย.สุดา',
      lastName: 'จริงใจ',
      department: 'พยาบาล',
      position: 'พยาบาลวิชาชีพ',
      phone: '02-997-2202',
      email: 'nurse1@rsu.ac.th'
    },
    equipment: {
      id: 'eq2',
      name: 'หุ่นจำลอง CPR',
      code: 'CPR-001',
      category: { name: 'อุปกรณ์ฝึกอบรม', icon: '🫁' },
      location: { name: 'ห้องฝึกปฏิบัติ' }
    },
    purpose: 'ฝึกอบรมการช่วยชีวิตเบื้องต้นให้กับนักศึกษาพยาบาล',
    startDate: '2024-01-28',
    endDate: '2024-01-30',
    startTime: '13:00',
    endTime: '17:00',
    status: 'PENDING',
    priority: 'MEDIUM',
    requestedAt: '2024-01-26 09:15:00'
  },
  {
    id: '3',
    bookingNo: 'BK000003',
    user: {
      firstName: 'วิไล',
      lastName: 'มานะดี',
      department: 'กายภาพบำบัด',
      position: 'นักกายภาพบำบัด',
      phone: '02-997-2203',
      email: 'staff1@rsu.ac.th'
    },
    equipment: {
      id: 'eq3',
      name: 'วอกเกอร์ 4 ขา',
      code: 'WLK-001',
      category: { name: 'อุปกรณ์ช่วยเหลือ', icon: '🚶' },
      location: { name: 'ห้องกายภาพบำบัด' }
    },
    purpose: 'บำบัดรักษาผู้ป่วยที่มีปัญหาการเดิน',
    startDate: '2024-01-26',
    endDate: '2024-01-28',
    startTime: '08:00',
    endTime: '16:00',
    status: 'PENDING',
    priority: 'CRITICAL',
    requestedAt: '2024-01-25 16:45:00'
  },
  {
    id: '4',
    bookingNo: 'BK000004',
    user: {
      firstName: 'นิคม',
      lastName: 'เรียนดี',
      department: 'แพทยศาสตร์',
      position: 'นักศึกษาแพทย์',
      phone: '02-997-2204',
      email: 'student1@rsu.ac.th'
    },
    equipment: {
      id: 'eq4',
      name: 'เครื่องวัดอุณหภูมิดิจิทัล',
      code: 'TMP-001',
      category: { name: 'อุปกรณ์ตรวจวัด', icon: '🌡️' },
      location: { name: 'ห้องตรวจ B' }
    },
    purpose: 'การเรียนการสอนในรายวิชาการตรวจร่างกาย',
    startDate: '2024-01-29',
    endDate: '2024-01-29',
    startTime: '10:00',
    endTime: '15:00',
    status: 'PENDING',
    priority: 'LOW',
    requestedAt: '2024-01-26 11:20:00'
  },
  {
    id: '5',
    bookingNo: 'BK000005',
    user: {
      firstName: 'สมใจ',
      lastName: 'รักงาน',
      department: 'อายุรกรรม',
      position: 'แพทย์ฝึกหัด',
      phone: '02-997-2205',
      email: 'intern1@rsu.ac.th'
    },
    equipment: {
      id: 'eq5',
      name: 'วิลแชร์',
      code: 'WCH-001',
      category: { name: 'อุปกรณ์ช่วยเหลือ', icon: '♿' },
      location: { name: 'ห้องผู้ป่วยนอก' }
    },
    purpose: 'ช่วยเหลือผู้ป่วยที่มีข้อจำกัดในการเคลื่อนไหว',
    startDate: '2024-01-30',
    endDate: '2024-02-01',
    startTime: '08:00',
    endTime: '17:00',
    status: 'PENDING',
    priority: 'MEDIUM',
    requestedAt: '2024-01-26 08:45:00'
  }
]

const priorityFilters = ['ทั้งหมด', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const statusFilters = ['PENDING', 'APPROVED', 'REJECTED']

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>(mockRequests)
  const [filteredRequests, setFilteredRequests] = useState<BookingRequest[]>(mockRequests)
  const [selectedPriority, setSelectedPriority] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('PENDING')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [approvalModal, setApprovalModal] = useState<{
    show: boolean
    request: BookingRequest | null
    action: 'approve' | 'reject' | null
  }>({
    show: false,
    request: null,
    action: null
  })
  const [rejectionReason, setRejectionReason] = useState('')

  // Filter logic
  useEffect(() => {
    let filtered = requests

    // Status filter
    if (selectedStatus !== 'ทั้งหมด') {
      filtered = filtered.filter(req => req.status === selectedStatus)
    }

    // Priority filter
    if (selectedPriority !== 'ทั้งหมด') {
      filtered = filtered.filter(req => req.priority === selectedPriority)
    }

    // Sort by priority and request time
    filtered.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
    })

    setFilteredRequests(filtered)
  }, [requests, selectedStatus, selectedPriority])

  const getPriorityDisplay = (priority: BookingRequest['priority']) => {
    const priorityMap = {
      'CRITICAL': { text: 'วิกฤต', class: 'critical' },
      'HIGH': { text: 'สูง', class: 'high' },
      'MEDIUM': { text: 'ปานกลาง', class: 'medium' },
      'LOW': { text: 'ต่ำ', class: 'low' }
    }
    return priorityMap[priority]
  }

  const getTimeUntilStart = (startDate: string) => {
    const start = new Date(startDate)
    const now = new Date()
    const diffInHours = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 0) return { text: 'เลยกำหนดแล้ว', class: 'overdue' }
    if (diffInHours < 24) return { text: `อีก ${diffInHours} ชั่วโมง`, class: 'urgent' }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return { text: 'พรุ่งนี้', class: 'soon' }
    if (diffInDays <= 3) return { text: `อีก ${diffInDays} วัน`, class: 'soon' }
    
    return { text: `อีก ${diffInDays} วัน`, class: 'normal' }
  }

  const getWaitingTime = (requestedAt: string) => {
    const requested = new Date(requestedAt)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - requested.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'เมื่อสักครู่'
    if (diffInHours < 24) return `รอมาแล้ว ${diffInHours} ชั่วโมง`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `รอมาแล้ว ${diffInDays} วัน`
  }

  const handleSelectAll = () => {
    const pendingRequests = filteredRequests.filter(req => req.status === 'PENDING')
    if (selectedItems.length === pendingRequests.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(pendingRequests.map(req => req.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const openApprovalModal = (request: BookingRequest, action: 'approve' | 'reject') => {
    setApprovalModal({ show: true, request, action })
    setRejectionReason('')
  }

  const closeApprovalModal = () => {
    setApprovalModal({ show: false, request: null, action: null })
    setRejectionReason('')
  }

  const handleApproval = async () => {
    if (!approvalModal.request || !approvalModal.action) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedRequests = requests.map(req => {
      if (req.id === approvalModal.request!.id) {
        const now = new Date().toISOString()
        if (approvalModal.action === 'approve') {
          return { ...req, status: 'APPROVED' as const, approvedAt: now }
        } else {
          return { 
            ...req, 
            status: 'REJECTED' as const, 
            rejectedAt: now,
            rejectionReason: rejectionReason || 'ไม่ระบุเหตุผล'
          }
        }
      }
      return req
    })

    setRequests(updatedRequests)
    setIsLoading(false)
    closeApprovalModal()
  }

  const handleBulkApproval = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const updatedRequests = requests.map(req => {
      if (selectedItems.includes(req.id) && req.status === 'PENDING') {
        const now = new Date().toISOString()
        if (action === 'approve') {
          return { ...req, status: 'APPROVED' as const, approvedAt: now }
        } else {
          return { 
            ...req, 
            status: 'REJECTED' as const, 
            rejectedAt: now,
            rejectionReason: 'อนุมัติแบบกลุ่ม'
          }
        }
      }
      return req
    })

    setRequests(updatedRequests)
    setSelectedItems([])
    setIsLoading(false)
  }

  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const criticalCount = requests.filter(r => r.status === 'PENDING' && r.priority === 'CRITICAL').length
  const overdueCount = requests.filter(r => {
    if (r.status !== 'PENDING') return false
    return new Date(r.startDate) < new Date()
  }).length

  return (
    <div className={styles.approvalsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>📋 อนุมัติคำขอยืมอุปกรณ์</h1>
            <p className={styles.pageSubtitle}>
              จัดการและอนุมัติคำขอยืมอุปกรณ์จากผู้ใช้งาน
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton}>
              <Download size={18} />
              ส่งออกรายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className={styles.alertSummary}>
        <div className={styles.alertItem}>
          <div className={styles.alertIcon}>⏰</div>
          <div className={styles.alertContent}>
            <div className={styles.alertValue}>{pendingCount}</div>
            <div className={styles.alertLabel}>รอการอนุมัติ</div>
          </div>
        </div>
        <div className={styles.alertItem}>
          <div className={styles.alertIcon}>🚨</div>
          <div className={styles.alertContent}>
            <div className={styles.alertValue}>{criticalCount}</div>
            <div className={styles.alertLabel}>วิกฤต/ด่วน</div>
          </div>
        </div>
        <div className={styles.alertItem}>
          <div className={styles.alertIcon}>⚠️</div>
          <div className={styles.alertContent}>
            <div className={styles.alertValue}>{overdueCount}</div>
            <div className={styles.alertLabel}>เลยกำหนด</div>
          </div>
        </div>
        <div className={styles.alertItem}>
          <div className={styles.alertIcon}>📈</div>
          <div className={styles.alertContent}>
            <div className={styles.alertValue}>
              {Math.round((requests.filter(r => r.status === 'APPROVED').length / requests.length) * 100)}%
            </div>
            <div className={styles.alertLabel}>อัตราอนุมัติ</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.statusTabs}>
          {statusFilters.map(status => (
            <button
              key={status}
              className={`${styles.statusTab} ${selectedStatus === status ? styles.active : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'PENDING' && '⏳'} 
              {status === 'APPROVED' && '✅'} 
              {status === 'REJECTED' && '❌'} 
              {status === 'PENDING' ? 'รออนุมัติ' :
               status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ปฏิเสธแล้ว'}
              <span className={styles.tabCount}>
                {requests.filter(r => r.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.filterSection}>
          <button
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            ตัวกรอง
          </button>
        </div>

        {showFilters && (
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label>ระดับความสำคัญ:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className={styles.filterSelect}
              >
                {priorityFilters.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'ทั้งหมด' ? priority : getPriorityDisplay(priority as any)?.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && selectedStatus === 'PENDING' && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>
              เลือกแล้ว {selectedItems.length} รายการ
            </span>
            <div className={styles.bulkButtons}>
              <button
                className={`${styles.bulkButton} ${styles.approve}`}
                onClick={() => handleBulkApproval('approve')}
                disabled={isLoading}
              >
                <Check size={16} />
                อนุมัติทั้งหมด
              </button>
              <button
                className={`${styles.bulkButton} ${styles.reject}`}
                onClick={() => handleBulkApproval('reject')}
                disabled={isLoading}
              >
                <X size={16} />
                ปฏิเสธทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Requests List */}
      <div className={styles.requestsList}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>กำลังประมวลผล...</p>
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>ไม่มีคำขอ</h3>
            <p>ไม่มีคำขอในสถานะนี้ในขณะนี้</p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const priorityInfo = getPriorityDisplay(request.priority)
            const timeInfo = getTimeUntilStart(request.startDate)
            const isSelected = selectedItems.includes(request.id)
            const canSelect = request.status === 'PENDING'

            return (
              <div
                key={request.id}
                className={`${styles.requestCard} ${styles[priorityInfo.class]} ${isSelected ? styles.selected : ''}`}
              >
                <div className={styles.requestHeader}>
                  <div className={styles.requestMeta}>
                    {canSelect && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(request.id)}
                        className={styles.checkbox}
                      />
                    )}
                    <div className={styles.requestInfo}>
                      <div className={styles.bookingNo}>{request.bookingNo}</div>
                      <div className={styles.requestTime}>
                        {getWaitingTime(request.requestedAt)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.requestPriority}>
                    <span className={`${styles.priorityBadge} ${styles[priorityInfo.class]}`}>
                      {priorityInfo.text}
                    </span>
                    <span className={`${styles.timeBadge} ${styles[timeInfo.class]}`}>
                      {timeInfo.text}
                    </span>
                  </div>
                </div>

                <div className={styles.requestBody}>
                  <div className={styles.requestDetails}>
                    {/* User Info */}
                    <div className={styles.userSection}>
                      <div className={styles.sectionIcon}>
                        <User size={18} />
                      </div>
                      <div className={styles.sectionContent}>
                        <div className={styles.userName}>
                          {request.user.firstName} {request.user.lastName}
                        </div>
                        <div className={styles.userMeta}>
                          {request.user.position} • {request.user.department}
                        </div>
                        <div className={styles.userContact}>
                          📧 {request.user.email} • 📞 {request.user.phone}
                        </div>
                      </div>
                    </div>

                    {/* Equipment Info */}
                    <div className={styles.equipmentSection}>
                      <div className={styles.sectionIcon}>
                        <Package size={18} />
                      </div>
                      <div className={styles.sectionContent}>
                        <div className={styles.equipmentName}>
                          <span className={styles.categoryIcon}>
                            {request.equipment.category.icon}
                          </span>
                          {request.equipment.name}
                        </div>
                        <div className={styles.equipmentMeta}>
                          รหัส: {request.equipment.code}
                        </div>
                        <div className={styles.equipmentLocation}>
                          <MapPin size={14} />
                          {request.equipment.location.name}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className={styles.bookingSection}>
                      <div className={styles.sectionIcon}>
                        <Calendar size={18} />
                      </div>
                      <div className={styles.sectionContent}>
                        <div className={styles.bookingDate}>
                          {new Date(request.startDate).toLocaleDateString('th-TH')} 
                          {request.startDate !== request.endDate && 
                            ` - ${new Date(request.endDate).toLocaleDateString('th-TH')}`
                          }
                        </div>
                        <div className={styles.bookingTime}>
                          {request.startTime} - {request.endTime} น.
                        </div>
                        <div className={styles.bookingPurpose}>
                          <MessageSquare size={14} />
                          {request.purpose}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {request.status === 'PENDING' && (
                    <div className={styles.requestActions}>
                      <button
                        className={`${styles.actionButton} ${styles.approve}`}
                        onClick={() => openApprovalModal(request, 'approve')}
                        disabled={isLoading}
                      >
                        <Check size={16} />
                        อนุมัติ
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.reject}`}
                        onClick={() => openApprovalModal(request, 'reject')}
                        disabled={isLoading}
                      >
                        <X size={16} />
                        ปฏิเสธ
                      </button>
                      <button className={`${styles.actionButton} ${styles.info}`}>
                        <Eye size={16} />
                        ดูรายละเอียด
                      </button>
                    </div>
                  )}

                  {/* Status Display */}
                  {request.status !== 'PENDING' && (
                    <div className={styles.statusDisplay}>
                      {request.status === 'APPROVED' ? (
                        <div className={styles.approvedStatus}>
                          <CheckCircle size={20} />
                          <div>
                            <div>อนุมัติแล้ว</div>
                            <div className={styles.statusTime}>
                              {request.approvedAt && new Date(request.approvedAt).toLocaleString('th-TH')}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.rejectedStatus}>
                          <XCircle size={20} />
                          <div>
                            <div>ปฏิเสธแล้ว</div>
                            <div className={styles.statusTime}>
                              {request.rejectedAt && new Date(request.rejectedAt).toLocaleString('th-TH')}
                            </div>
                            {request.rejectionReason && (
                              <div className={styles.rejectionReason}>
                                เหตุผล: {request.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Approval Modal */}
      {approvalModal.show && approvalModal.request && (
        <div className={styles.modalOverlay} onClick={closeApprovalModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {approvalModal.action === 'approve' ? '✅ อนุมัติคำขอ' : '❌ ปฏิเสธคำขอ'}
              </h3>
              <button className={styles.closeButton} onClick={closeApprovalModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.confirmationText}>
                คุณต้องการ{approvalModal.action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}คำขอยืม
                <strong>{approvalModal.request.equipment.name}</strong> 
                จาก <strong>{approvalModal.request.user.firstName} {approvalModal.request.user.lastName}</strong> 
                หรือไม่?
              </div>

              {approvalModal.action === 'reject' && (
                <div className={styles.rejectionForm}>
                  <label htmlFor="rejectionReason">เหตุผลในการปฏิเสธ:</label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="กรุณาระบุเหตุผลในการปฏิเสธ..."
                    className={styles.rejectionTextarea}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeApprovalModal}>
                ยกเลิก
              </button>
              <button
                className={`${styles.confirmButton} ${
                  approvalModal.action === 'approve' ? styles.approve : styles.reject
                }`}
                onClick={handleApproval}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังประมวลผล...' : 
                 approvalModal.action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Select All for Pending */}
      {selectedStatus === 'PENDING' && filteredRequests.length > 0 && (
        <div className={styles.quickActions}>
          <button
            className={styles.selectAllButton}
            onClick={handleSelectAll}
          >
            {selectedItems.length === filteredRequests.length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
          </button>
        </div>
      )}
    </div>
  )
}