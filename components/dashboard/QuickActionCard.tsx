// components/dashboard/QuickActionCard.tsx
import Link from 'next/link'
import styles from '@/styles/components/quick-action-card.module.css'

interface QuickActionCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

export default function QuickActionCard({ href, icon, title, description }: QuickActionCardProps) {
  return (
    <Link href={href} className={styles.actionCard}>
      <div className={styles.actionIcon}>{icon}</div>
      <div className={styles.actionContent}>
        <h3 className={styles.actionTitle}>{title}</h3>
        <p className={styles.actionDescription}>{description}</p>
      </div>
    </Link>
  )
}