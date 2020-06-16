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
          categories(first: 1) {
            nodes {
              slug
              name
            }
          }
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

const Row = ({ items, count }) => {
  const base = "fl-l w-100 pa3 relative z-1 h-100";
  const variant1 = `${base} w-40-l`;
  const variant2 = `${base} w-60-l`;

  let variant;
  let background;

  return (
    <LazyLoad>
      <div className="alternating-rows vh-50 w-100 mw9 center">
        <div className="alternating-rows--inner cf tracked ttu h-100">
          {items.map((item, index) => {
            variant = count % 2 === 0 ? variant2 : variant1;
            variant = index > 0 ? count % 2 === 0 ? variant1 : variant2 : variant;

            background = item.node.featuredImage ? item.node.featuredImage.sourceUrl : PlacholderUrl({ width: 800, height: 500 });

            return (
              <div className={variant} key={item.node.id}>
                <div className="cell--inner w-100 cover bg-center h-100 relative z-1" style={{backgroundImage: `url(${background})`}}>
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

const OnQueryFinished = ({ posts }) => {
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

    return items.map(item => <Row count={count++} items={item} key={`hr-${JSON.stringify(item)}`}  />);
  }

  return null;
}

export default () => {
  const { data } = useQuery(QUERY, { errorPolicy: 'all' });

  return <OnQueryFinished posts={data?.posts} />
}
