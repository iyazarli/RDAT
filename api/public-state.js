const { sendJson, methodNotAllowed } = require('./_lib/http');
const EventBlocks = require('../event-blocks');
const { loadState } = require('./_lib/store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const state = await loadState();
    for (const category of state.siteConfig?.categories || []) {
      if (category.slug === 'events') category.blocks = EventBlocks.sort(category.blocks || []);
    }
    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 200, {
      ok: true,
      siteConfig: state.siteConfig,
      teamProfiles: state.teamProfiles
    });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'public_state_unavailable' });
  }
};
