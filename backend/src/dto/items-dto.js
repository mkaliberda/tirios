const createValidationError = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const toItemDTO = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  price: item.price
});

const toItemsListDTO = ({ items, page, limit, total, totalPages }) => ({
  items: items.map(toItemDTO),
  pagination: {
    page,
    limit,
    total,
    totalPages
  }
});

const toStatsDTO = ({ total, averagePrice }) => ({
  total: Number(total) || 0,
  averagePrice: Number(averagePrice) || 0
});

const toCreateItemInputDTO = (payload = {}) => {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const category = typeof payload.category === 'string' ? payload.category.trim() : '';
  const price = Number(payload.price);

  if (!name) {
    throw createValidationError('name is required');
  }

  if (!category) {
    throw createValidationError('category is required');
  }

  if (!Number.isFinite(price) || price < 0) {
    throw createValidationError('price must be a non-negative number');
  }

  return {
    name,
    category,
    price
  };
};

module.exports = {
  toItemDTO,
  toItemsListDTO,
  toStatsDTO,
  toCreateItemInputDTO
};
