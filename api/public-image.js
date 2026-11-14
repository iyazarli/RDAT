const { get } = require('@vercel/blob');
const { sendJson } = require('./_lib/http');

const IMAGE_PATH_PATTERN = /^site-images\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  let pathname = '';
  try {
    pathname = new URL(req.url, `https://${req.headers.host || 'localhost'}`).searchParams.get('pathname') || '';
  } catch {
    return sendJson(res, 400, { ok: false, error: 'Görsel yolu geçersiz.' });
  }

  if (!IMAGE_PATH_PATTERN.test(pathname)) {
    return sendJson(res, 404, { ok: false, error: 'Görsel bulunamadı.' });
  }

  try {
    const blob = await get(pathname, { access: 'private' });
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return sendJson(res, 404, { ok: false, error: 'Görsel bulunamadı.' });
    }

    const image = Buffer.from(await new Response(blob.stream).arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', blob.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', image.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.end(image);
  } catch (error) {
    console.error('Site görseli Blob deposundan okunamadı.', error);
    return sendJson(res, 500, { ok: false, error: 'Görsel şu anda sunulamıyor.' });
  }
};
