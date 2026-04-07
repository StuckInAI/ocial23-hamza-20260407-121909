'use client';

import { useState } from 'react';
import styles from './CreatePost.module.css';
import type { Post, User } from '@/lib/types';

interface CreatePostProps {
  user: User;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      const data = await res.json();
      if (res.ok) {
        onPostCreated(data.post);
        setContent('');
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            rows={3}
            maxLength={500}
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.bottom}>
            <span className={styles.charCount}>{content.length}/500</span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className={styles.submitBtn}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
