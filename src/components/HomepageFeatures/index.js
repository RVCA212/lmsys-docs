import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Build AI applications quickly by integrating pre-built marketplace graphs
        with just a few lines of code.
      </>
    ),
  },
  {
    title: 'Flexible Integration',
    description: (
      <>
        Use graphs as standalone services or integrate them as subgraphs in your
        Langgraph applications.
      </>
    ),
  },
  {
    title: 'Production Ready',
    description: (
      <>
        Built-in support for authentication, state management, and streaming
        responses for production deployments.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}