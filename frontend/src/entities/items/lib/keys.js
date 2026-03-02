export const itemsKeys = {
  all: ['items'],
  lists: () => [...itemsKeys.all, 'list'],
  list: (params) => [...itemsKeys.lists(), params || {}],
  details: () => [...itemsKeys.all, 'detail'],
  detail: (id) => [...itemsKeys.details(), id],
};

export default itemsKeys;
