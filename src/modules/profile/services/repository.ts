import { useEffect } from 'react';

import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { USER_ENDPOINTS } from '../constants/endpoints';
import * as UserService from './index';
import { ProfileResponse } from './types';

type UserQuery = Omit<
  Partial<
    DefinedInitialDataOptions<
      ProfileResponse,
      Error,
      ProfileResponse,
      readonly unknown[]
    >
  >,
  'queryKey' | 'queryFn'
>;

/**
 * Custom hook to fetch profile information.
 * @param params - Optional parameters for the query.
 * @returns The query object containing profile information.
 */
export function useProfileQuery(
  params: UserQuery = {},
): UseQueryResult<ProfileResponse, Error> {
  const query = useQuery({
    ...params,
    queryKey: [USER_ENDPOINTS.PROFILE],
    queryFn: UserService.getProfile,
  });
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Always update the user info in the auth store when the query data changes
    if (query.data) {
      setUser(query.data.user);
    }
  }, [query.data]);

  return query;
}
