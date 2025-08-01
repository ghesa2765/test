// utils/fineCalculation.ts

export interface FineRule {
  id: string
  name: string
  description: string
  amount: number
  timeUnit: 'minute' | 'hour' | 'day' | 'week'
  type: 'fixed' | 'time-based' | 'percentage'
  category: 'overdue' | 'damage' | 'lost' | 'misuse'
  gracePeriod: number
  gracePeriodUnit: 'minute' | 'hour' | 'day'
  maxAmount: number
  isActive: boolean
  applyToWeekends: boolean
  studentDiscount: number
}

export interface FineCalculationSettings {
  businessHoursOnly: boolean
  businessStart: string // HH:mm format
  businessEnd: string
  excludeWeekends: boolean
  excludeHolidays: boolean
  holidays: string[] // YYYY-MM-DD format
}

export interface FineCalculationResult {
  totalFine: number
  breakdown: {
    overdueTime: number
    overdueUnit: string
    graceTime: number
    chargeableTime: number
    baseAmount: number
    studentDiscount: number
    discountAmount: number
    finalAmount: number
    cappedAtMax: boolean
  }
  details: string[]
}

// แปลงหน่วยเวลาเป็นมิลลิวินาที
export const timeUnitToMs = (unit: string): number => {
  switch (unit) {
    case 'minute': return 60 * 1000
    case 'hour': return 60 * 60 * 1000
    case 'day': return 24 * 60 * 60 * 1000
    case 'week': return 7 * 24 * 60 * 60 * 1000
    default: return 0
  }
}

// ตรวจสอบว่าเป็นวันหยุดสุดสัปดาห์หรือไม่
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

// ตรวจสอบว่าเป็นวันหยุดนักขัตฤกษ์หรือไม่
export const isHoliday = (date: Date, holidays: string[]): boolean => {
  const dateStr = date.toISOString().split('T')[0]
  return holidays.includes(dateStr)
}

// ตรวจสอบว่าอยู่ในเวลาทำการหรือไม่
export const isBusinessHour = (date: Date, businessStart: string, businessEnd: string): boolean => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const currentTime = hours * 60 + minutes
  
  const [startHour, startMin] = businessStart.split(':').map(Number)
  const [endHour, endMin] = businessEnd.split(':').map(Number)
  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin
  
  return currentTime >= startTime && currentTime <= endTime
}

// คำนวณเวลาที่สามารถคิดค่าปรับได้ (ตัดเวลาที่ไม่ทำการออก)
export const calculateChargeableTime = (
  startDate: Date,
  endDate: Date,
  settings: FineCalculationSettings
): number => {
  let chargeableMs = 0
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current < end) {
    const nextHour = new Date(current)
    nextHour.setHours(current.getHours() + 1, 0, 0, 0)
    const segmentEnd = nextHour > end ? end : nextHour
    
    const shouldCount = 
      (!settings.excludeWeekends || !isWeekend(current)) &&
      (!settings.excludeHolidays || !isHoliday(current, settings.holidays)) &&
      (!settings.businessHoursOnly || isBusinessHour(current, settings.businessStart, settings.businessEnd))
    
    if (shouldCount) {
      chargeableMs += segmentEnd.getTime() - current.getTime()
    }
    
    current.setTime(nextHour.getTime())
  }
  
  return chargeableMs
}

