import { NextRequest, NextResponse } from 'next/server';
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

    const store = getStore();
    const post = store.posts.find((p) => p.id === params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const likeIndex = post.likes.indexOf(user.userId);
    if (likeIndex === -1) {
      post.likes.push(user.userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
