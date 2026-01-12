import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';
const OLLAMA_URL = 'http://localhost:11434';
const KESTRA_URL = 'http://localhost:8080';

export async function GET() {
  const status = {
    backend: false,
    ollama: false,
    kestra: false,
    models: [] as string[],
    ready: false
  };

  // Check Python backend
  try {
    const res = await fetch(BACKEND_URL, { method: 'GET' });
    status.backend = res.ok;
  } catch {
    status.backend = false;
  }

  // Check Ollama
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    if (res.ok) {
      status.ollama = true;
      const data = await res.json();
      status.models = data.models?.map((m: { name: string }) => m.name) || [];
    }
  } catch {
    status.ollama = false;
  }

  // Check Kestra
  try {
    const res = await fetch(`${KESTRA_URL}/api/v1/flows`, { method: 'GET' });
    status.kestra = res.ok;
  } catch {
    status.kestra = false;
  }

  // System is ready if at least backend and Ollama are running
  status.ready = status.backend && status.ollama;

  return NextResponse.json(status);
}
