// utils/equipment.ts
import { 
  Equipment, 
  FineSettings, 
  BorrowRecord, 
  ExpiryStatus, 
  FineCalculation,
  ExpiryNotification,
  DEFAULT_FINE_SETTINGS,
  EXPIRY_WARNING_DAYS 
} from '@/types/equipment'

// ✨ ฟังก์ชันคำนวณสถานะหมดอายุ
export function calculateExpiryStatus(expiryDate: string): ExpiryStatus {
  const expiry = new Date(expiryDate)
  const today = new Date()
  
  // ตั้งเวลาให้เป็น 00:00:00 เพื่อเปรียบเทียบแค่วันที่
  expiry.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffTime = expiry.getTime() - today.getTime()
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  const isExpired = daysUntilExpiry < 0
  const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry <= EXPIRY_WARNING_DAYS
  const canBorrow = !isExpired
  
  let warningMessage: string | undefined
  
  if (isExpired) {
    warningMessage = `หมดอายุการใช้งานแล้ว ${Math.abs(daysUntilExpiry)} วัน`
  } else if (isNearExpiry) {
    warningMessage = `เกือบหมดอายุ อีก ${daysUntilExpiry} วัน`
  }
  
  return {
    isExpired,
    isNearExpiry,
    daysUntilExpiry: Math.abs(daysUntilExpiry),
    canBorrow,
    warningMessage
  }
}

// ✨ ฟังก์ชันคำนวณค่าปรับ
export function calculateFine(
  dueDate: string, 
  returnDate: string, 
  fineSettings: FineSettings = DEFAULT_FINE_SETTINGS
): FineCalculation {
  const due = new Date(dueDate)
  const returned = new Date(returnDate)
  const diffTime = returned.getTime() - due.getTime()
  
  // ถ้าคืนตรงเวลาหรือก่อนกำหนด
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
  
  // ถ้าอยู่ในช่วงผ่อนผัน
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
  
  // คำนวณค่าปรับตามหน่วย
  if (fineSettings.unit === 'day') {
    const effectiveLateDays = Math.ceil(effectiveLateHours / 24)
    baseFine = effectiveLateDays * fineSettings.finePerDay
    calculation = `${effectiveLateDays} วัน × ${fineSettings.finePerDay} บาท = ${baseFine} บาท`
  } else {
    baseFine = effectiveLateHours * (fineSettings.finePerHour || 1)
    calculation = `${effectiveLateHours} ชั่วโมง × ${fineSettings.finePerHour} บาท = ${baseFine} บาท`
  }
  
  // ตรวจสอบค่าปรับสูงสุด
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

// ✨ ฟังก์ชันตรวจสอบว่าสามารถยืมได้หรือไม่
export function canBorrowEquipment(equipment: Equipment): {
  canBorrow: boolean
  reason?: string
  availableQuantity: number
} {
  // ตรวจสอบหมดอายุ
  const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
  if (expiryStatus.isExpired) {
    return {
      canBorrow: false,
      reason: 'อุปกรณ์หมดอายุการใช้งานแล้ว',
      availableQuantity: 0
    }
  }
  
  // ตรวจสอบจำนวนที่มี
  if (equipment.availableQuantity <= 0) {
    return {
      canBorrow: false,
      reason: 'อุปกรณ์ไม่มีให้ยืม',
      availableQuantity: 0
    }
  }
  
  // ตรวจสอบสถานะอุปกรณ์
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
    availableQuantity: equipment.availableQuantity
  }
}

