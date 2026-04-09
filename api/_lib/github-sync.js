const DEFAULT_OWNER = 'iyazarli';
const DEFAULT_REPO = 'RDAT';
const DEFAULT_BRANCH = 'main';
const DEFAULT_FILE_PATH = 'data/site-state.json';
const API_VERSION = '2022-11-28';
const USER_AGENT = 'reddevil-airsoft-admin-sync';

function getConfig() {
  const token = process.env.GITHUB_SYNC_TOKEN;
  if (!token) {
    return null;
  }

  return {
    token,
    owner: process.env.GITHUB_SYNC_OWNER || DEFAULT_OWNER,
    repo: process.env.GITHUB_SYNC_REPO || DEFAULT_REPO,
    branch: process.env.GITHUB_SYNC_BRANCH || DEFAULT_BRANCH,
    filePath: process.env.GITHUB_SYNC_FILE_PATH || DEFAULT_FILE_PATH,
  };
}

function buildContentsUrl(config) {
  const encodedPath = String(config.filePath)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const ref = encodeURIComponent(config.branch);
  return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}?ref=${ref}`;
}

async function githubRequest(url, config, options = {}) {
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'User-Agent': USER_AGENT,
      'X-GitHub-Api-Version': API_VERSION,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `GitHub istegi basarisiz: ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function getExistingSha(config) {
  try {
    const payload = await githubRequest(buildContentsUrl(config), config);
    return typeof payload?.sha === 'string' ? payload.sha : '';
  } catch (error) {
    if (error.status === 404) {
      return '';
    }
    throw error;
  }
}

async function putFile(config, state, sha, message) {
  const payload = {
    message,
    content: Buffer.from(JSON.stringify(state, null, 2)).toString('base64'),
    branch: config.branch,
  };

  if (sha) {
    payload.sha = sha;
  }

  const response = await githubRequest(buildContentsUrl(config), config, {
    method: 'PUT',
    body: payload,
  });

  return {
    ok: true,
    branch: config.branch,
    owner: config.owner,
    repo: config.repo,
    filePath: config.filePath,
    commitSha: response?.commit?.sha || '',
    commitUrl: response?.commit?.html_url || '',
    contentSha: response?.content?.sha || '',
  };
}

async function syncStateToGitHub(state, options = {}) {
  const config = getConfig();
  if (!config) {
    return {
      ok: false,
      skipped: true,
      error: 'GitHub sync token tanimli degil.',
      filePath: DEFAULT_FILE_PATH,
      branch: DEFAULT_BRANCH,
      owner: DEFAULT_OWNER,
      repo: DEFAULT_REPO,
    };
  }

  const message = options.message || `Sync admin state from live panel (${new Date().toISOString()})`;

  try {
    const sha = await getExistingSha(config);
    return await putFile(config, state, sha, message);
  } catch (error) {
    try {
      if (error.status === 409 || error.status === 422) {
        const latestSha = await getExistingSha(config);
        return await putFile(config, state, latestSha, message);
      }
    } catch (retryError) {
      return {
        ok: false,
        skipped: false,
        error: retryError.message || 'GitHub sync retry basarisiz.',
        filePath: config.filePath,
        branch: config.branch,
        owner: config.owner,
        repo: config.repo,
      };
    }

    return {
      ok: false,
      skipped: false,
      error: error.message || 'GitHub sync basarisiz.',
      filePath: config.filePath,
      branch: config.branch,
      owner: config.owner,
      repo: config.repo,
    };
  }
}

module.exports = {
  syncStateToGitHub,
};
