import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';

export async function POST() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/evaluate/stop`, {
      method: 'POST',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Backend error' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 503 }
    );
  }
}
