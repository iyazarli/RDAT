const { requireAdmin } = require('../_lib/admin-auth');
const { sendJson, methodNotAllowed, readJsonBody } = require('../_lib/http');
const { loadState, saveState } = require('../_lib/store');
const { syncStateToGitHub } = require('../_lib/github-sync');

module.exports = async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) {
    return methodNotAllowed(res, ['GET', 'PUT']);
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  try {
    if (req.method === 'GET') {
      const state = await loadState();
      res.setHeader('Cache-Control', 'no-store');
      return sendJson(res, 200, { ok: true, state });
    }

    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { ok: false, error: 'Gecersiz state payload.' });
    }

    const currentState = await loadState();
    const nextState = {
      applications: Array.isArray(body.applications) ? body.applications : currentState.applications,
      teamProfiles: Array.isArray(body.teamProfiles) ? body.teamProfiles : currentState.teamProfiles,
      siteConfig: body.siteConfig && typeof body.siteConfig === 'object' ? body.siteConfig : currentState.siteConfig,
      telemetry: body.telemetry && typeof body.telemetry === 'object' ? body.telemetry : currentState.telemetry,
      meta: {
        ...(currentState.meta || {}),
        updatedAt: new Date().toISOString()
      }
    };

    const savedState = await saveState(nextState);
    const githubSync = await syncStateToGitHub(savedState, {
      message: `Sync site state from admin panel (${new Date().toISOString()})`,
    });

    return sendJson(res, 200, { ok: true, state: savedState, githubSync });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'Admin state kaydedilemedi.' });
  }
};
