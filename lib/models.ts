export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Task {
  _id?: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionToken {
  _id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
