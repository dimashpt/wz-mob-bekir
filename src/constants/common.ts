import { applicationId } from 'expo-application';

export const IS_PRODUCTION = applicationId === 'com.bebaschat.app' && !__DEV__;
