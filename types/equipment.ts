// types/equipment.ts - รวมโค้ดเก่าและใหม่
export interface Equipment {
  id: string
  name: string
  category: string
  model: string
  serialNumber: string
  location: string
  status: 'available' | 'borrowed' | 'maintenance' | 'damaged'
  description: string
  rating: number
  borrowCount: number
  image?: string
  specifications?: Record<string, string>
  
  // ✅ เพิ่มฟิลด์ที่ขาดหายไปสำหรับแก้ไข error
  createdAt: string        // ✅ แก้ไข error: createdAt does not exist
  updatedAt?: string
  addedDate?: string       // Alias สำหรับ compatibility
  lastMaintenance?: string
  
  // ✨ ฟีเจอร์ใหม่: วันหมดอายุการใช้งาน
  purchaseDate?: string        // วันที่ซื้อ
  warrantyPeriod?: number      // ระยะเวลารับประกัน (ปี)
  lifespan?: number           // อายุการใช้งาน (ปี) 
  expiryDate?: string         // วันหมดอายุการใช้งาน
  isNearExpiry?: boolean     // เกือบหมดอายุ (เหลือ < 30 วัน)
  isExpired?: boolean        // หมดอายุแล้ว
  
  // ✨ ฟีเจอร์ใหม่: จำนวนอุปกรณ์
  totalQuantity?: number      // จำนวนทั้งหมด
  availableQuantity?: number  // จำนวนที่ยืมได้
  borrowedQuantity?: number   // จำนวนที่ถูกยืม
  maintenanceQuantity?: number // จำนวนที่อยู่ระหว่างซ่อม
  damagedQuantity?: number    // จำนวนที่เสียหาย
  
  // ข้อมูลการยืมปัจจุบัน (ถ้ามี)
  borrowedBy?: string
  dueDate?: string
  maintenanceNote?: string
  maintenanceUntil?: string
  
  // เพิ่มเติมสำหรับ compatibility กับโค้ดเดิม
  totalBorrows?: number      // Alias สำหรับ borrowCount
  code?: string             // รหัสอุปกรณ์
  condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  lastBorrow?: {            // ข้อมูลการยืมล่าสุด
    user: string
    date: string
  }
}

// ✨ ฟีเจอร์ใหม่: Interface สำหรับค่าปรับ
export interface FineSettings {
  id: string
  finePerDay: number         // ค่าปรับต่อวัน (บาท)
  finePerHour?: number       // ค่าปรับต่อชั่วโมง (บาท) - อนาคต
  unit: 'day' | 'hour'       // หน่วยคิดค่าปรับ
  maxFine?: number           // ค่าปรับสูงสุด
  gracePeriod: number        // ช่วงเวลาผ่อนผัน (ชั่วโมง)
  isActive: boolean
  updatedBy: string
  updatedAt: string
  
  // เพิ่มสำหรับ compatibility
  baseAmount?: number        // Alias สำหรับ finePerDay
  perDayAmount?: number      // Alias สำหรับ finePerDay
  gracePeriodDays?: number   // Alias สำหรับ gracePeriod (แปลงเป็นวัน)
}

// ✨ ฟีเจอร์ใหม่: Interface สำหรับการคำนวณค่าปรับ
export interface BorrowRecord {
  id: string
  equipmentId: string        // ✅ แก้ไข error: ใช้ equipmentId แทน equipmentModel
  equipmentName?: string
  equipmentModel?: string    // เก็บไว้สำหรับ compatibility แต่ไม่ rely on มัน
  userId: string
  userName?: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  isOverdue?: boolean
  lateDays?: number
  lateHours?: number
  fineAmount?: number         // ค่าปรับที่คำนวณได้
  isPaid?: boolean           // จ่ายค่าปรับแล้วหรือยัง
  status: 'active' | 'returned' | 'overdue' | 'PENDING' | 'APPROVED' | 'BORROWED' | 'RETURNED' | 'CANCELLED'
  purpose?: string
  notes?: string
  
  // เพิ่มฟิลด์สำหรับ compatibility
  createdAt: string          // ✅ แก้ไข error
  updatedAt?: string
  userEmail?: string
  equipmentCategory?: string
  location?: string
  rating?: number
  feedback?: string
  borrowDuration?: number | null
  lateReturn?: boolean
  condition?: string
  approvalDate?: string
  approvedBy?: string
  returnCondition?: string
  lateFee?: number
}

// ✅ เพิ่ม exports ที่ขาดหายไป - แก้ไข import errors
export type ExpiryStatus = {
  isExpired: boolean
  isNearExpiry: boolean
  daysUntilExpiry: number
  canBorrow: boolean
  warningMessage?: string
} | 'VALID' | 'WARNING' | 'EXPIRED' | 'CRITICAL'

export interface FineCalculation {
  lateDays: number
  lateHours: number
  baseFine: number
  actualFine: number
  maxFine?: number
  gracePeriodUsed: boolean
  calculation: string
}

