import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { gql, useQuery } from '@apollo/client';

import NotFound from './elements/NotFound';
import Title from './elements/Title';
import PageWidth from './elements/PageWidth';
import Loading from './elements/Loading';
import LoadingError from './elements/LoadingError';
import PostContent from './elements/PostContent';

import { FRONTEND_URL } from '../config';

import { ReactComponent as FolderIcon } from '../static/images/folder.svg';
import { ReactComponent as ClockIcon } from '../static/images/clock.svg';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const SINGLE_QUERY = gql`
  query SingleQuery($uri: String!) {
    pageBy(uri: $uri) {
      databaseId
      slug
      title
      content
      pageTemplate
      seo {
        title
        metaDesc
      }
    }
    postBy(uri: $uri) {
      databaseId
      slug
      title
      content
      dateFormatted
      seo {
        title
        metaDesc
      }
      categories(first: 5) {
        edges {
          node {
            databaseId
            slug
            name
          }
        }
      }
    }
  }
`;

const DefaultQuery = props => {
  const { loading, error, data } = useQuery(SINGLE_QUERY, { variables: { uri: props.match.url } });

  if (loading) return <Loading />;
  if (error) return <LoadingError error={error.message} />;

  if (data.pageBy || data.postBy) {
    return props.children(data.pageBy || data.postBy);
  }

  return <NotFound/>
}

const Single = ({ obj }) => (
  <>
    {obj.seo && (
      <Helmet>
        <title>{obj.seo.title}</title>
        <meta name="description" content={obj.seo.metaDesc}/>
        <link rel="canonical" href={`${FRONTEND_URL}/${obj.slug}`} />
      </Helmet>
    )}

    <article className={`content post-${obj.databaseId}`}>
      {
      !obj.dateFormatted && obj.title
      ? <Title>{obj.title}</Title>
      : <Title notHeading={true}>{obj.categories && obj.categories.edges ? obj.categories.edges[0].node.name : 'Blog'}</Title>
      }

      <PageWidth className="content--body">
        {obj.dateFormatted && (
          <>
            <h1 className="f2 fw4 mb4">{obj.title}</h1>

            <div className="post-meta mv4">
              <div className="posted dib mr4"><ClockIcon className="mr2 v-mid" width={20} height={20}/><span>{obj.dateFormatted}</span></div>

              <div className="post-categories dib">
                {obj.categories.edges && (
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
  </>
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
