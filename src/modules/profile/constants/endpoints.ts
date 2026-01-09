const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL + '/api/v1';

export const profileEndpoints = {
  profile: '/auth/v1/me',
  chatProfile: `${CHAT_BASE_URL}/profile`,
  availability: `${CHAT_BASE_URL}/profile/availability`,
} as const;
