import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { PlacholderUrl } from './Image';
import Button from './Button';
import LoadingError from './LoadingError';

const HERO_QUERY = gql`
  query HeroQuery {
    allSettings {
      generalSettingsTitle
      generalSettingsDescription
    }
  }
`;

const cssClasses = [
  'hero cover bg-left bg-center-l relative z-1 overflow-hidden bg-light-gray',
  'tc-l vh-75 flex items-center ph4',
  'relative z-1 w-100',
]

const Skeleton = ({ className, error, loading, ...props }) => (
  <div className={`${cssClasses[0]} ${className || ''}`} { ...props } >
    <div className={cssClasses[1]}>
      <div className={cssClasses[2]}>
          <div className="f2 f1-l fw2 white-90 mb0 mt4 h2 w-20 center loading-block" />
          <div className="fw1 f3 white-80 mt3 mb4 h1 w-40 center loading-block" />

          <Button className="v-mid h2" />
      </div>
    </div>
  </div>
);

const OnQueryFinished = props => {
  const { loading, error, className, heading, subheading, cta, secondaryCta, background } = props;

  if (loading) return <Skeleton { ...props } />
  if (error) return <LoadingError error={error.message} />

  return (
    <div className={`${cssClasses[0]} ${className || ''}`} style={{backgroundImage: `url(${background || PlacholderUrl({ width: 1920, height: 600 })})`}}>
      <div className={cssClasses[1]}>
        <div className={cssClasses[2]}>
          {heading && (
            <h1 className="f2 f1-l fw2 white-90 mb0 lh-title text-shadow">{heading}</h1>
          )}
          {subheading && (
            <h2 className="fw1 f3 white-80 mt3 mb4 text-shadow">{subheading}</h2>
          )}

          {cta && (
            <Button to={cta.link} className="v-mid">
              {cta.text}
            </Button>
          )}

          {secondaryCta && (
            <>
              <span className="dib v-mid ph3 white-70 mb3">or</span>
              <Button to={secondaryCta.link} type={2} className="v-mid">
                {secondaryCta.text}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DefaultQuery = ({ children, ...props }) => {
  const { loading, error, data } = useQuery(HERO_QUERY);

  const passedProps = {
    heading: data?.allSettings?.generalSettingsTitle,
    subheading: data?.allSettings?.generalSettingsDescription,
    loading,
    error,
    ...props,
  };

  return children(passedProps);
}

export default ({ query, ...props }) => {
  const LocalQuery = query || DefaultQuery;

  return (
    <LocalQuery { ...props } >
      {passedProps => (
        <OnQueryFinished { ...passedProps } />
      )}
    </LocalQuery>
  );
}
