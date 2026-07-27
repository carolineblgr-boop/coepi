// src/app/api/gmail/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const isConfigured = Boolean(clientId && clientSecret);

  return NextResponse.json({
    status: isConfigured ? 'success' : 'error',
    message: isConfigured
      ? 'Google Credentials loaded successfully on the server!'
      : 'Missing Google credentials in .env.local',
    clientIdPrefix: clientId ? `${clientId.substring(0, 12)}...` : null,
  });
}