export interface ExpiryNotification {
  id?: string
  equipmentId: string
  equipmentName: string
  equipmentModel?: string
  category?: string
  location?: string
  expiryDate: string
  daysUntilExpiry: number
  isExpired: boolean
  isNearExpiry: boolean
  totalQuantity?: number
  affectedQuantity?: number
  priority: 'high' | 'medium' | 'low'
  notifiedAt?: string
  notificationSent?: boolean
  isRead?: boolean
  createdAt?: string
}

// ✅ เพิ่ม constants ที่ขาดหายไป
export const DEFAULT_FINE_SETTINGS: FineSettings = {
  id: 'default',
  finePerDay: 10,
  finePerHour: 1,
  unit: 'day',
  maxFine: 1000,
  gracePeriod: 24, // ชั่วโมง
  isActive: true,
  updatedBy: 'system',
  updatedAt: new Date().toISOString(),
  
  // Aliases
  baseAmount: 10,
  perDayAmount: 10,
  gracePeriodDays: 1
}

export const EXPIRY_WARNING_DAYS = {
  critical: 7,
  warning: 30,
  notice: 60
}

// ✅ เพิ่มฟังก์ชันที่ถูก import - แก้ไข import errors
export function calculateExpiryStatus(expiryDate: string): ExpiryStatus {
  if (!expiryDate) {
    return {
      isExpired: false,
      isNearExpiry: false,
      daysUntilExpiry: 999,
      canBorrow: true
    }
  }

  const expiry = new Date(expiryDate)
  const today = new Date()
  
  // ตั้งเวลาให้เป็น 00:00:00 เพื่อเปรียบเทียบแค่วันที่
  expiry.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffTime = expiry.getTime() - today.getTime()
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  const isExpired = daysUntilExpiry < 0
  const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry <= EXPIRY_WARNING_DAYS.warning
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

export function generateMockEquipment(count: number = 5): Equipment[] {
  const mockData: Equipment[] = []
  
  const categories = ['อุปกรณ์ช่วยเหลือ', 'อุปกรณ์ตรวจวัด', 'อุปกรณ์ฝึกอบรม']
  const locations = ['ห้องเก็บอุปกรณ์ A', 'ห้องกายภาพบำบัด', 'ห้องฝึกปฏิบัติ']

  for (let i = 1; i <= count; i++) {
    mockData.push({
      id: `EQ${String(i).padStart(3, '0')}`,
      code: `CODE-${String(i).padStart(3, '0')}`,
      name: `อุปกรณ์ตัวอย่าง ${i}`,
      category: categories[i % categories.length],
      model: `MODEL-${i}`,
      serialNumber: `SN${String(i).padStart(6, '0')}`,
      location: locations[i % locations.length],
      status: i % 4 === 0 ? 'maintenance' : i % 3 === 0 ? 'borrowed' : 'available',
      description: `คำอธิบายสำหรับอุปกรณ์ ${i}`,
      rating: 4 + Math.random(),
      borrowCount: Math.floor(Math.random() * 50),
      totalBorrows: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(), // ✅ Required field
      condition: 'GOOD',
      
      // Optional new features
      purchaseDate: '2020-01-15',
      warrantyPeriod: 2,
      lifespan: 5,
      expiryDate: '2025-01-15',
      totalQuantity: Math.floor(Math.random() * 10) + 1,
      availableQuantity: Math.floor(Math.random() * 5) + 1
    })
  }
  
  return mockData
}

export function generateExpiryNotifications(equipment: Equipment[]): ExpiryNotification[] {
  return equipment
    .filter(eq => eq.expiryDate || eq.warrantyPeriod)
    .map(eq => {
      const expiryDate = eq.expiryDate || new Date().toISOString()
      const status = calculateExpiryStatus(expiryDate)
      
      let priority: 'high' | 'medium' | 'low' = 'low'
      
      if (typeof status === 'object') {
        if (status.isExpired) {
          priority = 'high'
        } else if (status.daysUntilExpiry <= 7) {
          priority = 'high'
        } else if (status.daysUntilExpiry <= 14) {
          priority = 'medium'
        }
      }
      
      return {
        id: `NOTIF-${eq.id}`,
        equipmentId: eq.id,
        equipmentName: eq.name,
        equipmentModel: eq.model,
        category: eq.category,
        location: eq.location,
        expiryDate: expiryDate,
        daysUntilExpiry: typeof status === 'object' ? status.daysUntilExpiry : 0,
        isExpired: typeof status === 'object' ? status.isExpired : false,
        isNearExpiry: typeof status === 'object' ? status.isNearExpiry : false,
        priority,
        notifiedAt: new Date().toISOString(),
        isRead: false,
        createdAt: new Date().toISOString()
      }
    })
}

// ✅ Type aliases สำหรับ compatibility
export type EquipmentCategory = 
  | 'อุปกรณ์ช่วยเหลือ'
  | 'อุปกรณ์ตรวจวัด' 
  | 'อุปกรณ์ฝึกอบรม'
  | 'อุปกรณ์การแพทย์'
  | 'อุปกรณ์บำบัด'

export type EquipmentStatus = Equipment['status']
export type BorrowStatus = BorrowRecord['status']