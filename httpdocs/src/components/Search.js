import React, { Component } from 'react';
import { gql, ApolloConsumer } from '@apollo/client';
import PostExcerpt from './elements/PostExcerpt';

/**
 * GraphQL post search query that takes a filter
 * Returns the titles, slugs and authors of posts found
 */
const POST_SEARCH_QUERY = gql`
  query PostSearchQuery($filter: String!) {
    posts(where: { search: $filter }) {
      edges {
        node {
          id
          postId
          title
          slug
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
    if (e.keyCode === 13) {
      this.executeSearch();
    }
    return true;
  };

  /**
   * Execute search query, process the response and set the state
   */
  executeSearch = async () => {
    if (this.client) {
      const { filter } = this.state;
      let posts = [];
      if (filter.length === 0) {
        this.setState({ posts });
      } else {
        const result = await this.client.query({
          query: POST_SEARCH_QUERY,
          variables: { filter },
        });
        if (result.data.posts.edges) {
          result.data.posts.edges.map(post => {
            const finalLink = `/${post.node.slug}`;
            const modifiedPost = {node:{}};
            Object.entries(post.node).map(([key, value]) => {
              modifiedPost.node[key] = value;

              return null;
            });
            modifiedPost.node.link = finalLink;
            posts.push(modifiedPost);

            return null;
          });
        }
        this.setState({ posts });
      }
    }
  };

  render() {
    const { posts } = this.state;
    return (
      <ApolloConsumer>
        {client => {
          this.client = client;
          return (
            <div className="content w-two-thirds-l center-l">
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
                  className="round-btn invert ba bw1 pv2 ph3"
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
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default Search;