// ✨ ฟังก์ชันสร้างการแจ้งเตือนหมดอายุ
export function generateExpiryNotifications(equipmentList: Equipment[]): ExpiryNotification[] {
  const notifications: ExpiryNotification[] = []
  const today = new Date()
  
  equipmentList.forEach(equipment => {
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    
    // สร้างการแจ้งเตือนสำหรับอุปกรณ์ที่หมดอายุหรือเกือบหมดอายุ
    if (expiryStatus.isExpired || expiryStatus.isNearExpiry) {
      let priority: 'high' | 'medium' | 'low' = 'low'
      
      if (expiryStatus.isExpired) {
        priority = 'high'
      } else if (expiryStatus.daysUntilExpiry <= 7) {
        priority = 'high'
      } else if (expiryStatus.daysUntilExpiry <= 14) {
        priority = 'medium'
      }
      
      notifications.push({
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        equipmentModel: equipment.model,
        category: equipment.category,
        location: equipment.location,
        expiryDate: equipment.expiryDate,
        daysUntilExpiry: expiryStatus.isExpired ? -expiryStatus.daysUntilExpiry : expiryStatus.daysUntilExpiry,
        isExpired: expiryStatus.isExpired,
        isNearExpiry: expiryStatus.isNearExpiry,
        totalQuantity: equipment.totalQuantity,
        affectedQuantity: equipment.totalQuantity, // ทั้งหมดได้รับผลกระทบ
        priority,
        notifiedAt: today.toISOString(),
        isRead: false
      })
    }
  })
  
  // เรียงตามความสำคัญและวันหมดอายุ
  return notifications.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return a.daysUntilExpiry - b.daysUntilExpiry
  })
}

