import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getStore } from '@/lib/store';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = verifyToken(authHeader);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const store = getStore();
    const post = store.posts.find((p) => p.id === params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const author = store.users.find((u) => u.id === user.userId);
    if (!author) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const comment = {
      id: uuidv4(),
      content: content.trim(),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      createdAt: new Date().toISOString()
    };

    post.comments.push(comment);
    return NextResponse.json({ comment, post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = verifyToken(authHeader);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await request.json();
    const store = getStore();
    const post = store.posts.find((p) => p.id === params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const commentIndex = post.comments.findIndex(
      (c) => c.id === commentId && c.authorId === user.userId
    );
    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found or not authorized' }, { status: 404 });
    }

    post.comments.splice(commentIndex, 1);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
