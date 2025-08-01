// utils/equipment.ts - แก้ไข Type Comparison Error
import { 
  Equipment, 
  FineSettings, 
  BorrowRecord, 
  ExpiryStatus,
  FineCalculation,
  ExpiryNotification,
  DEFAULT_FINE_SETTINGS,
  EXPIRY_WARNING_DAYS,
  calculateExpiryStatus,
  generateMockEquipment,
  generateExpiryNotifications
} from '@/types/equipment'

// Re-export everything from types for backward compatibility
export {
  type Equipment,
  type FineSettings, 
  type BorrowRecord,
  type ExpiryStatus,
  type FineCalculation,
  type ExpiryNotification,
  DEFAULT_FINE_SETTINGS,
  EXPIRY_WARNING_DAYS,
  calculateExpiryStatus,
  generateMockEquipment,
  generateExpiryNotifications
}

// Utility functions
export function calculateFine(
  dueDate: string, 
  returnDate: string, 
  fineSettings: FineSettings = DEFAULT_FINE_SETTINGS
): FineCalculation {
  const due = new Date(dueDate)
  const returned = new Date(returnDate)
  const diffTime = returned.getTime() - due.getTime()
  
  if (diffTime <= 0) {
    return {
      lateDays: 0,
      lateHours: 0,
      baseFine: 0,
      actualFine: 0,
      gracePeriodUsed: false,
      calculation: 'คืนตรงเวลา - ไม่มีค่าปรับ'
    }
  }
  
  const lateHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const lateDays = Math.ceil(lateHours / 24)
  const gracePeriodHours = fineSettings.gracePeriod
  
  if (lateHours <= gracePeriodHours) {
    return {
      lateDays: lateDays,
      lateHours: lateHours,
      baseFine: 0,
      actualFine: 0,
      gracePeriodUsed: true,
      calculation: `คืนช้า ${lateHours} ชั่วโมง - อยู่ในช่วงผ่อนผัน (${gracePeriodHours} ชั่วโมง)`
    }
  }
  
  const effectiveLateHours = lateHours - gracePeriodHours
  let baseFine = 0
  let calculation = ''
  
  if (fineSettings.unit === 'day') {
    const effectiveLateDays = Math.ceil(effectiveLateHours / 24)
    baseFine = effectiveLateDays * fineSettings.finePerDay
    calculation = `${effectiveLateDays} วัน × ${fineSettings.finePerDay} บาท = ${baseFine} บาท`
  } else {
    baseFine = effectiveLateHours * (fineSettings.finePerHour || 1)
    calculation = `${effectiveLateHours} ชั่วโมง × ${fineSettings.finePerHour} บาท = ${baseFine} บาท`
  }
  
  const actualFine = fineSettings.maxFine 
    ? Math.min(baseFine, fineSettings.maxFine)
    : baseFine
    
  if (fineSettings.maxFine && baseFine > fineSettings.maxFine) {
    calculation += ` (จำกัดที่ ${fineSettings.maxFine} บาท)`
  }
  
  return {
    lateDays,
    lateHours,
    baseFine,
    maxFine: fineSettings.maxFine,
    actualFine,
    gracePeriodUsed: false,
    calculation
  }
}

export function canBorrowEquipment(equipment: Equipment): {
  canBorrow: boolean
  reason?: string
  availableQuantity: number
} {
  if (equipment.expiryDate) {
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    if (typeof expiryStatus === 'object' && expiryStatus.isExpired) {
      return {
        canBorrow: false,
        reason: 'อุปกรณ์หมดอายุการใช้งานแล้ว',
        availableQuantity: 0
      }
    }
  }
  
  const availableQuantity = equipment.availableQuantity || 
    (equipment.status === 'available' ? 1 : 0)
  
  if (availableQuantity <= 0) {
    return {
      canBorrow: false,
      reason: 'อุปกรณ์ไม่มีให้ยืม',
      availableQuantity: 0
    }
  }
  
  if (equipment.status === 'damaged') {
    return {
      canBorrow: false,
      reason: 'อุปกรณ์เสียหาย',
      availableQuantity: 0
    }
  }
  
  if (equipment.status === 'maintenance') {
    return {
      canBorrow: false,
      reason: 'อุปกรณ์อยู่ระหว่างการซ่อมบำรุง',
      availableQuantity: 0
    }
  }
  
  return {
    canBorrow: true,
    availableQuantity: availableQuantity
  }
}

