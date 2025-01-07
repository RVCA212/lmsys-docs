// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LMSystems SDK',
  tagline: 'Build powerful AI applications with LMSystems marketplace graphs',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.lmsystems.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'LMSystems-ai',
  projectName: 'lmsystems-sdk',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/LMSystems-ai/lmsystems-sdk/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/lmsystems-social-card.jpg',
      navbar: {
        title: 'LMSystems SDK',
        logo: {
          alt: 'LMSystems Logo',
          src: 'img/logo.png',
          srcDark: 'img/logo.png',
          width: 200,
          height: 40,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://colab.research.google.com/drive/18IGOYcnN_CZSuH6RBwIjeXq9zMMs59OQ?usp=sharing',
            label: 'Try in Colab',
            position: 'right',
          },
          {
            href: 'https://github.com/RVCA212/lmsys-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.lmsystems.ai/marketplace',
            label: 'Marketplace',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/sdk/getting-started/installation',
              },
              {
                label: 'API Reference',
                to: '/docs/sdk/api/lmsystems-client',
              },
              {
                label: 'Examples',
                to: '/docs/sdk/examples/github-agent',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://x.com/LM_SYS',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/LMSystems-ai/lmsystems-sdk',
              },
              {
                label: 'Marketplace',
                href: 'https://www.lmsystems.ai',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LMSystems, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;