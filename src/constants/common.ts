import { applicationId } from 'expo-application';

export const IS_PRODUCTION =
  applicationId === 'com.bebaskirim.dashboard' && !__DEV__;
