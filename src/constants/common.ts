import { applicationId } from 'expo-application';

export const IS_PRODUCTION = applicationId === 'com.lobataros.app' && !__DEV__;
