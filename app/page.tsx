import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.logoWrapper}>
          <span className={styles.logoIcon}>💬</span>
          <h1 className={styles.logoText}>SocialApp</h1>
        </div>
        <p className={styles.tagline}>Connect, Share, and Engage with the world around you.</p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.btnPrimary}>Log In</Link>
          <Link href="/signup" className={styles.btnSecondary}>Sign Up</Link>
        </div>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🌐</span>
            <h3>Share Posts</h3>
            <p>Share your thoughts and ideas with the community</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💬</span>
            <h3>Comment</h3>
            <p>Engage in meaningful conversations on any post</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>❤️</span>
            <h3>Like & React</h3>
            <p>Show your appreciation for content you love</p>
          </div>
        </div>
      </div>
    </main>
  );
}
