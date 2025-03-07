import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'edd'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '72b'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'bd5'),
            routes: [
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/mcp/intro',
                component: ComponentCreator('/docs/mcp/intro', '441'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/api/lmsystems-client',
                component: ComponentCreator('/docs/sdk/api/lmsystems-client', 'e0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/api/purchased-graph',
                component: ComponentCreator('/docs/sdk/api/purchased-graph', 'f17'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/examples/usage-examples',
                component: ComponentCreator('/docs/sdk/examples/usage-examples', '589'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/getting-started/adding-config',
                component: ComponentCreator('/docs/sdk/getting-started/adding-config', '2c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/getting-started/installation',
                component: ComponentCreator('/docs/sdk/getting-started/installation', '565'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/graphs/exa-search-agent',
                component: ComponentCreator('/docs/sdk/graphs/exa-search-agent', '3e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/graphs/github-agent',
                component: ComponentCreator('/docs/sdk/graphs/github-agent', 'da7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/graphs/groq-research-agent',
                component: ComponentCreator('/docs/sdk/graphs/groq-research-agent', '01a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdk/graphs/json-llm-graph',
                component: ComponentCreator('/docs/sdk/graphs/json-llm-graph', 'a81'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
