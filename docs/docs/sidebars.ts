import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: '🚀 Getting Started',
    },
    {
      type: 'category',
      label: '📦 Installation',
      collapsed: false,
      items: [
        'installation/ios',
        'installation/android',
      ],
    },
    {
      type: 'category',
      label: '📖 Guides',
      collapsed: false,
      items: [
        'guides/stickers',
        'guides/localization',
        'guides/hidden-controls',
        'guides/file-paths',
      ],
    },
    {
      type: 'doc',
      id: 'architecture',
      label: '🏗️ Architecture',
    },
    {
      type: 'doc',
      id: 'troubleshooting',
      label: '🔧 Troubleshooting',
    },
    {
      type: 'doc',
      id: 'changelog',
      label: '📝 Changelog',
    },
  ],

  apiSidebar: [
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/image-editor',
        'api/types',
      ],
    },
  ],
};

export default sidebars;
