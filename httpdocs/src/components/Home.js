import React from 'react';
import { Helmet } from "react-helmet";
import LazyLoad from 'react-lazy-load';
import { gql, useQuery } from '@apollo/client';

import Hero from './layout/Hero';
import { BlocksTwo, BlocksTwoFull } from './layout/Blocks';

import Image from './elements/Image';
import LeadForm from './elements/LeadForm';
import PostContent from './elements/PostContent';
import Button from './elements/Button';
import LoadingError from './elements/LoadingError';

import CyclingCards from './content/CyclingCards';
import TallCards from './content/TallCards';
import SingleCard from './content/SingleCard';
import LargeRow from './content/LargeRow';

const HOME_QUERY = gql`
  query HomeQuery {
    allSettings {
      generalSettingsTitle
      generalSettingsDescription
    }
    frontPage {
      title
      excerpt
      seo {
        title
        metaDesc
      }
    }
  }
`;

const Skeleton = ({ children }) => (
  <div className="home--content mb0">
    <Hero
      background="data:null"
      className="bg-light-gray"
    />

    {children}

    <BlocksTwo
      left={(
        <>
          <div className="mb4 text-loading lines-6" />

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
            src="https://www.fillmurray.com/720/480"
            className="absolute-l absolute--fill-l h-100-l mw-none-l grow center db"
          />
        </div>
      )}
    />
  </div>
);

const OnQueryFinished = ({ hero, frontPage }) => (
  <>
    <Helmet>
      <title>{frontPage.seo.title}</title>
      <meta name="description" content={frontPage.seo.metaDesc}/>
    </Helmet>

    <div className="home--content mb0">
      <Hero
        heading={hero.title}
        subheading={hero.desc}
        cta={{text: 'Contact Today', link:'/contact-us'}}
      />

      <LazyLoad>
        <BlocksTwo
          left={(
            <>
              <PostContent className="mv4" content={frontPage.excerpt} />

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
                src="https://www.fillmurray.com/720/480"
                className="absolute-l absolute--fill-l h-100-l mw-none-l grow center db"
              />
            </div>
          )}
        />
      </LazyLoad>

      <LazyLoad>
        <BlocksTwoFull
          left={<SingleCard />}
          right={<CyclingCards />}
        />
      </LazyLoad>

      <LazyLoad>
        <TallCards/>
      </LazyLoad>

      <LargeRow />

      <div className="bg-silver pv5">
        <LeadForm className="mw6 bg-white pa4 center" />
      </div>
    </div>
  </>
);

export default () => {
  const { loading, error, data } = useQuery(HOME_QUERY);

  if (loading) return <Skeleton />
  if (error) return (
    <Skeleton>
      <LoadingError error={error.message} />
    </Skeleton>
  );

  const hero = {
    title: data.allSettings.generalSettingsTitle,
    desc: data.allSettings.generalSettingsDescription
  }

  return <OnQueryFinished  hero={hero} frontPage={data.frontPage} />
}
