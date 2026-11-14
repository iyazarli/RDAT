const crypto = require('node:crypto');
const { put } = require('@vercel/blob');
const { requireAdmin } = require('../_lib/admin-auth');
const { methodNotAllowed, readJsonBody, sendJson } = require('../_lib/http');

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function hasImageSignature(buffer, contentType) {
  if (contentType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (contentType === 'image/png') {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  return contentType === 'image/webp'
    && buffer.length >= 12
    && buffer.toString('ascii', 0, 4) === 'RIFF'
    && buffer.toString('ascii', 8, 12) === 'WEBP';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'Görsel verisi okunamadı.' });
  }

  const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl : '';
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return sendJson(res, 400, { ok: false, error: 'Desteklenmeyen görsel biçimi.' });

  const [, contentType, base64] = match;
  if (base64.length > MAX_BASE64_LENGTH) {
    return sendJson(res, 413, { ok: false, error: 'Görsel 3 MB sınırını aşıyor.' });
  }

  const imageBuffer = Buffer.from(base64, 'base64');
  if (!imageBuffer.length || imageBuffer.length > MAX_IMAGE_BYTES) {
    return sendJson(res, 413, { ok: false, error: 'Görsel 3 MB sınırını aşıyor.' });
  }
  if (!hasImageSignature(imageBuffer, contentType)) {
    return sendJson(res, 400, { ok: false, error: 'Dosya içeriği görsel biçimiyle eşleşmiyor.' });
  }

  try {
    const pathname = `site-images/${crypto.randomUUID()}.${IMAGE_TYPES[contentType]}`;
    const blob = await put(pathname, imageBuffer, {
      access: 'private',
      addRandomSuffix: false,
      contentType,
      cacheControlMaxAge: 31_536_000,
    });

    const publicUrl = `/api/public-image?pathname=${encodeURIComponent(blob.pathname)}`;
    return sendJson(res, 201, { ok: true, pathname: blob.pathname, url: publicUrl });
  } catch (error) {
    console.error('Site görseli Blob deposuna kaydedilemedi.', error);
    return sendJson(res, 500, { ok: false, error: 'Görsel depoya kaydedilemedi.' });
  }
};

module.exports.config = {
  api: {
    bodyParser: { sizeLimit: '4.5mb' },
  },
};
