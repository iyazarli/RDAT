const { clearAdminSessionCookie } = require('../_lib/admin-auth');
const { sendJson, methodNotAllowed } = require('../_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  clearAdminSessionCookie(req, res);
  return sendJson(res, 200, { ok: true });
};
