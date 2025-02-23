import { NextResponse } from 'next/server';

export async function POST() {
  // Your registration logic here
  return NextResponse.json({ message: 'Registration endpoint' });
}

export const dynamic = 'force-dynamic';
