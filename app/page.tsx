// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, UserCheck, Shield, Calendar, Package } from 'lucide-react'
import Footer from '@/components/layout/Footer'  // ใช้ Footer จาก components/layout
import styles from './page.module.css'

export default function HomePage() {
  const router = useRouter()

  // Auto redirect logic (optional)
  useEffect(() => {
    // ตรวจสอบ session/token ถ้ามี
    const userToken = document.cookie.includes('session=')
    const adminToken = document.cookie.includes('admin_session=')
    
    // Uncomment นี้ถ้าต้องการ auto redirect
    // if (userToken) {
    //   router.push('/user')
    // } else if (adminToken) {
    //   router.push('/admin')
    // }
  }, [router])

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo.png"
                alt="RSU Medical Clinic Logo"
                width={80}
                height={80}
                priority
                className={styles.logo}
              />
              <div className={styles.logoText}>
                <h1 className={styles.title}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</h1>
                <p className={styles.subtitle}>RSU MEDICAL CLINIC</p>
              </div>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <p className={styles.headerDescription}>ระบบยืม-จองอุปกรณ์การแพทย์</p>
            <div className={styles.languageSelector}>
              <button className={`${styles.langBtn} ${styles.active}`}>
                <span className={styles.checkIcon}>✓</span>
                ภาษาไทย
              </button>
              <button className={styles.langBtn}>
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              ยินดีต้อนรับสู่ระบบยืม-จองอุปกรณ์การแพทย์
            </h2>
            <p className={styles.heroSubtitle}>
              ระบบจัดการอุปกรณ์การแพทย์ที่ทันสมัย ใช้งานง่าย และปลอดภัย
              <br />สำหรับนักศึกษา บุคลากร และแอดมินของคลินิกเวชกรรม มหาวิทยาลัยรังสิต
            </p>
          </div>

          {/* Action Cards */}
          <div className={styles.actionCards}>
            <Link href="/auth/login" className={styles.actionCard}>
              <div className={styles.cardIcon}>
                <UserCheck size={32} />
              </div>
              <h3>เข้าสู่ระบบผู้ใช้</h3>
              <p>สำหรับนักศึกษาและบุคลากร</p>
              <div className={styles.cardArrow}>
                <ArrowRight size={20} />
              </div>
            </Link>

            <Link href="/auth/register" className={styles.actionCard}>
              <div className={styles.cardIcon}>
                <UserCheck size={32} />
              </div>
              <h3>ลงทะเบียน</h3>
              <p>สำหรับผู้ใช้งานใหม่</p>
              <div className={styles.cardArrow}>
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h3 className={styles.featuresTitle}>ฟีเจอร์หลักของระบบ</h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <Package size={24} />
              <h4>ยืมอุปกรณ์</h4>
              <p>ยืมอุปกรณ์การแพทย์ได้ทันที พร้อมระบบติดตาม</p>
            </div>
            
            <div className={styles.featureCard}>
              <Calendar size={24} />
              <h4>จองล่วงหน้า</h4>
              <p>จองอุปกรณ์ล่วงหน้าได้ พร้อมเลือกวันเวลา</p>
            </div>
            
            <div className={styles.featureCard}>
              <UserCheck size={24} />
              <h4>จัดการผู้ใช้</h4>
              <p>ระบบจัดการผู้ใช้และสิทธิ์การเข้าถึง</p>
            </div>
            
            <div className={styles.featureCard}>
              <Shield size={24} />
              <h4>ปลอดภัย</h4>
              <p>ระบบรักษาความปลอดภัยข้อมูลระดับสูง</p>
            </div>
          </div>
        </section>

        {/* Admin Login Section */}
        <section className={styles.quickRegister}>
          <div className={styles.registerContent}>
            <h3>เข้าสู่ระบบแอดมิน</h3>
            <p>สำหรับเจ้าหน้าที่และผู้ดูแลระบบ</p>
            <Link href="/admin/login" className={styles.registerBtn}>
              เข้าสู่ระบบแอดมิน
              <Shield size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Component - ใช้ Footer จาก components/layout */}
      <Footer />
    </div>
  )
}