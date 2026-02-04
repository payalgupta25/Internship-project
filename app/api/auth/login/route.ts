import { NextRequest, NextResponse } from 'next/server';
import getClient from '@/lib/db';
import { comparePasswords, generateToken, getTokenExpiry } from '@/lib/auth';
import { setAuthCookie } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    let client;
    try {
      client = await getClient();
    } catch (dbError: any) {
      console.error('Login DB connect error:', dbError);
      const msg = 'Cannot connect to MongoDB. Likely network/IP whitelist or TLS issue. Check MongoDB Atlas Network Access and ensure Vercel can reach the cluster.';
      return NextResponse.json({ error: msg, detail: dbError?.message }, { status: 503 });
    }
    const db = client.db('taskmanager');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken();
    const expiresAt = getTokenExpiry();

    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.insertOne({
      userId: user._id.toString(),
      token,
      expiresAt,
      createdAt: new Date(),
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        userId: user._id,
        role: user.role,
        name: user.name,
      },
      { status: 200 }
    );

    try {
      await setAuthCookie(token);
    } catch (cookieError) {
      console.error('Failed to set auth cookie:', cookieError);
      // don't fail the whole request for cookie-setting issues
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
