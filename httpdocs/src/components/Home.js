import React from 'react';
import { Helmet } from "react-helmet";
import LazyLoad from 'react-lazy-load';
import { gql, useQuery } from '@apollo/client';

import Hero from './elements/Hero';
import HomepageRow from './elements/HomepageRow';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';

const HOME_QUERY = gql`
  query PostsQuery {
    frontPage {
      title
      content
      seo {
        title
        metaDesc
      }
    }
    posts(first: 8, where: {status: PUBLISH}) {
      edges {
        node {
          title
          categories(first: 1) {
            nodes {
              slug
              name
            }
          }
          featuredImage {
            sourceUrl(size: MEDIUM_LARGE)
          }
          slug
          postId
          id
        }
      }
    }
  }
`;

const StaticContent = ({ children, posts }) => {
  let items = [];
  let type = 1;
  let current_type;
  let key;

  if (posts) {
    posts.map((post, index) => {
      if (index % 2 === 0) {
        items.push([post]);
      } else {
        items[items.length - 1].push(post);
      }

      return null;
    });
  }

  return (
    <div className="home--content mb0">
      <Hero>
        {children}
      </Hero>

      <div className="home--rows">
        {items.map(itm => {
          current_type = type;
          type = type === 2 ? 1 : 2;
          key = '';

          itm.map(i => {
            key += i.node.id.toString();
            return null;
          });

          return (
            <LazyLoad key={key}>
              <HomepageRow items={itm} type={current_type}/>
            </LazyLoad>
          );
        })}
      </div>
    </div>
  );
}

const OnQueryFinished = ({ frontPage, posts }) => (
  <>
    <Helmet>
      <title>{frontPage.seo.title}</title>
      <meta name="description" content={frontPage.seo.metaDesc}/>
    </Helmet>
    <StaticContent posts={posts}>
      {frontPage.seo.title}
    </StaticContent>
  </>
);

export default () => {
  const { loading, error, data } = useQuery(HOME_QUERY);

  if (loading) return (
    <StaticContent>
      <Loading />
    </StaticContent>
  );
  if (error) return <LoadingError error={error.message} />

  let posts = [];
  if (data.posts.edges) {
    data.posts.edges.map(post => {
      const finalLink = `/blog/${post.node.slug}`;
      let modifiedPost = {node:{}};
      Object.entries(post.node).map(([key, value]) => {
        modifiedPost.node[key] = value;

        return null;
      });
      modifiedPost.node.link = finalLink;
      posts.push(modifiedPost);

      return null;
    });
  }

  return <OnQueryFinished frontPage={data.frontPage} posts={posts} />
}