// คำนวณค่าปรับหลัก
export const calculateFine = (
  dueDate: Date,
  returnDate: Date,
  rule: FineRule,
  settings: FineCalculationSettings,
  isStudent: boolean = false,
  equipmentValue?: number
): FineCalculationResult => {
  const details: string[] = []
  
  // คำนวณเวลาเกิน
  const overdueMs = Math.max(0, returnDate.getTime() - dueDate.getTime())
  const overdueHours = Math.floor(overdueMs / (60 * 60 * 1000))
  const overdueMinutes = Math.floor((overdueMs % (60 * 60 * 1000)) / (60 * 1000))
  
  details.push(`เวลาคืนล่าช้า: ${overdueHours} ชั่วโมง ${overdueMinutes} นาที`)
  
  if (overdueMs === 0) {
    details.push('ไม่มีการคืนล่าช้า - ไม่มีค่าปรับ')
    return {
      totalFine: 0,
      breakdown: {
        overdueTime: 0,
        overdueUnit: rule.timeUnit,
        graceTime: rule.gracePeriod,
        chargeableTime: 0,
        baseAmount: 0,
        studentDiscount: 0,
        discountAmount: 0,
        finalAmount: 0,
        cappedAtMax: false
      },
      details
    }
  }
  
  // คำนวณระยะเวลาให้อภัย
  const graceMs = rule.gracePeriod * timeUnitToMs(rule.gracePeriodUnit)
  const afterGraceMs = Math.max(0, overdueMs - graceMs)
  
  if (rule.gracePeriod > 0) {
    const graceHours = Math.floor(graceMs / (60 * 60 * 1000))
    const graceMinutes = Math.floor((graceMs % (60 * 60 * 1000)) / (60 * 1000))
    details.push(`ระยะเวลาให้อภัย: ${graceHours} ชั่วโมง ${graceMinutes} นาที`)
  }
  
  if (afterGraceMs === 0) {
    details.push('อยู่ในระยะเวลาให้อภัย - ไม่มีค่าปรับ')
    return {
      totalFine: 0,
      breakdown: {
        overdueTime: overdueMs / timeUnitToMs(rule.timeUnit),
        overdueUnit: rule.timeUnit,
        graceTime: rule.gracePeriod,
        chargeableTime: 0,
        baseAmount: 0,
        studentDiscount: 0,
        discountAmount: 0,
        finalAmount: 0,
        cappedAtMax: false
      },
      details
    }
  }
  
  // คำนวณเวลาที่คิดค่าปรับจริง
  const graceEndDate = new Date(dueDate.getTime() + graceMs)
  const chargeableMs = rule.applyToWeekends ? 
    afterGraceMs : 
    calculateChargeableTime(graceEndDate, returnDate, settings)
  
  const chargeableTime = chargeableMs / timeUnitToMs(rule.timeUnit)
  
  // คำนวณค่าปรับตามประเภท
  let baseAmount = 0
  
  switch (rule.type) {
    case 'fixed':
      baseAmount = rule.amount
      details.push(`ค่าปรับแบบคงที่: ${rule.amount.toLocaleString()} บาท`)
      break
      
    case 'time-based':
      const units = Math.ceil(chargeableTime)
      baseAmount = units * rule.amount
      details.push(`${units} ${getTimeUnitName(rule.timeUnit)} × ${rule.amount.toLocaleString()} บาท = ${baseAmount.toLocaleString()} บาท`)
      break
      
    case 'percentage':
      if (!equipmentValue) {
        details.push('ไม่สามารถคำนวณค่าปรับแบบเปอร์เซ็นต์ได้ - ไม่มีมูลค่าอุปกรณ์')
        baseAmount = 0
      } else {
        baseAmount = (equipmentValue * rule.amount) / 100
        details.push(`${rule.amount}% × ${equipmentValue.toLocaleString()} บาท = ${baseAmount.toLocaleString()} บาท`)
      }
      break
  }
  
  // คำนวณส่วนลดนักเรียน
  const studentDiscount = isStudent ? rule.studentDiscount : 0
  const discountAmount = (baseAmount * studentDiscount) / 100
  let finalAmount = baseAmount - discountAmount
  
  if (studentDiscount > 0) {
    details.push(`ส่วนลดนักเรียน ${studentDiscount}%: -${discountAmount.toLocaleString()} บาท`)
  }
  
  // จำกัดที่ค่าปรับสูงสุด
  const cappedAtMax = finalAmount > rule.maxAmount
  if (cappedAtMax) {
    finalAmount = rule.maxAmount
    details.push(`จำกัดที่ค่าปรับสูงสุด: ${rule.maxAmount.toLocaleString()} บาท`)
  }
  
  return {
    totalFine: Math.max(0, finalAmount),
    breakdown: {
      overdueTime: overdueMs / timeUnitToMs(rule.timeUnit),
      overdueUnit: rule.timeUnit,
      graceTime: rule.gracePeriod,
      chargeableTime,
      baseAmount,
      studentDiscount,
      discountAmount,
      finalAmount,
      cappedAtMax
    },
    details
  }
}

// ฟังก์ชันสำหรับแปลงหน่วยเวลาเป็นภาษาไทย
export const getTimeUnitName = (unit: string): string => {
  switch (unit) {
    case 'minute': return 'นาที'
    case 'hour': return 'ชั่วโมง'
    case 'day': return 'วัน'
    case 'week': return 'สัปดาห์'
    default: return unit
  }
}

// ฟังก์ชันสำหรับจัดรูปแบบเวลา
export const formatDuration = (ms: number): string => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  
  const parts = []
  if (days > 0) parts.push(`${days} วัน`)
  if (hours > 0) parts.push(`${hours} ชั่วโมง`)
  if (minutes > 0) parts.push(`${minutes} นาที`)
  
  return parts.join(' ') || '0 นาที'
}

// ฟังก์ชันสำหรับสร้าง Fine Record
export const createFineRecord = (
  userId: string,
  userName: string,
  equipmentId: string,
  equipmentName: string,
  calculation: FineCalculationResult,
  rule: FineRule,
  reason?: string
) => {
  return {
    id: `F${Date.now()}`,
    userId,
    userName,
    equipmentId,
    equipmentName,
    fineAmount: calculation.totalFine,
    fineReason: reason || `คืนอุปกรณ์ล่าช้า (${rule.name})`,
    ruleUsed: rule.id,
    calculation: calculation.breakdown,
    details: calculation.details,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 วันจากวันนี้
    status: 'pending' as const,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: 'system'
  }
}