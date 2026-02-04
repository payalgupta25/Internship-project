import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { hashPassword, generateToken, getTokenExpiry } from '@/lib/auth';
import { setAuthCookie } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taskmanager');
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = {
      email,
      password: hashedPassword,
      name,
      role: 'user' as const,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    const token = generateToken();
    const expiresAt = getTokenExpiry();

    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.insertOne({
      userId: result.insertedId.toString(),
      token,
      expiresAt,
      createdAt: new Date(),
    });

    const response = NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    );

    await setAuthCookie(token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
