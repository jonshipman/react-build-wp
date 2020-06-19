import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { gql, useQuery } from '@apollo/client';

import { FRONTEND_URL } from '../config';
import { ReactComponent as ClockIcon } from '../static/images/clock.svg';
import { ReactComponent as FolderIcon } from '../static/images/folder.svg';
import LoadingError from './elements/LoadingError';
import NotFound from './elements/NotFound';
import PageSkeleton from './elements/PageSkeleton';
import PageWidth from './elements/PageWidth';
import PostContent from './elements/PostContent';
import Title from './elements/Title';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const SINGLE_QUERY = gql`
  query SingleQuery($uri: String!) {
    getPostOrPageByUri(uri: $uri) {
      id
      databaseId
      slug
      title
      content
      pageTemplate
      dateFormatted
      postType
      categories(first: 5) {
        edges {
          node {
            id
            databaseId
            slug
            name
          }
        }
      }
      seo {
        title
        metaDesc
      }
    }
  }
`;

const DefaultQuery = props => {
  const { url: uri } = props.match;
  const { loading, error, data } = useQuery(SINGLE_QUERY, { variables: { uri } });

  if (loading) return <PageSkeleton />;
  if (error) return <LoadingError error={error.message} />;

  if (data.getPostOrPageByUri) {
    return props.children(data.getPostOrPageByUri);
  }

  return <NotFound/>
}

const Single = ({ obj }) => (
  <article className={`single post-${obj.databaseId}`}>
    {obj.seo && (
      <Helmet>
        <title>{obj.seo.title}</title>
        <meta name="description" content={obj.seo.metaDesc}/>
        <link rel="canonical" href={`${FRONTEND_URL}/${obj.slug}`} />
      </Helmet>
    )}

    {
    'page' !== obj.postType
    ? <Title notHeading={true}>{obj?.categories?.edges?.length ? obj.categories.edges[0].node.name : 'Blog'}</Title>
    : <Title>{obj?.title}</Title>
    }

    <PageWidth className="mt4">
      {'page' !== obj.postType && (
        <>
          <h1 className="f2 fw4 mb4">{obj.title}</h1>

          <div className="post-meta mv4">
            <div className="posted dib mr4"><ClockIcon className="mr2 v-mid" width={20} height={20}/><span>{obj.dateFormatted}</span></div>

            <div className="post-categories dib">
              {obj?.categories?.edges?.length > 1 && (
                <>
                  <FolderIcon className="mr2 v-mid" width={20} height={20}/>
                  <ul className="list pl0 dib">
                    {obj.categories.edges.map(category => (
                      <li key={`cat-${category.node.databaseId}-post-cats`} className="dib mr2 pr2 br b--near-white drop-last-br">
                        <Link to={`/blog/${category.node.slug}`}>
                          {category.node.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <PostContent content={obj.content}/>
    </PageWidth>
  </article>
);

export default props => {
  const { match } = props;

  const Query = props.query || DefaultQuery;

  return (
    <Query match={match}>
      {obj => <Single obj={obj} />}
    </Query>
  );
}
