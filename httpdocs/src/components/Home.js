import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Helmet } from "react-helmet";
import gql from 'graphql-tag';
import HomepageRow from './HomepageRow';
import BannerMessage from './BannerMessage';

const POST_QUERY = gql`
  query PostsQuery {
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
          id
        }
      }
    }
  }
`;

const HOME_QUERY = gql`
  query {
    frontPage {
      seo {
        title
        metaDesc
      }
    }
  }
`;

class Home extends Component {
  state = {
    posts: [],
    frontPage: {
      seo: {
        title: '',
        metaDesc: ''
      }
    }
  };

  componentDidMount() {
    this.executePostsQuery();
    this.executeHomeQuery();
  }

  /**
   * Execute the pages and categories query and set the state
   */
  executePostsQuery = async () => {
    const { client } = this.props;

    const result = await client.query({
      query: POST_QUERY,
    });
    let posts = result.data.posts.edges;
    posts = posts.map(post => {
      const finalLink = `/blog/${post.node.slug}`;
      const modifiedPost = { ...post };
      modifiedPost.node.link = finalLink;
      return modifiedPost;
    });

    this.setState({ posts });
  };

  executeHomeQuery = async () => {
    const { client } = this.props;
    const result = await client.query({
      query: HOME_QUERY,
    });

    const { frontPage } = result.data;
    this.setState({ frontPage });
  };

  render() {
    const { posts, frontPage } = this.state;
    let items = [];
    let type = 1;
    let current_type;
    let key;

    posts.map((post, index) => {
      if (index % 2 === 0) {
        items.push([post]);
      } else {
        items[items.length - 1].push(post);
      }

      return null;
    });

    return (
      <>
        <Helmet>
          <title>{frontPage.seo.title}</title>
          <meta name="description" content={frontPage.seo.metaDesc}/>
        </Helmet>
        <BannerMessage message={frontPage.seo.tite} />
        <div className="home--content">
          <div className="hero--container">
            <div className="hero">
              <div className="hero--inner">
                {/* Add a ResponsiveVideo Component here to have a background video */}

                <div className="hero--title">
                  {frontPage.seo.title}
                </div>
              </div>
            </div>
          </div>

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
                <HomepageRow key={key} items={itm} type={current_type}/>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(Home);
