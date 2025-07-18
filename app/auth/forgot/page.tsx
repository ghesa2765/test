'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './forgot.module.css';

export default function AuthForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ตรวจสอบอีเมล
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('กรุณากรอกอีเมลให้ถูกต้อง');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // ตรวจสอบรหัสผ่าน
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      setErrorMessage('รหัสผ่านต้องมีตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข อย่างน้อย 8 ตัว');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // ตรวจสอบรหัสผ่านตรงกัน
    if (newPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // แสดงข้อความสำเร็จ
    setShowSuccess(true);
    
    // รอ 3 วินาที แล้ว redirect กลับไปหน้า login
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img 
            src="/logo.png" 
            alt="RSU Logo" 
            className={styles.logo}
          />
          <p className={styles.clinicText}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</p>
          <p className={styles.clinicTextEn}>RSU MEDICAL CLINIC</p>
        </div>

        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>รีเซ็ตรหัสผ่าน</h2>
          <p className={styles.formSubtitle}>กรุณากรอกอีเมลและรหัสผ่านใหม่ของคุณ</p>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className={styles.resetForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>อีเมล:</label>
              <input 
                type="email" 
                placeholder="example@rsu.ac.th"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>รหัสผ่านใหม่:</label>
              <input 
                type="password" 
                placeholder="รหัสผ่านใหม่"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className={styles.helperText}>
                ต้องมีตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข อย่างน้อย 8 ตัว
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ยืนยันรหัสผ่านใหม่:</label>
              <input 
                type="password" 
                placeholder="ยืนยันรหัสผ่านใหม่"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              รีเซ็ตรหัสผ่าน
            </button>
          </form>

          <Link href="/auth/login" className={styles.backToLogin}>
            <span className={styles.backIcon}>‹</span>
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.popupTitle}>รีเซ็ตรหัสผ่านสำเร็จ!</h3>
            <p className={styles.popupText}>
              ระบบได้ส่งรายละเอียดไปยังอีเมลของคุณแล้ว
            </p>
            <p className={styles.popupSubtext}>
              กำลังนำคุณกลับไปยังหน้าเข้าสู่ระบบ...
            </p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles.errorPopup}`}>
            <div className={styles.errorIcon}>✕</div>
            <h3 className={styles.popupTitle}>เกิดข้อผิดพลาด</h3>
            <p className={styles.popupText}>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}