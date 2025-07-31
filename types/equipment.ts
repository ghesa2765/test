// types/equipment.ts (ไฟล์ใหม่)
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
  
  // ✨ ฟีเจอร์ใหม่: วันหมดอายุการใช้งาน
  purchaseDate: string        // วันที่ซื้อ
  warrantyPeriod: number      // ระยะเวลารับประกัน (ปี)
  lifespan: number           // อายุการใช้งาน (ปี) 
  expiryDate: string         // วันหมดอายุการใช้งาน
  isNearExpiry?: boolean     // เกือบหมดอายุ (เหลือ < 30 วัน)
  isExpired?: boolean        // หมดอายุแล้ว
  
  // ✨ ฟีเจอร์ใหม่: จำนวนอุปกรณ์
  totalQuantity: number      // จำนวนทั้งหมด
  availableQuantity: number  // จำนวนที่ยืมได้
  borrowedQuantity: number   // จำนวนที่ถูกยืม
  maintenanceQuantity: number // จำนวนที่อยู่ระหว่างซ่อม
  damagedQuantity: number    // จำนวนที่เสียหาย
  
  // ข้อมูลการยืมปัจจุบัน (ถ้ามี)
  borrowedBy?: string
  dueDate?: string
  maintenanceNote?: string
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
}

// ✨ ฟีเจอร์ใหม่: Interface สำหรับการคำนวณค่าปรับ
export interface BorrowRecord {
  id: string
  equipmentId: string
  equipmentName: string
  userId: string
  userName: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  isOverdue: boolean
  lateDays: number
  lateHours: number
  fineAmount: number         // ค่าปรับที่คำนวณได้
  isPaid: boolean           // จ่ายค่าปรับแล้วหรือยัง
  status: 'active' | 'returned' | 'overdue'
}