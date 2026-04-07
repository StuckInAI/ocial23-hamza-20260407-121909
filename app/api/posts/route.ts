import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getStore } from '@/lib/store';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const store = getStore();
  const sortedPosts = [...store.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ posts: sortedPosts });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = verifyToken(authHeader);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const store = getStore();
    const author = store.users.find((u) => u.id === user.userId);
    if (!author) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = {
      id: uuidv4(),
      content: content.trim(),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      likes: [] as string[],
      comments: [] as import('@/lib/types').Comment[],
      createdAt: new Date().toISOString()
    };

    store.posts.push(post);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
