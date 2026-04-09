const crypto = require('node:crypto');
const { sendJson, methodNotAllowed, readJsonBody } = require('./_lib/http');
const { updateState } = require('./_lib/store');
const { syncStateToGitHub } = require('./_lib/github-sync');

function createId() {
  return `app_${crypto.randomUUID()}`;
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeApplicationPayload(payload) {
  return {
    id: createId(),
    name: text(payload.name),
    email: text(payload.email).toLowerCase(),
    phone: text(payload.phone),
    experience: text(payload.experience),
    role: text(payload.role),
    region: text(payload.region),
    notes: text(payload.notes),
    consent: Boolean(payload.consent),
    status: 'new',
    adminNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function validateApplication(payload) {
  const missing = ['name', 'email', 'phone', 'experience', 'role'].filter((field) => !text(payload[field]));
  if (missing.length) {
    return 'Zorunlu alanlar eksik.';
  }

  if (!text(payload.email).includes('@')) {
    return 'Gecerli bir e-posta girin.';
  }

  if (!payload.consent) {
    return 'Guvenlik onayi gereklidir.';
  }

  return '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const body = await readJsonBody(req);
    const validationError = validateApplication(body);
    if (validationError) {
      return sendJson(res, 400, { ok: false, error: validationError });
    }

    const application = normalizeApplicationPayload(body);
    const savedState = await updateState((draft) => {
      draft.applications = [application, ...(Array.isArray(draft.applications) ? draft.applications : [])];
      draft.telemetry = {
        ...(draft.telemetry || {}),
        totalSubmissions: Number(draft.telemetry?.totalSubmissions || 0) + 1,
        lastSubmissionAt: application.createdAt,
        errors: Array.isArray(draft.telemetry?.errors) ? draft.telemetry.errors : []
      };
      return draft;
    });

    const githubSync = await syncStateToGitHub(savedState, {
      message: `Sync site state after application ${application.id}`,
    });

    return sendJson(res, 201, { ok: true, id: application.id, githubSync });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'Basvuru kaydedilemedi.' });
  }
};
