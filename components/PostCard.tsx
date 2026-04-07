'use client';

import { useState } from 'react';
import styles from './PostCard.module.css';
import CommentSection from './CommentSection';
import type { Post, User } from '@/lib/types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onPostUpdated: (post: Post) => void;
  onPostDeleted: (postId: string) => void;
}

export default function PostCard({ post, currentUser, onPostUpdated, onPostDeleted }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isLiked = post.likes.includes(currentUser.id);
  const isAuthor = post.authorId === currentUser.id;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        onPostUpdated(data.post);
      }
    } catch {
      console.error('Failed to like post');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onPostDeleted(post.id);
      }
    } catch {
      console.error('Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={post.authorAvatar} alt={post.authorName} className={styles.avatar} />
        <div className={styles.meta}>
          <span className={styles.authorName}>{post.authorName}</span>
          <span className={styles.date}>{formatDate(post.createdAt)}</span>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className={styles.deleteBtn}
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      <p className={styles.content}>{post.content}</p>

      <div className={styles.stats}>
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <button
          className={styles.commentToggle}
          onClick={() => setShowComments(prev => !prev)}
        >
          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setShowComments(prev => !prev)}
        >
          💬 Comment
        </button>
      </div>

      {showComments && (
        <CommentSection
          post={post}
          currentUser={currentUser}
          onPostUpdated={onPostUpdated}
        />
      )}
    </div>
  );
}
