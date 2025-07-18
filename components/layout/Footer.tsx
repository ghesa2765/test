// components/layout/Footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/components/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <div className={styles.footerLogoIcon}>
            <Image
              src="/logo.png"
              alt="RSU Medical Clinic Logo"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.footerLogoText}>
            <div className={styles.footerLogoTextThai}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</div>
            <div className={styles.footerLogoTextEn}>RSU MEDICAL CLINIC</div>
          </div>
        </div>
        
        <div className={styles.footerSections}>
          <div className={styles.footerSection}>
            <h4>ติดต่อเรา</h4>
            <p>📞 02-997-2200 ต่อ 2130</p>
            <p>📧 medical@rsu.ac.th</p>
            <p>📍 ตึกเวชกรรม ชั้น 1 มหาวิทยาลัยรังสิต</p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>เวลาให้บริการ</h4>
            <p>จันทร์ - ศุกร์: 08:00 - 17:00 น.</p>
            <p>เสาร์: 08:00 - 12:00 น.</p>
            <p>อาทิตย์และวันหยุด: ปิดให้บริการ</p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>ลิงก์ด่วน</h4>
            <ul>
              <li><a href="/user/dashboard">หน้าหลัก</a></li>
              <li><a href="/user/borrow">ยืมอุปกรณ์</a></li>
              <li><a href="/user/smart-booking">จองล่วงหน้า</a></li>
              <li><a href="/user/search">ค้นหาอุปกรณ์</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© 2025 มหาวิทยาลัยรังสิต - สงวนลิขสิทธิ์</p>
      </div>
    </footer>
  )
}