import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'social-app-secret-key-2024';

interface TokenPayload {
  userId: string;
  email: string;
}

export function verifyToken(authHeader: string | null): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}
