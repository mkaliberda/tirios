const DEFAULT_API_BASE_URL = 'http://localhost:3001';

const normalizeBaseUrl = (value) => {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const apiBaseUrlFromEnv = import.meta.env.VITE_SERVER_DOMAIN || import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = normalizeBaseUrl(apiBaseUrlFromEnv);

const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default buildApiUrl;
