const ITEMS_NAMESPACE = 'items';

const normalizeParamEntries = (params = {}) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right));
};

const serializeParams = (params = {}) => {
  const entries = normalizeParamEntries(params);
  if (entries.length === 0) {
    return 'all';
  }

  return entries
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('&');
};

const itemsList = (params = {}) => {
  return `${ITEMS_NAMESPACE}:list:${serializeParams(params)}`;
};

const itemDetail = (id) => {
  return `${ITEMS_NAMESPACE}:detail:${id}`;
};

const stats = () => {
  return `${ITEMS_NAMESPACE}:stats`;
};

const prefixes = {
  list: `${ITEMS_NAMESPACE}:list:`,
  detail: `${ITEMS_NAMESPACE}:detail:`
};

module.exports = {
  itemsList,
  itemDetail,
  stats,
  prefixes
};
