import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';

import { PlacholderUrl } from '../elements/Image';

const QUERY = gql`
  query RowQuery {
    posts(first: 8, where: {status: PUBLISH, hasPassword: false}) {
      edges {
        node {
          id
          slug
          title
          uri
          featuredImage {
            node {
              sourceUrl(size: LARGE)
            }
          }
        }
      }
    }
  }
`;

const Row = ({ className, items, count }) => {
  const base = "fl-l w-100 pa3 relative z-1 h5 h-100-l";
  const variant1 = `${base} w-40-l`;
  const variant2 = `${base} w-60-l`;

  let variant;
  let background;

  return (
    <LazyLoad>
      <div className={`alternating-rows ${className || 'h5-l'}`}>
        <div className="cf tracked ttu h-100-l">
          {items.map((item, index) => {
            variant = count % 2 === 0 ? variant2 : variant1;
            variant = index > 0 ? count % 2 === 0 ? variant1 : variant2 : variant;

            background = item?.node?.featuredImage?.node?.sourceUrl || PlacholderUrl({ width: 800, height: 500 });

            return (
              <div className={variant} key={item.node.id}>
                <div className="w-100 h-100-l over bg-center relative z-1" style={{backgroundImage: `url(${background})`}}>
                  <div className="post-title white f4 absolute z-1 bottom-0 left-0 w-100 text-shadow pa2 pl3">{item.node.title}</div>
                  <Link to={item.node.uri} className="large-link db absolute absolute--fill z-2"/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LazyLoad>
  );
}

const OnQueryFinished = ({ posts, ...props }) => {
  let items = [];
  let count = 1;

  if (posts?.edges?.length > 0) {
    posts.edges.map((post, index) => {
      if (index % 2 === 0) {
        items.push([post]);
      } else {
        items[items.length - 1].push(post);
      }

      return null;
    });

    return items?.length > 0 && items.map(item => <Row count={count++} items={item} key={`hr-${item[0].node.id}`} { ...props } />);
  }

  return null;
}

export default props => {
  const { data } = useQuery(QUERY, { errorPolicy: 'all' });

  return <OnQueryFinished posts={data?.posts} { ...props } />
}
