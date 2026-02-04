import { NextResponse } from 'next/server';
import getClient from '@/lib/db';

export async function GET() {
  try {
    const client = await getClient();
    // ping the server
    await client.db().command({ ping: 1 });
    return NextResponse.json({ ok: true, message: 'Mongo ping successful' }, { status: 200 });
  } catch (err: any) {
    console.error('Debug Mongo error:', err);
    // Give actionable guidance without exposing credentials
    const msg = 'Cannot connect to MongoDB from this environment. Likely network/IP whitelist or TLS issue. Check MongoDB Atlas Network Access and ensure your host (Vercel) can reach the cluster.';
    return NextResponse.json({ ok: false, error: msg, detail: err?.message }, { status: 503 });
  }
}
