import React from 'react';

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, useQuery, gql } from '@apollo/client';
import { renderToStringWithData } from "@apollo/react-ssr";

import Config from '../../src/config';
import { FRONTEND_URL } from '../../src/config';

const SITEMAP_BASE_QUERY = gql`
  query SiteMapIndex {
    pages(first: 1, where: { status: PUBLISH, hasPassword: false }) {
      edges {
        node {
          id
          modified
        }
      }
    }
    posts(first: 1, where: { status: PUBLISH, hasPassword: false }) {
      edges {
        node {
          id
          modified
        }
      }
    }
    categories(first: 1, where: { hideEmpty: true }) {
      edges {
        node {
          id
          posts(first: 1, where: { status: PUBLISH, hasPassword: false }) {
            edges {
              node {
                id
                modified
              }
            }
          }
        }
      }
    }
  }
`;

const SITEMAP_PAGE_QUERY = gql`
  query SiteMapPages {
    pages(first: 9999, where: { status: PUBLISH, hasPassword: false }) {
      edges {
        node {
          id
          title
          modified
          uri
        }
      }
    }
  }
`;


const SITEMAP_POST_QUERY = gql`
  query SiteMapPosts {
    posts(first: 9999, where: { status: PUBLISH, hasPassword: false }) {
      edges {
        node {
          id
          title
          modified
          uri
        }
      }
    }
  }
`;

const SITEMAP_CAT_QUERY = gql`
  query SiteMapCategories {
    categories(first: 999, where: { hideEmpty: true }) {
      edges {
        node {
          id
          uri
          posts(first: 1, where: { status: PUBLISH, hasPassword: false }) {
            edges {
              node {
                id
                modified
              }
            }
          }
        }
      }
    }
  }
`;

const SitemapIndex = ({ children, ...props }) => React.createElement('sitemapindex', props, children);
const SitemapTag   = ({ children, ...props }) => React.createElement('sitemap', props, children);
const UrlSet       = ({ children, ...props }) => React.createElement('urlset', props, children);
const Url          = ({ children, ...props }) => React.createElement('url', props, children);
const Loc          = ({ children, ...props }) => React.createElement('loc', props, children);
const LastMod      = ({ children, ...props }) => React.createElement('lastmod', props, children);
const Priority     = ({ children, ...props }) => React.createElement('priority', props, children);

const Sitemap = ({ host, query, type }) => {
  const { loading, error, data } = useQuery(query);

  if (loading) return null;
  if (error) return null;

  if (!type) {
    const pages = data.pages.edges && data.pages.edges.length;
    const posts = data.posts.edges && data.posts.edges.length;
    const categories = data.categories.edges && data.categories.edges.length && data.categories.edges[0].node.posts.edges && data.categories.edges[0].node.posts.edges.length;

    return (
      <SitemapIndex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        {posts ? (
          <SitemapTag>
            <Loc>{`${host}/post-sitemap.xml`}</Loc>
            <LastMod>{data.posts.edges[0].node.modified}</LastMod>
          </SitemapTag>
        ) : null}
        {pages ? (
          <SitemapTag>
            <Loc>{`${host}/page-sitemap.xml`}</Loc>
            <LastMod>{data.pages.edges[0].node.modified}</LastMod>
          </SitemapTag>
        ) : null}
        {categories ? (
          <SitemapTag>
            <Loc>{`${host}/category-sitemap.xml`}</Loc>
            <LastMod>{data.categories.edges[0].node.posts.edges[0].node.modified}</LastMod>
          </SitemapTag>
        ) : null}
      </SitemapIndex>
    );
  } else {
    return (
      <UrlSet xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        {data[type] && data[type].edges && data[type].edges.length && (
          data[type].edges.map(obj => (
            <Url key={obj.node.id}>
              <Loc>{`${host}${obj.node.uri.replace(/\/$/, '')}`}</Loc>
              <LastMod>{obj.node.modified || obj.node.posts.edges[0].node.modified}</LastMod>
              <Priority>0.8</Priority>
            </Url>
          ))
        )}
      </UrlSet>
    );
  }
}

export default async (req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: Config.gqlUrl,
      fetch: fetch,
      credentials: 'include',
      headers: {
        cookie: req.header('Cookie'),
        origin: FRONTEND_URL
      },
    }),
    cache: new InMemoryCache()
  });

  let host = `https://${req.get('host')}`;
  let url = req.baseUrl.replace(/^\//, '');
  let sitemapJsx;

  switch (url) {
    case 'post-sitemap.xml':
      sitemapJsx = <Sitemap host={host} query={SITEMAP_POST_QUERY} type="posts" />
      break;
    case 'page-sitemap.xml':
      sitemapJsx = <Sitemap host={host} query={SITEMAP_PAGE_QUERY} type="pages" />
      break;
    case 'category-sitemap.xml':
      sitemapJsx = <Sitemap host={host} query={SITEMAP_CAT_QUERY} type="categories" />
      break;
    default:
      sitemapJsx = <Sitemap host={host} query={SITEMAP_BASE_QUERY} />
  }

  const tree = (
    <ApolloProvider client={client}>
      {sitemapJsx}
    </ApolloProvider>
  );

  renderToStringWithData(tree).then(xml => {
    res.setHeader('Content-Type', 'text/xml; charset=UTF-8');

    res.status(200)
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`)
      .end();
  }).catch(error => {
    res.status(500)
      .send(`<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${host}</loc>
          <error>${error}</error>
          <lastmod>1970-01-01</lastmod>
          <changefreq>never</changefreq>
          <priority>0.8</priority>
        </url>
      </urlset>`)
      .end();
  });
}