'use client';

import { useState } from 'react';
import styles from './CommentSection.module.css';
import type { Post, User } from '@/lib/types';

interface CommentSectionProps {
  post: Post;
  currentUser: User;
  onPostUpdated: (post: Post) => void;
}

export default function CommentSection({ post, currentUser, onPostUpdated }: CommentSectionProps) {
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
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (res.ok) {
        onPostUpdated(data.post);
        setContent('');
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ commentId })
      });
      const data = await res.json();
      if (res.ok) {
        onPostUpdated(data.post);
      }
    } catch {
      console.error('Failed to delete comment');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.section}>
      <div className={styles.comments}>
        {post.comments.length === 0 && (
          <p className={styles.noComments}>No comments yet. Be the first!</p>
        )}
        {post.comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            <img src={comment.authorAvatar} alt={comment.authorName} className={styles.avatar} />
            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.authorName}</span>
                <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                {comment.authorId === currentUser.id && (
                  <button
                    className={styles.deleteCommentBtn}
                    onClick={() => handleDeleteComment(comment.id)}
                    title="Delete comment"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <img src={currentUser.avatar} alt={currentUser.name} className={styles.avatar} />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            maxLength={300}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={styles.submitBtn}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
