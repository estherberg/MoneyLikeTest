export type InteractionType = 'CLICK' | 'LIKE' | 'VOTE';

export interface InteractionResponse {
  interactionId: string | null;
  credited: boolean;
  newBalance: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

function toError(res: Response, fallback = 'HTTP error') {
  return res.text().then((t) => {
    try {
      const j = t ? JSON.parse(t) : null;
      return new Error(j?.message || t || fallback);
    } catch {
      return new Error(t || fallback);
    }
  });
}

export async function sendInteraction(
  creativeId: string,
  type: InteractionType,
  metadata?: Record<string, any>,
  opts?: {
    idempotencyKey?: string;
    keepalive?: boolean; 
    signal?: AbortSignal;
  },
): Promise<InteractionResponse> {
  const keepalive = opts?.keepalive ?? (type === 'CLICK');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}), 
  };
  if (opts?.idempotencyKey) {
    headers['Idempotency-Key'] = opts.idempotencyKey;
  }

  const res = await fetch(`${API_URL}/interactions`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ creativeId, type, metadata }),
    keepalive,
    signal: opts?.signal,
  });

  if (res.status === 401) throw new Error('Unauthorized'); // not connected
  if (res.status === 403) throw new Error('Forbidden');    // not authorised
  if (!res.ok) throw await toError(res, `HTTP ${res.status}`);

  const text = await res.text();
  return text
    ? (JSON.parse(text) as InteractionResponse)
    : { interactionId: null, credited: false, newBalance: null };
}

export const clickCreative = (creativeId: string, metadata?: Record<string, any>, opts?: Omit<Parameters<typeof sendInteraction>[3], 'keepalive'>) =>
  sendInteraction(creativeId, 'CLICK', metadata, { ...opts, keepalive: true });

export const likeCreative = (creativeId: string, metadata?: Record<string, any>, opts?: Parameters<typeof sendInteraction>[3]) =>
  sendInteraction(creativeId, 'LIKE', metadata, opts);

export const voteCreative = (creativeId: string, metadata?: Record<string, any>, opts?: Parameters<typeof sendInteraction>[3]) =>
  sendInteraction(creativeId, 'VOTE', metadata, opts);
