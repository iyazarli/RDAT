function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }

  if (!raw) return {};
  return JSON.parse(raw);
}

module.exports = {
  sendJson,
  methodNotAllowed,
  readJsonBody
};
