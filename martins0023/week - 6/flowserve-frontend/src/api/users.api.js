import apiClient from './apiClient';

/**
 * Fetches a paginated list of users.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{data: Array<object>, meta: object}>} The user data and pagination metadata.
 */
export const getUsers = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/users', {
    params: { page, limit },
  });
  // Our backend ApiResponse returns { data, meta }
  return { data: response.data, meta: response.meta };
};

/**
 * Fetches a single user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<object>} The user data.
 */
export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  // Our backend ApiResponse returns { data }
  return response.data;
};
