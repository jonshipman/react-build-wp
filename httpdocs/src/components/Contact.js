import React from 'react';
import { Helmet } from 'react-helmet';

import Title from './layout/Title';

import LeadForm from './elements/LeadForm';

import { FRONTEND_URL } from '../config';

/**
 * Contact page.
 */
export default () => (
  <>
    <Helmet>
      <title>Contact Us</title>
      <link rel="canonical" href={`${FRONTEND_URL}/contact-us`} />
    </Helmet>

    <article className={`content post-contact-us`}>
      <Title>Contact Us</Title>

      <div className="content--body bg-silver pv5">
        <LeadForm className="mw6 bg-white pa4 center" />
      </div>
    </article>
  </>
);