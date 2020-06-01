import React, { Component } from 'react';
import { gql } from '@apollo/client';

import PostExcerpt from './elements/PostExcerpt';
import PageWidth from './elements/PageWidth';
import { PrimaryClasses } from './elements/Button';

import withApolloClient from './hoc/withApolloClient';

/**
 * GraphQL post search query that takes a filter
 * Returns the titles, uris, and authors of posts found
 */
const POST_SEARCH_QUERY = gql`
  query PostSearchQuery($filter: String!) {
    posts(where: { search: $filter }) {
      edges {
        node {
          id
          postId
          title
          uri
          excerpt
          dateFormatted
        }
      }
    }
  }
`;

/**
 * Search component that fetches results by filter
 */
class Search extends Component {
  state = {
    posts: [],
    filter: '',
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.executeSearch();
    }
    return true;
  };

  /**
   * Execute search query, process the response and set the state
   */
  executeSearch = async () => {
    if (this.props.client) {
      const { filter } = this.state;
      let posts = [];

      if (filter.length === 0) {
        if (this.props.isMounted()) {
          this.setState({ posts });
        }
      } else {
        const result = await this.props.client.query({
          query: POST_SEARCH_QUERY,
          variables: { filter },
        });

        if (result.data.posts.edges) {
          if (this.props.isMounted()) {
            this.setState({ posts: result.data.posts.edges });
          }
        }
      }
    }
  };

  render() {
    const { posts } = this.state;
    return (
      <PageWidth className="content">
        <div>
          <h1>Search</h1>
          <input
            className="db w-100 pa3 mv3 br6 ba b--black"
            type="text"
            placeholder="Search by name and content"
            onChange={e => this.setState({ filter: e.target.value })}
            onKeyDown={this.handleKeyDown}
          />
          <button
            className={`bn ${PrimaryClasses}`}
            type="button"
            onClick={() => this.executeSearch()}
          >
            Submit
          </button>
        </div>
        <div className="mv4 content--body">
          <div className="search-entries">
            {posts.map(post => (
              <PostExcerpt key={post.node.id} post={post} />
            ))}
          </div>
        </div>
      </PageWidth>
    );
  }
}

export default withApolloClient(Search);
