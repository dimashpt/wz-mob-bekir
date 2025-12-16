/**
 * ==========================================
 * AUTH SERVICE FUNCTIONS
 * ==========================================
 */

import { API } from '@/lib/axios';
import { CHAT_ENDPOINTS } from '../../constants/endpoints';
import { ChatLoginPayload, ChatLoginResponse } from './types';

/**
 * Login to Chat
 */
export async function login(
  payload: ChatLoginPayload,
): Promise<ChatLoginResponse> {
  const response = await API.post<ChatLoginResponse>(
    CHAT_ENDPOINTS.LOGIN,
    payload,
    { baseURL: process.env.EXPO_PUBLIC_CHAT_BASE_URL },
  );

  return response.data;
}

export * from './types';
