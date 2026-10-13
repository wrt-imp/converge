import type {Config} from '@docusaurus/types';
import type {Options, ThemeConfig} from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Converge',
  tagline: '面向编程教育的教学认知状态引擎',
  url: 'https://converge.example.com',
  baseUrl: '/',
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
        {to: '/architecture', label: '架构', position: 'left'},
        {to: '/developers', label: '开发者', position: 'left'},
        {to: '/docs', label: '文档', position: 'left'},
        {to: '/download', label: '下载', position: 'right'},
        {href: 'https://github.com/baibinggyu/Multi-Agent', label: 'GitHub ↗', position: 'right', target: '_blank', rel: 'noreferrer'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '产品',
          items: [
            {label: '产品', to: '/product'},
            {label: '系统架构', to: '/architecture'},
            {label: '下载与安装', to: '/download'},
          ],
        },
        {
          title: '资源',
          items: [
            {label: '开发者入口', to: '/developers'},
            {label: '文档', to: '/docs'},
            {label: '常见问题', to: '/faq'},
            {label: '社区与贡献', to: '/community'},
          ],
        },
        {
          title: '项目',
          items: [
            {label: 'GitHub 源码', href: 'https://github.com/baibinggyu/Multi-Agent'},
            {label: 'GitHub Issues', href: 'https://github.com/baibinggyu/Multi-Agent/issues'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Converge`,
    },
  } satisfies ThemeConfig,
};

export default config;
