const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}
function setToken(t?: string) {
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem('token', t); else localStorage.removeItem('token');
}

async function handle(res: Response) {
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 403) throw new Error('Forbidden');
  const text = await res.text();
  if (!res.ok) {
    let msg = res.statusText;
    try { const data = text ? JSON.parse(text) : null; msg = data?.message || JSON.stringify(data); } catch {}
    throw new Error(msg);
  }
  return text ? JSON.parse(text) : null;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle(res);            // { user, accessToken }
  if (data?.accessToken) setToken(data.accessToken);  // stocke Bearer
  return data;
}

export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
  } finally {
    setToken(undefined); 
  }
}

export async function me() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}), 
    },
  });
  return handle(res);
}

async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}), 
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handle(res);
}

export const apiGet    = (p: string) => request('GET', p);
export const apiPost   = (p: string, b?: any) => request('POST', p, b);
export const apiPut    = (p: string, b?: any) => request('PUT', p, b);
export const apiDelete = (p: string) => request('DELETE', p);
