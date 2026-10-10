import type {Config} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

function getPublicEnv(name: string): string | undefined {
  if (process.env[name] !== undefined) return process.env[name];

  try {
    const line = readFileSync(join(process.cwd(), '.env'), 'utf8')
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${name}=`));
    if (!line) return undefined;
    const value = line.slice(line.indexOf('=') + 1).trim();
    return value.replace(/^(['"])(.*)\1$/, '$2');
  } catch {
    return undefined;
  }
}

function getPublicApiBaseUrl(): string {
  const value = getPublicEnv('API_BASE_URL')?.trim();
  if (!value) return '';

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('API_BASE_URL must be an absolute HTTP(S) URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('API_BASE_URL must be a public HTTP(S) base URL without credentials, query, or fragment.');
  }
  return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
}

const config: Config = {
  title: 'Converge',
  tagline: '面向编程教育的教学认知状态引擎',
  // GitHub Pages project site: https://wrt-imp.github.io/converge/
  url: 'https://wrt-imp.github.io',
  baseUrl: '/converge/',
  trailingSlash: false,
  customFields: {
    // Only public connection settings are exposed to the browser bundle.
    apiBaseUrl: getPublicApiBaseUrl(),
    apiMock: getPublicEnv('API_MOCK')?.toLowerCase() === 'true',
    apiDebug: process.env.NODE_ENV !== 'production' && getPublicEnv('API_DEBUG')?.toLowerCase() === 'true',
  },
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Converge',
      items: [
        {to: '/product', label: '产品', position: 'left'},
        {to: '/docs', label: '文档', position: 'left'},
        {to: '/download', label: '下载', position: 'right'},
        {to: '/faq', label: '常见问题', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '产品',
          items: [
            {label: '产品', to: '/product'},
            {label: '下载', to: '/download'},
          ],
        },
        {
          title: '资源',
          items: [
            {label: '文档', to: '/docs'},
            {label: '常见问题', to: '/faq'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Converge`,
    },
  } satisfies ThemeConfig,
};

export default config;
