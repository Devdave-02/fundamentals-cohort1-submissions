import { useQuery } from '@tanstack/react-query';
import * as userApi from '../api/users.api';

/**
 * Custom hook to fetch a paginated list of users.
 * @param {number} page - The page number.
 * @param {number} limit - The number of items per page.
 */
export const useGetUsers = (page, limit) => {
  return useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => userApi.getUsers(page, limit),
    keepPreviousData: true, // Essential for a smooth pagination experience
  });
};

/**
 * Custom hook to fetch a single user by ID.
 * @param {string} id - The user's ID.
 */
export const useGetUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id, // Only run the query if the id is provided
  });
};
