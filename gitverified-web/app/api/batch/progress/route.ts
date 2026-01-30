import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/batch/progress`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Backend error' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch {
    return NextResponse.json(
      { is_running: false, current: 0, total: 0, percentage: 0 },
      { status: 200 }
    );
  }
}
