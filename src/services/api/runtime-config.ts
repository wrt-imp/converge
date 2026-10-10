import siteConfig from '@generated/docusaurus.config';

interface PublicApiConfig {
  apiMock?: boolean;
}

const publicApiConfig = siteConfig.customFields as PublicApiConfig;

export const useApiMock = publicApiConfig.apiMock === true;
