const fetchJSON = async (url, options = {}) => {
  const { errorMessage = 'Request failed', ...requestOptions } = options;
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default fetchJSON;
