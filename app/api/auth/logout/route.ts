import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAuthCookie } from '@/lib/cookies';
import clientPromise from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (token) {
      const client = await clientPromise;
      const db = client.db('taskmanager');
      const sessionsCollection = db.collection('sessions');
      await sessionsCollection.deleteOne({ token });
    }

    await clearAuthCookie();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
