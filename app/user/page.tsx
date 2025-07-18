import styles from './user.module.css';
import Link from 'next/link';

export default function UserMainPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img 
              src="/logo.png" 
              alt="RSU Logo" 
              className={styles.logo}
            />
            <div>
              <h1 className={styles.title}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</h1>
              <p className={styles.subtitle}>RSU MEDICAL CLINIC</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.headerText}>การ ยืน-คืน วัสดุ อุปกรณ์ทางการแพทย์</p>
            <div className={styles.langButtons}>
              <button className={`${styles.langBtn} ${styles.langBtnActive}`}>
                <span style={{marginRight: '0.5rem'}}>✓</span>
                ภาษาไทย
              </button>
              <button className={styles.langBtn}>
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left side - Form illustration */}
        <div className={styles.leftCard}>
          <div className={styles.browserWindow}>
            <div className={styles.browserDots}>
              <div className={`${styles.dot} ${styles.dotRed}`}></div>
              <div className={`${styles.dot} ${styles.dotYellow}`}></div>
              <div className={`${styles.dot} ${styles.dotGreen}`}></div>
            </div>
            <div className={styles.browserContent}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <svg style={{width: '32px', height: '32px', color: 'white'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className={styles.userDetails}>
                  <div className={`${styles.skeleton} ${styles.skeletonShort}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonMedium}`}></div>
                  <div className={`${styles.skeleton} ${styles.skeletonLong}`}></div>
                </div>
              </div>
              <div className={styles.formField}>
                <div className={styles.inputField}></div>
                <div className={styles.progressBar}>
                  <div className={styles.progressLine}></div>
                </div>
              </div>
            </div>
            <div className={styles.floatingIcon}>
              <div className={styles.iconCircle}>
                <svg style={{width: '40px', height: '40px', color: '#c05621'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className={styles.rightCard}>
          <div className={styles.loginForm}>
            <div className={styles.userIconBg}>
              <svg style={{width: '64px', height: '64px', color: 'white'}} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className={styles.passwordField}>
              <input
                type="password"
                placeholder="******"
                className={styles.passwordInput}
                readOnly
              />
            </div>

            <div className={styles.buttonGroup}>
              <Link href="/user/register" className={styles.button}>
                ลงทะเบียน
              </Link>
              <Link href="/user/login" className={styles.button}>
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}