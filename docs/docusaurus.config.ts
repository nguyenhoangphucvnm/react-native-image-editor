import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Native Image Editor',
  tagline:
    'Native crop, draw, text & stickers for iOS and Android — New Architecture ready.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://nguyenhoangphucvnm.github.io',
  baseUrl: '/react-native-image-editor/',

  organizationName: 'nguyenhoangphucvnm',
  projectName: 'react-native-image-editor',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/nguyenhoangphucvnm/react-native-image-editor/edit/master/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'new-arch',
      content:
        '🚀 <strong>v1.0.4</strong> — Now with React Native <strong>New Architecture</strong> (TurboModules + Fabric) support! <a href="/react-native-image-editor/docs/architecture">Learn more →</a>',
      backgroundColor: '#20232a',
      textColor: '#61dafb',
      isCloseable: true,
    },
    navbar: {
      title: 'RN Image Editor',
      logo: {
        alt: 'React Native Image Editor Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://www.npmjs.com/package/@phucprime/react-native-image-editor',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/nguyenhoangphucvnm/react-native-image-editor',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Getting Started',
          items: [
            { label: 'Installation', to: '/docs/getting-started' },
            { label: 'iOS Setup', to: '/docs/installation/ios' },
            { label: 'Android Setup', to: '/docs/installation/android' },
          ],
        },
        {
          title: 'API Reference',
          items: [
            { label: 'ImageEditor', to: '/docs/api/image-editor' },
            { label: 'Types', to: '/docs/api/types' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'Stickers', to: '/docs/guides/stickers' },
            { label: 'Localization', to: '/docs/guides/localization' },
            { label: 'Hidden Controls', to: '/docs/guides/hidden-controls' },
            { label: 'File Paths', to: '/docs/guides/file-paths' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Architecture', to: '/docs/architecture' },
            { label: 'Changelog', to: '/docs/changelog' },
            { label: 'Troubleshooting', to: '/docs/troubleshooting' },
            {
              label: 'GitHub',
              href: 'https://github.com/nguyenhoangphucvnm/react-native-image-editor',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@phucprime/react-native-image-editor',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} nguyenhoangphucvnm. Licensed under Apache 2.0. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'swift', 'ruby', 'groovy'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
