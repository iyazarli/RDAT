const crypto = require('node:crypto');
const { sendJson } = require('./http');

const COOKIE_NAME = 'rdat_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) return acc;
      const key = pair.slice(0, separatorIndex);
      const value = pair.slice(separatorIndex + 1);
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function getSessionSecret() {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error('ADMIN_SESSION_SECRET eksik.');
  }
  return process.env.ADMIN_SESSION_SECRET;
}

function createSignature(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
    })
  ).toString('base64url');

  return `${payload}.${createSignature(payload)}`;
}

function isValidSessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return false;
  }

  const [payload, receivedSignature] = token.split('.');
  if (!payload || !receivedSignature) return false;

  const expectedSignature = createSignature(payload);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number(parsed.exp || 0) > Date.now();
  } catch {
    return false;
  }
}

function serializeCookie(name, value, secure) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function serializeClearCookie(name, secure) {
  const parts = [
    `${name}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function isSecureRequest(req) {
  return req.headers['x-forwarded-proto'] === 'https' || process.env.VERCEL_ENV === 'production';
}

function setAdminSessionCookie(req, res) {
  res.setHeader('Set-Cookie', serializeCookie(COOKIE_NAME, createSessionToken(), isSecureRequest(req)));
}

function clearAdminSessionCookie(req, res) {
  res.setHeader('Set-Cookie', serializeClearCookie(COOKIE_NAME, isSecureRequest(req)));
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  return isValidSessionToken(cookies[COOKIE_NAME]);
}

function requireAdmin(req, res) {
  if (!isAuthenticated(req)) {
    sendJson(res, 401, { ok: false, error: 'unauthorized' });
    return false;
  }
  return true;
}

module.exports = {
  COOKIE_NAME,
  clearAdminSessionCookie,
  isAuthenticated,
  requireAdmin,
  setAdminSessionCookie
};
