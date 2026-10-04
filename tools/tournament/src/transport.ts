export const host = new URLSearchParams(location.search).get('host');
export const embedded = host === 'wd' || host === 'reddevil';
export const draftKey = `turnuva-taslak-${embedded ? host : 'standalone'}`;
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!embedded) return fetch(url, options);
  const suffix = url.replace('/api/tournaments', '');
  const target = host === 'wd' ? `/api/admin/tournaments${suffix}` : `/api/admin/tournaments${suffix ? `?id=${encodeURIComponent(decodeURIComponent(suffix.slice(1)))}` : ''}`;
  const headers = new Headers(options.headers);
  if (options.method && options.method !== 'GET' && host === 'wd') {
    const session = await fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' });
    if (!session.ok) { window.dispatchEvent(new Event('turnuva-auth-expired')); return session; }
    headers.set('X-CSRF-Token', (await session.json()).csrf);
  }
  const res = await fetch(target, { ...options, headers, credentials: 'same-origin', cache: 'no-store' });
  if (res.status === 401) window.dispatchEvent(new Event('turnuva-auth-expired'));
  return res;
}
