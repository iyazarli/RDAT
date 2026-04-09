(function initSiteDataClient(global) {
  const PUBLIC_STATE_ENDPOINT = '/api/public-state';
  const CLIENT_ERROR_ENDPOINT = '/api/events/error';

  function clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  async function loadPublicState(fallbackFactory) {
    try {
      const response = await fetch(PUBLIC_STATE_ENDPOINT, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Public state okunamadi: ${response.status}`);
      }

      const payload = await response.json();
      if (payload && payload.ok && payload.siteConfig) {
        return clone(payload);
      }
      throw new Error('Public state payload gecersiz.');
    } catch (error) {
      console.error(error);
      return typeof fallbackFactory === 'function' ? fallbackFactory() : null;
    }
  }

  function reportError(payload) {
    try {
      const body = JSON.stringify({
        ...payload,
        path: `${global.location.pathname}${global.location.search}`,
        userAgent: global.navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      if (global.navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        global.navigator.sendBeacon(CLIENT_ERROR_ENDPOINT, blob);
        return;
      }

      fetch(CLIENT_ERROR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    } catch {}
  }

  function bindGlobalErrorTracking() {
    global.addEventListener('error', (event) => {
      reportError({
        type: 'error',
        message: event.message || 'Beklenmeyen client hatasi',
        source: event.filename || '',
        line: event.lineno || 0,
        column: event.colno || 0,
        stack: event.error?.stack || ''
      });
    });

    global.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      reportError({
        type: 'unhandledrejection',
        message: reason?.message || String(reason || 'Unhandled rejection'),
        stack: reason?.stack || ''
      });
    });
  }

  global.SiteDataClient = {
    bindGlobalErrorTracking,
    loadPublicState,
    reportError
  };
}(window));
