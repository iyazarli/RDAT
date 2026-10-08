(function initSiteDataClient(global) {
  const PUBLIC_STATE_ENDPOINT = '/api/public-state';
  const CLIENT_ERROR_ENDPOINT = '/api/events/error';

  let pendingRequest;
  let activeController;
  let trackingBound = false;

  async function fetchPublicState() {
    const controller = new AbortController();
    activeController = controller;
    const timeout = global.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(PUBLIC_STATE_ENDPOINT, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Public state okunamadi: ${response.status}`);
      }

      const payload = await response.json();
      if (payload?.ok === true && payload.siteConfig?.brand
        && payload.siteConfig?.home && payload.siteConfig?.nav
        && Array.isArray(payload.siteConfig.categories) && Array.isArray(payload.teamProfiles)) {
        return payload;
      }
      throw new Error('Public state payload gecersiz.');
    } catch (error) {
      return null;
    } finally {
      global.clearTimeout(timeout);
      if (activeController === controller) activeController = null;
    }
  }

  function loadPublicState(force = false) {
    if (!pendingRequest || force === true) {
      activeController?.abort();
      pendingRequest = fetchPublicState();
    }
    return pendingRequest;
  }

  async function mount(renderState) {
    const root = global.document.documentElement;
    const status = global.document.querySelector('#public-state-status');
    const message = global.document.querySelector('#public-state-message');
    const retry = global.document.querySelector('#public-state-retry');
    const surfaces = [...global.document.querySelectorAll('header.nav, main, footer')];
    let revision = 0;

    function markPending() {
      root.classList.add('page-pending');
      surfaces.forEach(node => { node.inert = true; });
      status.hidden = false;
      status.setAttribute('aria-busy', 'true');
      message.textContent = 'Güncel içerik yükleniyor…';
      retry.hidden = true;
    }

    async function refresh(force = false, restoreAnchor = false) {
      const currentRevision = ++revision;
      markPending();
      try {
        const state = await loadPublicState(force);
        if (currentRevision !== revision) return;
        if (!state) throw new Error('Güncel içerik alınamadı.');
        renderState(state);
        surfaces.forEach(node => { node.inert = false; });
        root.classList.remove('page-pending');
        status.hidden = true;
        status.setAttribute('aria-busy', 'false');
        if (restoreAnchor && global.location.hash) {
          // Dinamik kartların ve bölümlerin çizilmesini bekleyerek çapaya git.
          let id;
          try { id = decodeURIComponent(global.location.hash.slice(1)); } catch { return; }
          global.document.getElementById(id)?.scrollIntoView();
        }
      } catch (error) {
        if (currentRevision !== revision) return;
        status.setAttribute('aria-busy', 'false');
        message.textContent = 'Güncel içerik yüklenemedi. Lütfen yeniden deneyin.';
        retry.hidden = false;
      }
    }

    retry.addEventListener('click', () => { refresh(true, true); });
    global.addEventListener('pagehide', () => {
      ++revision;
      activeController?.abort();
      markPending();
    });
    global.addEventListener('pageshow', event => {
      if (event.persisted) refresh(true);
    });
    bindGlobalErrorTracking();
    return refresh(false, true);
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
    if (trackingBound) return;
    trackingBound = true;
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
    mount,
    reportError
  };
  // Stil, font ve sayfa kodu indirilirken güncel kaydı paralel olarak iste.
  loadPublicState();
}(window));
