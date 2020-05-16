import React from 'react';

import PageWidth from '../layout/PageWidth';
import Title from '../layout/Title';

export default props => (
  <article className="content loading-skeleton">
    <Title />

    <PageWidth className="content--body">
      <div className=" text-loading lines-12 mv4" />
      <div className=" text-loading lines-6 mv4" />
    </PageWidth>
  </article>
);
