import type { Store } from './types';
import bcrypt from 'bcryptjs';

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    const demoPasswordHash = bcrypt.hashSync('demo123', 10);
    store = {
      users: [
        {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@example.com',
          password: demoPasswordHash,
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=764ba2&color=fff',
          createdAt: new Date().toISOString()
        }
      ],
      posts: []
    };
  }
  return store;
}