export function calculateEquipmentQuantities(equipment: Equipment) {
  const total = equipment.totalQuantity || 1
  const available = equipment.availableQuantity || 
    (equipment.status === 'available' ? 1 : 0)
  const borrowed = equipment.borrowedQuantity || 
    (equipment.status === 'borrowed' ? 1 : 0)
  const maintenance = equipment.maintenanceQuantity || 
    (equipment.status === 'maintenance' ? 1 : 0)
  const damaged = equipment.damagedQuantity || 
    (equipment.status === 'damaged' ? 1 : 0)
  
  const calculated = available + borrowed + maintenance + damaged
  if (calculated !== total && total > 1) {
    console.warn(`Equipment ${equipment.id} quantity mismatch: ${calculated} !== ${total}`)
  }
  
  return {
    total,
    available,
    borrowed,
    maintenance,
    damaged,
    utilizationRate: total > 0 ? (borrowed / total) * 100 : 0,
    availabilityRate: total > 0 ? (available / total) * 100 : 0
  }
}

export function calculateLateFee(
  dueDate: string, 
  returnDate: string, 
  fineSettings: FineSettings = DEFAULT_FINE_SETTINGS
): number {
  const due = new Date(dueDate)
  const returned = new Date(returnDate)
  
  const diffTime = returned.getTime() - due.getTime() 
  const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (daysLate <= 0) return 0
  
  const gracePeriodDays = Math.ceil(fineSettings.gracePeriod / 24)
  if (daysLate <= gracePeriodDays) return 0
  
  const actualLateDays = daysLate - gracePeriodDays
  const calculatedFine = actualLateDays * fineSettings.finePerDay
  
  return fineSettings.maxFine 
    ? Math.min(calculatedFine, fineSettings.maxFine)
    : calculatedFine
}

export function getEquipmentStatusColor(status: Equipment['status']): string {
  const statusColors = {
    'available': '#4caf50',
    'borrowed': '#ff9800', 
    'maintenance': '#f44336',
    'damaged': '#9e9e9e'
  }
  return statusColors[status] || '#757575'
}

export function getConditionIcon(condition?: Equipment['condition']): string {
  if (!condition) return '⚪'
  
  const conditionIcons = {
    'EXCELLENT': '🟢',
    'GOOD': '🔵', 
    'FAIR': '🟡',
    'POOR': '🟠',
    'DAMAGED': '🔴'
  }
  return conditionIcons[condition] || '⚪'
}

export function filterEquipmentByCategory(equipment: Equipment[], category: string): Equipment[] {
  if (category === 'ทั้งหมด' || !category) {
    return equipment
  }
  return equipment.filter(item => item.category === category)
}

export function filterEquipmentByStatus(equipment: Equipment[], status: string): Equipment[] {
  if (status === 'ทั้งหมด' || !status) {
    return equipment
  }
  return equipment.filter(item => item.status === status)
}

export function searchEquipment(equipment: Equipment[], searchTerm: string): Equipment[] {
  if (!searchTerm.trim()) {
    return equipment
  }
  
  const term = searchTerm.toLowerCase()
  return equipment.filter(item =>
    item.name.toLowerCase().includes(term) ||
    (item.code && item.code.toLowerCase().includes(term)) ||
    item.category.toLowerCase().includes(term) ||
    item.location.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term)
  )
}

export function sortEquipment(equipment: Equipment[], field: keyof Equipment, direction: 'asc' | 'desc' = 'asc'): Equipment[] {
  return [...equipment].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]
    
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return direction === 'asc' ? -1 : 1
    if (bValue == null) return direction === 'asc' ? 1 : -1
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return direction === 'asc' ? comparison : -comparison
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function calculateEquipmentStats(equipment: Equipment[]) {
  const total = equipment.length
  const available = equipment.filter(e => e.status === 'available').length
  const borrowed = equipment.filter(e => e.status === 'borrowed').length
  const maintenance = equipment.filter(e => e.status === 'maintenance').length
  const damaged = equipment.filter(e => e.status === 'damaged').length
  
  return {
    total,
    available,
    borrowed,
    maintenance,
    damaged,
    utilizationRate: total > 0 ? ((borrowed / total) * 100).toFixed(1) : '0'
  }
}

