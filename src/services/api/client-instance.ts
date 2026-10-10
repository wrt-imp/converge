import siteConfig from '@generated/docusaurus.config';
import {getStoredToken} from '../auth/token-store';
import {createApiClient} from './client';

interface PublicApiConfig {
  apiBaseUrl?: string;
  apiDebug?: boolean;
}

const publicApiConfig = siteConfig.customFields as PublicApiConfig;

export const apiClient = createApiClient({
  baseUrl: publicApiConfig.apiBaseUrl ?? '',
  getToken: getStoredToken,
  debug: publicApiConfig.apiDebug === true,
  requireBaseUrl: true,
});
