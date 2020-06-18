import React from 'react';
import { Helmet } from "react-helmet";
import LazyLoad from 'react-lazy-load';
import { gql, useQuery } from '@apollo/client';

import { BlocksTwo, BlocksTwoFull } from './elements/Blocks';
import Button from './elements/Button';
import CyclingCards from './posts/CyclingCards';
import Hero from './elements/Hero';
import Image from './elements/Image';
import LargeRow from './posts/LargeRow';
import LeadForm from './elements/LeadForm';
import LoadingError from './elements/LoadingError';
import PageWidth from './elements/PageWidth';
import PostContent from './elements/PostContent';
import SingleCard from './posts/SingleCard';
import TallCards from './posts/TallCards';

const HOME_QUERY = gql`
  query HomeQuery {
    frontPage {
      id
      title
      content
      seo {
        title
        metaDesc
      }
    }
  }
`;

const Random = () => {
  let items = [40, 50, 60, 70, 80];
  return items[Math.floor(Math.random() * items.length)]
}

const Skeleton = ({ children }) => (
  <div className="home">
    <Hero />

    <PageWidth className="mv4">
      {children}
    </PageWidth>

    <BlocksTwo
      left={(
        <>
          <div className="mb4">
            <div className={`mb2 h1 w-${Random()} loading-block`} />
            <div className={`mb2 h1 w-${Random()} loading-block`} />
            <div className={`mb2 h1 w-${Random()} loading-block`} />
            <div className={`mb2 h1 w-${Random()} loading-block`} />
          </div>

          <Button className="mr3" to="/contact-us">
            Make an Appointment
          </Button>

          <Button type={3} to="/about-us">
            Learn More
          </Button>
        </>
      )}
      right={(
        <div className="relative overflow-hidden w-100 h-100">
          <Image
            width={720}
            height={480}
            className="absolute-l absolute--fill-l mw-none-l grow center db"
          />
        </div>
      )}
    />
  </div>
);

const OnQueryFinished = ({ seo, content }) => (
  <div className="home">
    {seo && (
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.metaDesc}/>
      </Helmet>
    )}

    <Hero
      cta={{text: 'Contact Today', link:'/contact-us'}}
    />

    {content && (
      <LazyLoad>
        <BlocksTwo
          className="mv4"
          left={(
            <>
              <PostContent className="mb4" content={content} />

              <Button className="mr3" to="/contact-us">
                Make an Appointment
              </Button>

              <Button type={3} to="/about-us">
                Learn More
              </Button>
            </>
          )}
          right={(
            <div className="relative overflow-hidden w-100 h-100">
              <Image
                width={720}
                height={480}
                className="absolute-l absolute--fill-l mw-none-l grow center db"
              />
            </div>
          )}
        />
      </LazyLoad>
    )}

    <LazyLoad>
      <BlocksTwoFull
        className="mv4"
        left={(
          <SingleCard
            heading="Coverage That Meets Your Needs"
            subheading="We Provide The Best Service Hands Down"
          />
        )}
        right={(
          <CyclingCards
            heading="Our Company Advantage"
          />
        )}
      />
    </LazyLoad>

    <LazyLoad>
      <TallCards />
    </LazyLoad>

    <div className="mv4">
      <LargeRow className="vh-50-l w-100 mw9 center" />
    </div>

    <div className="bg-silver pv5">
      <LeadForm className="mw6 bg-white pa4 center" />
    </div>
  </div>
);

export default () => {
  const { loading, error, data } = useQuery(HOME_QUERY);

  if (loading) return <Skeleton />
  if (error) {
    return (
      <Skeleton>
        <LoadingError error={error.message} />
      </Skeleton>
    );
  }

  if (!data?.frontPage) {
    return (
      <Skeleton>
        <LoadingError error="Unable to get data." />
      </Skeleton>
    );
  }

  const hero = {
    title: data?.allSettings?.generalSettingsTitle,
    desc: data?.allSettings?.generalSettingsDescription
  }

  return (
    <OnQueryFinished
      hero={hero}
      seo={data?.frontPage?.seo}
      content={data?.frontPage?.content}
    />
  );
}
