import React from 'react';
import { Helmet } from "react-helmet";
import LazyLoad from 'react-lazy-load';
import { gql, useQuery } from '@apollo/client';

import Hero, { HeroSkeleton } from './elements/Hero';
import { BlocksTwo, BlocksTwoFull } from './elements/Blocks';
import Image from './elements/Image';
import LeadForm from './elements/LeadForm';
import PostContent from './elements/PostContent';
import Button from './elements/Button';
import PageWidth from './elements/PageWidth';
import LoadingError from './elements/LoadingError';

import CyclingCards from './posts/CyclingCards';
import TallCards from './posts/TallCards';
import SingleCard from './posts/SingleCard';
import LargeRow from './posts/LargeRow';

const HOME_QUERY = gql`
  query HomeQuery {
    allSettings {
      generalSettingsTitle
      generalSettingsDescription
    }
    frontPage {
      id
      title
      excerpt
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
    <HeroSkeleton />

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

const OnQueryFinished = ({ hero, frontPage }) => (
  <div className="home">
    {frontPage.seo && (
      <Helmet>
        <title>{frontPage.seo.title}</title>
        <meta name="description" content={frontPage.seo.metaDesc}/>
      </Helmet>
    )}

    <Hero
      heading={hero.title}
      subheading={hero.desc}
      cta={{text: 'Contact Today', link:'/contact-us'}}
    />

    <LazyLoad>
      <BlocksTwo
        className="mv4"
        left={(
          <>
            <PostContent className="mb4" content={frontPage.excerpt} />

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

    <LazyLoad>
      <BlocksTwoFull
        className="mv4"
        left={<SingleCard />}
        right={<CyclingCards />}
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
  if (error) return (
    <Skeleton>
      <LoadingError error={error.message} />
    </Skeleton>
  );

  if (!data.frontPage) return (
    <Skeleton>
      <LoadingError error="Unable to get data." />
    </Skeleton>
  );

  const hero = {
    title: data.allSettings.generalSettingsTitle,
    desc: data.allSettings.generalSettingsDescription
  }

  return <OnQueryFinished  hero={hero} frontPage={data.frontPage} />
}
