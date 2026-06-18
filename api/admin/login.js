const crypto = require('node:crypto');
const { setAdminSessionCookie } = require('../_lib/admin-auth');
const { sendJson, methodNotAllowed, readJsonBody } = require('../_lib/http');

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ''), 'utf8');
  const rightBuffer = Buffer.from(String(right || ''), 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseAdminUsers() {
  if (!process.env.ADMIN_USERS) {
    return [];
  }

  const parsed = JSON.parse(process.env.ADMIN_USERS);
  if (!Array.isArray(parsed)) {
    throw new Error('ADMIN_USERS JSON array olmali.');
  }

  return parsed
    .map((user) => ({
      username: typeof user?.username === 'string' ? user.username.trim() : '',
      passcode: typeof user?.passcode === 'string' ? user.passcode : '',
    }))
    .filter((user) => user.username && user.passcode);
}

function isValidAdminLogin(username, passcode) {
  const users = parseAdminUsers();

  if (users.length > 0) {
    return users.some(
      (user) => safeCompare(username, user.username) && safeCompare(passcode, user.passcode)
    );
  }

  return Boolean(process.env.ADMIN_PASSCODE) && safeCompare(passcode, process.env.ADMIN_PASSCODE);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const body = await readJsonBody(req);
    const incomingUsername = typeof body.username === 'string' ? body.username.trim() : '';
    const incomingPasscode = typeof body.passcode === 'string' ? body.passcode.trim() : '';

    if (!isValidAdminLogin(incomingUsername, incomingPasscode)) {
      return sendJson(res, 401, { ok: false, error: 'Kullanici adi veya sifre yanlis.' });
    }

    setAdminSessionCookie(req, res);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'Admin girisi yapilamadi.' });
  }
};
