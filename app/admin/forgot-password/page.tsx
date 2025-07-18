// app/admin/forgot-password/page.tsx
'use client';

import styles from './forgot-password.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, ArrowLeft, AlertCircle, CheckCircle, Lock } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // ตรวจสอบอีเมล (ในระบบจริงจะเช็คกับ database)
    if (email && email.includes('@')) {
      setShowSuccess(true);
      setShowError(false);
      
      // รอ 3 วินาทีแล้วกลับไปหน้า login
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setErrorMessage('กรุณากรอกอีเมลที่ถูกต้อง');
      
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Side - Branding */}
        <div className={styles.leftSection}>
          <div className={styles.brandingCard}>
            <div className={styles.logoSection}>
              <img 
                src="/logo.png" 
                alt="RSU Logo" 
                className={styles.logo}
              />
              <div className={styles.brandText}>
                <h1 className={styles.clinicText}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</h1>
                <p className={styles.clinicTextEn}>RSU MEDICAL CLINIC</p>
                <div className={styles.divider}></div>
                <h2 className={styles.adminTitle}>รีเซ็ตรหัสผ่านแอดมิน</h2>
                <p className={styles.adminSubtitle}>Admin Password Recovery</p>
              </div>
            </div>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Mail size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>การยืนยันทางอีเมล</h3>
                  <p>ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Shield size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>ความปลอดภัยสูง</h3>
                  <p>กระบวนการรีเซ็ตที่ปลอดภัยและเชื่อถือได้</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Lock size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>การเข้ารหัส</h3>
                  <p>ข้อมูลได้รับการปกป้องด้วยระบบเข้ารหัส</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className={styles.rightSection}>
          <div className={styles.forgotCard}>
            <div className={styles.forgotHeader}>
              <div className={styles.adminIcon}>
                <Mail size={32} />
              </div>
              <h2 className={styles.forgotTitle}>ลืมรหัสผ่าน?</h2>
              <p className={styles.forgotSubtitle}>
                กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.forgotForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>อีเมลผู้ดูแลระบบ</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input 
                    type="email" 
                    placeholder="admin@rsu.ac.th"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    กำลังส่งอีเมล...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                  </>
                )}
              </button>
            </form>

            <div className={styles.forgotFooter}>
              <Link href="/admin/login" className={styles.backToLogin}>
                <ArrowLeft size={18} />
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
              
              <div className={styles.helpInfo}>
                <h4>ต้องการความช่วยเหลือ?</h4>
                <p>ติดต่อ IT Support: <strong>ext. 2200</strong></p>
                <p>อีเมล: <strong>itsupport@rsu.ac.th</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} />
            </div>
            <h3 className={styles.popupTitle}>ส่งอีเมลสำเร็จ!</h3>
            <p className={styles.popupText}>
              เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง
            </p>
            <p className={styles.emailText}>{email}</p>
            <p className={styles.popupSubtext}>
              กรุณาตรวจสอบอีเมลของคุณและทำตามขั้นตอน
            </p>
            <div className={styles.instructionBox}>
              <h4>ขั้นตอนต่อไป:</h4>
              <ol>
                <li>เปิดอีเมลที่เราส่งให้</li>
                <li>คลิกลิงก์รีเซ็ตรหัสผ่าน</li>
                <li>ตั้งรหัสผ่านใหม่</li>
                <li>เข้าสู่ระบบด้วยรหัสผ่านใหม่</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles.errorPopup}`}>
            <div className={styles.errorIcon}>
              <AlertCircle size={48} />
            </div>
            <h3 className={styles.popupTitle}>เกิดข้อผิดพลาด</h3>
            <p className={styles.popupText}>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}