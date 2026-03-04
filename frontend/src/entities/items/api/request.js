import { buildItemsQueryString } from '../lib/utils';
import buildApiUrl from '../../../shared/api/build-api-url';
import fetchJSON from '../../../shared/api/fetch-json';

export const fetchItems = async (params = {}) => {
  const query = buildItemsQueryString(params);
  const url = query ? buildApiUrl(`/api/items?${query}`) : buildApiUrl('/api/items');
  return fetchJSON(url, { errorMessage: 'Failed to fetch items' });
};

export const fetchStats = async () => {
  return fetchJSON(buildApiUrl('/api/stats/'), { errorMessage: 'Failed to fetch stats' });
};

export const fetchItemById = async (id) => {
  return fetchJSON(buildApiUrl(`/api/items/${id}`), {
    errorMessage: 'Failed to fetch item',
  });
};
