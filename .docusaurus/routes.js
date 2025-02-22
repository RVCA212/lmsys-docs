import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'ca2'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '3b5'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '888'),
            routes: [
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
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
