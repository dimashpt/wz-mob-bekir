import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { notificationSettingList } from '.';
import { settingKeys } from '../constants/keys';
import { ListNotificationSettingsResponse } from './types';

/**
 * Custom hook to fetch notification list.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - The request parameters.
 * @returns The query object containing notification list.
 * @template T - The type of data returned after selection (defaults to ListNotificationSettingsResponse).
 */
export function useSettingNotifications<T = ListNotificationSettingsResponse>(
  params: Omit<
    UseQueryOptions<ListNotificationSettingsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { user } = useAuthStore();

  const query = useQuery<ListNotificationSettingsResponse, Error, T>({
    ...params,
    queryKey: settingKeys.notifications(user?.id ?? 0),
    queryFn: () => notificationSettingList(user?.id ?? 0),
  });

  return query;
}
