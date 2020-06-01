import React from 'react';

import PageWidth from './PageWidth';
import Title from './Title';

const Random = () => {
  let items = [40, 50, 60, 70, 80];
  return items[Math.floor(Math.random() * items.length)]
}

export default ({ className, ...props }) => (
  <article className={`content loading-skeleton ${className || ''}`} { ...props } >
    <Title notHeading={true}>
      <div className="loading-block h1 w5 o-50" />
    </Title>

    <PageWidth className="content--body">
      <div className="loading-block h1 w-100 mt4 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className={`loading-block h1 w-${Random()} mb4`} />

      <div className="loading-block h1 w-100 mt4 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className={`loading-block h1 w-${Random()} mb4`} />

      <div className="loading-block h1 w-100 mt4 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className="loading-block h1 w-100 mb3" />
      <div className={`loading-block h1 w-${Random()} mb4`} />
    </PageWidth>
  </article>
);
