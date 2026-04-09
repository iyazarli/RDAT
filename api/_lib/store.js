const { get, put } = require('@vercel/blob');
const { createDefaultState, clone } = require('./default-state');

const STATE_PATHNAME = 'state/site-data.json';

function isMissingBlobError(error) {
  const name = String(error?.name || '');
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  return name.includes('NotFound')
    || code.includes('not_found')
    || message.includes('not found')
    || message.includes('does not exist');
}

async function fetchBlobJson(pathname) {
  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode === 404) {
    return null;
  }

  if (result.statusCode !== 200 || !result.stream) {
    throw new Error(`Blob JSON okunamadi: ${result.statusCode || 'unknown'}`);
  }

  return new Response(result.stream).json();
}

async function readStoredState() {
  try {
    return await fetchBlobJson(STATE_PATHNAME);
  } catch (error) {
    if (isMissingBlobError(error)) {
      return null;
    }
    throw error;
  }
}

async function saveState(nextState) {
  const stampedState = {
    ...clone(nextState),
    meta: {
      ...clone(nextState.meta || {}),
      updatedAt: new Date().toISOString()
    }
  };

  if (!stampedState.meta.createdAt) {
    stampedState.meta.createdAt = stampedState.meta.updatedAt;
  }

  await put(STATE_PATHNAME, JSON.stringify(stampedState, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });

  return stampedState;
}

async function loadState() {
  const existingState = await readStoredState();
  if (existingState && typeof existingState === 'object') {
    return existingState;
  }

  const defaultState = createDefaultState();
  return saveState(defaultState);
}

async function updateState(updater) {
  const currentState = await loadState();
  const draft = clone(currentState);
  const maybeNextState = await updater(draft);
  return saveState(maybeNextState || draft);
}

module.exports = {
  STATE_PATHNAME,
  loadState,
  saveState,
  updateState
};