// ✨ ฟังก์ชันคำนวณจำนวนอุปกรณ์ตามสถานะ
export function calculateEquipmentQuantities(equipment: Equipment) {
  const total = equipment.totalQuantity
  const available = equipment.availableQuantity
  const borrowed = equipment.borrowedQuantity
  const maintenance = equipment.maintenanceQuantity
  const damaged = equipment.damagedQuantity
  
  // ตรวจสอบความถูกต้องของข้อมูล
  const calculated = available + borrowed + maintenance + damaged
  if (calculated !== total) {
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

// ✨ ฟังก์ชันสร้าง mock data สำหรับทดสอบ
export function generateMockEquipment(): Equipment[] {
  const baseDate = new Date()
  
  return [
    {
      id: 'EQ001',
      name: 'ไม้ค้ำยัน (คู่)',
      category: 'อุปกรณ์ช่วยเหลือ',
      model: 'CR001',
      serialNumber: 'CR001234',
      location: 'ห้องเก็บอุปกรณ์ A',
      status: 'available',
      description: 'ไม้ค้ายันสำหรับผู้ป่วยที่มีปัญหาการเดิน ปรับระดับความสูงได้',
      rating: 4.8,
      borrowCount: 156,
      image: '/equipment/crutches.jpg',
      
      // วันหมดอายุ
      purchaseDate: '2020-01-15',
      warrantyPeriod: 2,
      lifespan: 5,
      expiryDate: '2025-01-15',
      
      // จำนวนอุปกรณ์
      totalQuantity: 10,
      availableQuantity: 7,
      borrowedQuantity: 2,
      maintenanceQuantity: 1,
      damagedQuantity: 0,
      
      specifications: {
        material: 'อลูมิเนียม',
        adjustable: 'ปรับได้ 10 ระดับ',
        weight: '1.2 กก./คู่'
      },
      
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'EQ002',
      name: 'เครื่องวัดความดัน',
      category: 'อุปกรณ์ตรวจวัด',
      model: 'BP001',
      serialNumber: 'BP001789',
      location: 'ห้องตรวจทั่วไป',
      status: 'available',
      description: 'เครื่องวัดความดันโลหิตแบบดิจิทัล แม่นยำสูง',
      rating: 4.9,
      borrowCount: 423,
      image: '/equipment/blood-pressure.jpg',
      
      // วันหมดอายุ - เกือบหมดอายุ
      purchaseDate: '2020-02-01',
      warrantyPeriod: 3,
      lifespan: 5,
      expiryDate: '2025-02-01',
      isNearExpiry: true,
      
      // จำนวนอุปกรณ์
      totalQuantity: 5,
      availableQuantity: 3,
      borrowedQuantity: 1,
      maintenanceQuantity: 0,
      damagedQuantity: 1,
      
      specifications: {
        accuracy: '±3 mmHg',
        memory: '90 ครั้ง',
        cuffSize: '22-42 cm'
      },
      
      createdAt: '2020-02-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'EQ003',
      name: 'เครื่องกระตุกหัวใจไฟฟ้า',
      category: 'อุปกรณ์การแพทย์',
      model: 'AED001',
      serialNumber: 'AED001890',
      location: 'ห้องฉุกเฉิน',
      status: 'available',
      description: 'เครื่องกระตุกหัวใจไฟฟ้าอัตโนมัติ สำหรับการช่วยชีวิตฉุกเฉิน',
      rating: 5.0,
      borrowCount: 23,
      image: '/equipment/aed.jpg',
      
      // วันหมดอายุ - หมดอายุแล้ว
      purchaseDate: '2019-01-20',
      warrantyPeriod: 5,
      lifespan: 5,
      expiryDate: '2024-01-20',
      isExpired: true,
      
      // จำนวนอุปกรณ์
      totalQuantity: 2,
      availableQuantity: 0, // ไม่มีให้ยืมเพราะหมดอายุ
      borrowedQuantity: 0,
      maintenanceQuantity: 0,
      damagedQuantity: 0,
      
      specifications: {
        type: 'AED อัตโนมัติ',
        energy: '150-200 Joules',
        battery: 'Lithium 5 ปี'
      },
      
      createdAt: '2019-01-20T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  ]
}

// ✨ ฟังก์ชันสร้าง mock borrow records
export function generateMockBorrowRecords(): BorrowRecord[] {
  const fineSettings = DEFAULT_FINE_SETTINGS
  
  return [
    {
      id: 'BR001',
      equipmentId: 'EQ001',
      equipmentName: 'ไม้ค้ำยัน (คู่)',
      equipmentModel: 'CR001',
      equipmentCategory: 'อุปกรณ์ช่วยเหลือ',
      userId: 'USR001',
      userName: 'นิคม ใจดี',
      userEmail: 'nikhom@example.com',
      borrowDate: '2025-01-15T09:00:00Z',
      dueDate: '2025-01-22T17:00:00Z',
      returnDate: '2025-01-25T10:30:00Z', // คืนช้า 3 วัน
      
      // คำนวณค่าปรับ
      isOverdue: true,
      lateDays: 3,
      lateHours: 65, // ประมาณ 3 วัน
      fineAmount: 30, // 3 วัน × 10 บาท
      isPaid: false,
      
      status: 'returned',
      purpose: 'ใช้ฝึกการเดินหลังผ่าตัด',
      location: 'ห้องกายภาพบำบัด',
      rating: 4,
      feedback: 'อุปกรณ์ใช้งานดี ช่วยฝึกเดินได้ดี',
      
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-25T10:30:00Z'
    },
    {
      id: 'BR002',
      equipmentId: 'EQ002',
      equipmentName: 'เครื่องวัดความดัน',
      equipmentModel: 'BP001',
      equipmentCategory: 'อุปกรณ์ตรวจวัด',
      userId: 'USR002',
      userName: 'สมหญิง เก่งมาก',
      userEmail: 'somying@example.com',
      borrowDate: '2025-01-20T14:00:00Z',
      dueDate: '2025-01-27T17:00:00Z',
      
      // ยังไม่คืน - เกินกำหนด
      isOverdue: true,
      lateDays: 4,
      lateHours: 96,
      fineAmount: 40, // 4 วัน × 10 บาท
      isPaid: false,
      
      status: 'overdue',
      purpose: 'ตรวจวัดความดันผู้ป่วยที่บ้าน',
      location: 'บ้านผู้ป่วย',
      
      createdAt: '2025-01-20T14:00:00Z',
      updatedAt: '2025-01-31T08:00:00Z'
    }
  ]
}

// ✨ ฟังก์ชันจัดรูปแบบวันที่
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

// ✨ ฟังก์ชันจัดรูปแบบตัวเลข
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

// ✨ ฟังก์ชันสำหรับการ debounce search
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