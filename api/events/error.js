const crypto = require('node:crypto');
const { sendJson, methodNotAllowed, readJsonBody } = require('../_lib/http');
const { updateState } = require('../_lib/store');

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const body = await readJsonBody(req);
    const entry = {
      id: `err_${crypto.randomUUID()}`,
      type: text(body.type) || 'error',
      message: text(body.message) || 'Bilinmeyen client hatasi',
      source: text(body.source),
      path: text(body.path),
      line: Number(body.line || 0),
      column: Number(body.column || 0),
      stack: text(body.stack).slice(0, 4000),
      userAgent: text(body.userAgent).slice(0, 500),
      createdAt: text(body.timestamp) || new Date().toISOString()
    };

    await updateState((draft) => {
      const currentErrors = Array.isArray(draft.telemetry?.errors) ? draft.telemetry.errors : [];
      draft.telemetry = {
        ...(draft.telemetry || {}),
        totalSubmissions: Number(draft.telemetry?.totalSubmissions || 0),
        lastSubmissionAt: draft.telemetry?.lastSubmissionAt || '',
        errors: [entry, ...currentErrors].slice(0, 30)
      };
      return draft;
    });

    return sendJson(res, 202, { ok: true });
  } catch (error) {
    console.error(error);
    return sendJson(res, 202, { ok: false });
  }
};
