import { useEffect } from 'react';

import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { USER_ENDPOINTS } from '@/constants/endpoints';
import { useAuthStore } from '@/store';
import * as UserService from './index';
import { User } from './types';

type UserQuery = Omit<
  Partial<DefinedInitialDataOptions<User, Error, User, readonly unknown[]>>,
  'queryKey' | 'queryFn'
>;

/**
 * Custom hook to fetch user information.
 * @param params - Optional parameters for the query.
 * @returns The query object containing user information.
 */
export function useUserQuery(
  params: UserQuery = {},
): UseQueryResult<User, Error> {
  const query = useQuery<User>({
    ...params,
    queryKey: [USER_ENDPOINTS.GET_USER],
    queryFn: UserService.getUser,
  });
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Always update the user info in the auth store when the query data changes
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data]);

  return query;
}
