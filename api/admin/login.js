const { setAdminSessionCookie } = require('../_lib/admin-auth');
const { sendJson, methodNotAllowed, readJsonBody } = require('../_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const body = await readJsonBody(req);
    const incomingPasscode = typeof body.passcode === 'string' ? body.passcode.trim() : '';

    if (!process.env.ADMIN_PASSCODE || incomingPasscode !== process.env.ADMIN_PASSCODE) {
      return sendJson(res, 401, { ok: false, error: 'Sifre yanlis.' });
    }

    setAdminSessionCookie(req, res);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'Admin girisi yapilamadi.' });
  }
};
