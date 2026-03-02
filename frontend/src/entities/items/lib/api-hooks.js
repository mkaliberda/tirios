import { useQuery } from '@tanstack/react-query';
import { fetchItemById, fetchItems } from '../api/request';
import { itemsKeys } from './keys';

export const useItemsQuery = (params = {}, options = {}) => useQuery({
  queryKey: itemsKeys.list(params),
  queryFn: () => fetchItems(params),
  ...options,
});

export const useItemQuery = (id, options = {}) => useQuery({
  queryKey: itemsKeys.detail(id),
  queryFn: () => fetchItemById(id),
  enabled: Boolean(id),
  ...options,
});
