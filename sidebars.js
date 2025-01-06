/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'sdk/getting-started/installation',
        'sdk/getting-started/adding-config',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'sdk/api/lmsystems-client',
        'sdk/api/purchased-graph'
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'sdk/examples/usage-examples',
        'sdk/examples/github-agent'
      ],
    }
  ],
};

module.exports = sidebars;