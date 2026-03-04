export const itemsKeys = {
  all: ['items'],
  lists: () => [...itemsKeys.all, 'list'],
  list: (params) => [...itemsKeys.lists(), params || {}],
  stats: () => [...itemsKeys.all, 'stats'],
  stat: (params) => [...itemsKeys.stats(), params || {}],
  details: () => [...itemsKeys.all, 'detail'],
  detail: (id) => [...itemsKeys.details(), id],
};

export default itemsKeys;
