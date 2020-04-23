import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Helmet } from "react-helmet";
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { FRONTEND_URL } from '../constants';

/**
 * GraphQL category query that takes a category slug as a filter
 * Returns the posts belonging to the category and the category name and ID
 */
const CATEGORY_QUERY = gql`
  query CategoryQuery($filter: String!) {
    posts(where: { categoryName: $filter }) {
      edges {
        node {
          title
          slug
          excerpt
        }
      }
    }
    categories(where: { slug: [$filter] }) {
      edges {
        node {
          name
          categoryId
          slug
          seo {
            metaDesc
            title
          }
        }
      }
    }
  }
`;

/**
 * Fetch and display a Category
 */
class Category extends Component {
  state = {
    category: {
      name: '',
      posts: [],
      slug: '',
      seo: {
        title: '',
        metaDesc: ''
      }
    },
  };

  componentDidMount() {
    this.executeCategoryQuery();
  }

  /**
   * Execute the category query, parse the result and set the state
   */
  executeCategoryQuery = async () => {
    const { match, client } = this.props;
    const filter = match.params.slug;
    const result = await client.query({
      query: CATEGORY_QUERY,
      variables: { filter },
    });
    const { name } = result.data.categories.edges[0].node;
    let posts = result.data.posts.edges;
    posts = posts.map(post => {
      const finalLink = `/post/${post.node.slug}`;
      const modifiedPost = { ...post };
      modifiedPost.node.link = finalLink;
      return modifiedPost;
    });

    const category = {
      name,
      posts,
    };
    this.setState({ category });
  };

  render() {
    const { category } = this.state;
    return (
      <>
        <Helmet>
          <title>{category.seo.title}</title>
          <meta name="description" content={category.seo.metaDesc}/>
          <link rel="canonical" href={`${FRONTEND_URL}/${category.slug}`} />
        </Helmet>
        <div className="content mh4 mt4 mb6 w-two-thirds-l center-l">
          <span className="gray f3 b">Category Archives:</span>
          <h1 className="f1 mt3">{category.name}</h1>
          <div className="flex mt2 items-start">
            <div className="flex items-center" />
            <div className="ml1">
              {category.posts.map((post, index) => (
                <div key={post.node.slug}>
                  <h2 className="mt5">
                    <Link to={post.node.link}>
                      {post.node.title}
                    </Link>
                  </h2>
                  <div
                    className="mv4"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: post.node.excerpt,
                    }}
                  />
                  <Link
                    to={post.node.link}
                    className="round-btn invert ba bw1 pv2 ph3"
                  >
                    Read more
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(Category);
