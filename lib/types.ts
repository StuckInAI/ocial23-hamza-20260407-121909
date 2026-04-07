export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Store {
  users: StoredUser[];
  posts: Post[];
}
