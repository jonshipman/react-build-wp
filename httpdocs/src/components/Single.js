import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import NotFound from './elements/NotFound';
import Page from './elements/Page';
import Post from './elements/Post';

/**
 * GraphQL page query that takes a page slug as a uri
 * Returns the title and content of the page
 */
const POST_QUERY = gql`
  query PageQuery($uri: String!) {
    pageBy(uri: $uri) {
      pageId
			slug
      title(format: RENDERED)
      content(format: RENDERED)
      seo {
        title
        metaDesc
      }
    }
    postBy(uri: $uri) {
      postId
			slug
			date
      title(format: RENDERED)
      content(format: RENDERED)
      seo {
        title
        metaDesc
      }
      categories(first: 5) {
        edges {
          node {
            categoryId
            slug
            name
          }
        }
      }
    }
  }
`;

/**
 * Fetch and display a Page
 */
class Single extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: {
        databaseId: 0,
				title: '',
				slug: '',
        content: '',
        seo: {
          title: '',
          metaDesc: ''
        }
      },
      post: {
        databaseId: 0,
				title: '',
				slug: '',
				date: '',
        content: '',
        seo: {
          title: '',
          metaDesc: ''
        },
        categories: {
          edges: []
        },
        mainTitle: ''
      },
      finished: false
    };
  }

  componentDidMount() {
    this.executeQuery();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
      this.executeQuery();
    }
  }

  /**
   * Execute page query, process the response and set the state
   */
  executeQuery = async () => {
    const { match, client } = this.props;
    let { page, post } = this.state;

    let uri = match.url;

    if (!uri) {
      uri = '404';
    } else {
			uri = match.url.replace(/^\//, '');

			// This next line removes /blog from the begining.
			uri = match.url.replace(/^blog\//, '');
    }

    const result = await client.query({
      query: POST_QUERY,
      variables: { uri },
    });

    if (result.data.pageBy) {
      page = result.data.pageBy;
      page.databaseId = page.pageId;
    }

    if (result.data.postBy) {
      post = result.data.postBy;
      post.databaseId = post.postId;

      if (post.categories.edges) {
        post.mainTitle = post.categories.edges[0].node.name;
      }
    }

    this.setState({ page, post, finished: true });
  }

  render() {
    const { page, post, finished } = this.state;

    if (page.databaseId) {
      return <Page page={page} />
    }

    if (post.databaseId) {
      return <Post post={post} />
    }

    if (finished) {
      return (
        <NotFound/>
      );
    }

    return null;
  }
}

export default withApollo(Single);
