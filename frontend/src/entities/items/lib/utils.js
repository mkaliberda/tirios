export const buildItemsQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set('q', String(params.q));
  }

  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  return searchParams.toString();
};

export const fn = (styles = {}) => styles;
