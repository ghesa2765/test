// components/dashboard/ActivityItem.tsx
import styles from '@/styles/components/activity-item.module.css'

interface ActivityItemProps {
  icon: React.ReactNode
  text: string
  time: string
  type?: 'success' | 'warning' | 'info' | 'error'
}

export default function ActivityItem({ icon, text, time, type = 'info' }: ActivityItemProps) {
  return (
    <div className={styles.activityItem}>
      <div className={`${styles.activityIcon} ${styles[type]}`}>{icon}</div>
      <div className={styles.activityContent}>
        <p className={styles.activityText}>{text}</p>
        <span className={styles.activityTime}>{time}</span>
      </div>
    </div>
  )
}