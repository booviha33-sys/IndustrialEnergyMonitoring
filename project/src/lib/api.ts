export const API_BASE = 'http://localhost:8080';

export class BackendOfflineError extends Error {
  constructor(message = 'Backend Offline — cannot reach localhost:8080') {
    super(message);
    this.name = 'BackendOfflineError';
  }
}

export interface ApiList<T> {
  content?: T[];
  _embedded?: Record<string, T[]>;
  [key: string]: unknown;
}

async function doFetch(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      ...init,
    });
  } catch {
    throw new BackendOfflineError();
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await doFetch(path, init);
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  const text = await res.text();
  if (!text) return null as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiList<T>(path: string): Promise<T[]> {
  const data = await apiFetch<unknown>(path);
  return unwrapList<T>(data);
}

export async function apiCreate<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiUpdate<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiPutVoid(path: string): Promise<void> {
  const res = await doFetch(path, { method: 'PUT' });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await doFetch(path, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`API ${res.status}`);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function isOffline(err: unknown): boolean {
  return err instanceof BackendOfflineError || (err instanceof Error && err.name === 'BackendOfflineError');
}

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as T[];
    const emb = obj._embedded;
    if (emb && typeof emb === 'object') {
      const vals = Object.values(emb);
      const arr = vals.find((v) => Array.isArray(v));
      if (arr) return arr as T[];
    }
  }
  return [];
}

export function pickId(obj: Record<string, unknown>): unknown {
  return obj.id ?? obj._id ?? obj.uuid ?? obj[keyOf(obj, 'id')] ?? null;
}

function keyOf(obj: Record<string, unknown>, fragment: string): string {
  const lower = fragment.toLowerCase();
  return Object.keys(obj).find((k) => k.toLowerCase() === lower) ?? '';
}
