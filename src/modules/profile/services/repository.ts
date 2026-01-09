import { useEffect } from 'react';

import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { profileKeys } from '../constants/keys';
import * as UserService from './index';
import { getChatProfile } from './index';
import { ChatProfileResponse, ProfileResponse } from './types';

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
    queryKey: profileKeys.profile,
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

/**
 * Custom hook to fetch the chat profile for the given account.
 * @param queryOptions - Optional parameters for the query.
 * @returns The query object containing the chat profile.
 */
export function useChatProfileQuery(
  queryOptions: Omit<
    UseQueryOptions<ChatProfileResponse, Error>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<ChatProfileResponse, Error> {
  const query = useQuery({
    ...queryOptions,
    queryKey: profileKeys.chatProfile,
    queryFn: getChatProfile,
  });

  return query;
}