export function validateEquipmentData(data: Partial<Equipment>): string[] {
  const errors: string[] = []
  
  if (!data.name?.trim()) {
    errors.push('ชื่ออุปกรณ์จำเป็นต้องระบุ')
  }
  
  if (!data.code?.trim()) {
    errors.push('รหัสอุปกรณ์จำเป็นต้องระบุ')
  }
  
  if (!data.category?.trim()) {
    errors.push('หมวดหมู่จำเป็นต้องระบุ')
  }
  
  if (!data.location?.trim()) {
    errors.push('สถานที่จำเป็นต้องระบุ')
  }
  
  return errors
}

export function createMockBorrowRecord(equipmentId: string): BorrowRecord {
  const borrowDate = new Date()
  const dueDate = new Date()
  dueDate.setDate(borrowDate.getDate() + 7)
  
  return {
    id: `BR${Date.now()}`,
    equipmentId,
    userId: 'USER001',
    borrowDate: borrowDate.toISOString(),
    dueDate: dueDate.toISOString(),
    status: 'PENDING',
    purpose: 'การใช้งานทั่วไป',
    createdAt: new Date().toISOString()
  }
}

// ✅ แก้ไข type comparison error - กรองเฉพาะ status ที่ valid
export function getOverdueEquipment(borrowRecords: BorrowRecord[]): BorrowRecord[] {
  const now = new Date()
  return borrowRecords.filter(record => {
    // ✅ Fix: ใช้ status ที่ valid เท่านั้น
    const validBorrowedStatuses: BorrowRecord['status'][] = ['BORROWED', 'active']
    return validBorrowedStatuses.includes(record.status) && 
           new Date(record.dueDate) < now
  })
}

export function calculatePriorityScore(equipment: Equipment): number {
  let score = 0
  
  switch (equipment.status) {
    case 'damaged': score += 100; break
    case 'maintenance': score += 75; break
    case 'borrowed': score += 25; break
    case 'available': score += 0; break
  }
  
  if (equipment.condition) {
    switch (equipment.condition) {
      case 'DAMAGED': score += 50; break
      case 'POOR': score += 40; break
      case 'FAIR': score += 20; break
      case 'GOOD': score += 10; break
      case 'EXCELLENT': score += 0; break
    }
  }
  
  const totalBorrows = equipment.totalBorrows || equipment.borrowCount || 0
  score += Math.min(totalBorrows * 0.1, 20)
  
  return score
}

export function generateMockBorrowRecords(): BorrowRecord[] {
  return [
    {
      id: 'BR001',
      equipmentId: 'EQ001',
      equipmentName: 'ไม้ค้ำยัน (คู่)',
      equipmentModel: 'CR001',
      userId: 'USR001',
      userName: 'นิคม ใจดี',
      borrowDate: '2025-01-15T09:00:00Z',
      dueDate: '2025-01-22T17:00:00Z',
      returnDate: '2025-01-25T10:30:00Z',
      isOverdue: true,
      lateDays: 3,
      lateHours: 65,
      fineAmount: 30,
      isPaid: false,
      status: 'returned',
      purpose: 'ใช้ฝึกการเดินหลังผ่าตัด',
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-25T10:30:00Z'
    },
    {
      id: 'BR002',
      equipmentId: 'EQ002',
      equipmentName: 'เครื่องวัดความดัน',
      equipmentModel: 'BP001',
      userId: 'USR002',
      userName: 'สมหญิง เก่งมาก',
      borrowDate: '2025-01-20T14:00:00Z',
      dueDate: '2025-01-27T17:00:00Z',
      isOverdue: true,
      lateDays: 4,
      lateHours: 96,
      fineAmount: 40,
      isPaid: false,
      status: 'overdue',
      purpose: 'ตรวจวัดความดันผู้ป่วยที่บ้าน',
      createdAt: '2025-01-20T14:00:00Z',
      updatedAt: '2025-01-31T08:00:00Z'
    }
  ]
}

// Formatting utilities
export function formatDate(dateString: string, options?: {
  includeTime?: boolean
  locale?: string
}): string {
  const date = new Date(dateString)
  const locale = options?.locale || 'th-TH'
  
  if (options?.includeTime) {
    return date.toLocaleString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatNumber(num: number, options?: {
  currency?: boolean
  decimal?: number
}): string {
  if (options?.currency) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: options.decimal || 0
    }).format(num)
  }
  
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: options?.decimal || 0
  }).format(num)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}