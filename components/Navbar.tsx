'use client';

import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import type { User } from '@/lib/types';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>💬</span>
          <span className={styles.brandText}>SocialApp</span>
        </div>
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.avatar}
            />
            <span className={styles.userName}>{user.name}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
