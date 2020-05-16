import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { gql, ApolloConsumer } from '@apollo/client';

import { isMobile } from '../utils/Browser';

import { BlocksThree } from '../layout/Blocks';

import PostContent from '../elements/PostContent';

const THERAPIES_QUERY = gql`
  query TherapyQuery(
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    posts(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: {status: PUBLISH}
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
			edges {
				node {
					id
					title
					excerpt
          uri
				}
				cursor
			}
    }
  }
`;

/**
 * Runs/gets a programs and therapies cursor
 */
class ProgramsAndTherapies extends Component {
  state = {
    therapies: [],
    pageInfo: {},
    triggerAnimation: false
  }

  nextState = {}

  componentDidMount = () => {
    this.executeQuery();
  }

  componentWillUnmount = () => {
    this.killTimeout();
  }

  killTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  callTimeout = cb => {
    this.timeout = setTimeout(cb, 4300);
  }

  executeQuery = async () => {
    if (this.client) {
      const { pageInfo } = this.state;
      let postsPerPage = 3;

      if (isMobile()) {
        postsPerPage = 1;
      }

      let variables = {
        first: postsPerPage
      };

      if (pageInfo.hasNextPage) {
        variables.after = pageInfo.endCursor;
        variables.first = postsPerPage;
        variables.before = null;
        variables.last = null;
      }

      if (pageInfo.hasPreviousPage && !pageInfo.hasNextPage) {
        variables.first = postsPerPage;
        variables.after = null;
        variables.before = null;
        variables.last = null;
      }

      const result = await this.client.query({
        query: THERAPIES_QUERY,
        variables
      });

      if (result.data.posts.edges) {
        this.nextState = { therapies: result.data.posts.edges, pageInfo: result.data.posts.pageInfo };
        this.setState({ triggerAnimation: !this.state.triggerAnimation });
      }
    }
  };

  render() {
    const { therapies, triggerAnimation } = this.state;

    return (
      <ApolloConsumer>
        {client => {
          this.client = client;
          return (
            <CSSTransition
              in={triggerAnimation}
              timeout={1001}
              classNames="therapies"
              onEnter={() => {
                this.setState(this.nextState);
                console.log('enter');
              }}
              onEntered={() => {
                this.callTimeout(this.executeQuery);
              }}
              onExited={() => {
                this.setState({ triggerAnimation: !this.state.triggerAnimation });
              }}
            >
              <BlocksThree
                items={therapies}
                onMouseOver={() => {
                  this.killTimeout();
                }}
                onMouseOut={() => {
                  this.callTimeout(this.executeQuery);
                }}
              >
                {therapy => (
                  <div className="therapy bg-near-white h-100 ba b--light-gray relative z-1">
                    <div className="therapy--image">
                      <img className="center db" alt={therapy.node.title} width={300} height={180} src="https://www.fillmurray.com/300/180" />
                    </div>
                    <div className="therapy--text pa4">
                      <div className="therapy--title ttu f7 fw7">{therapy.node.title}</div>
                      <PostContent className="therapy--content pb2 f7" content={therapy.node.excerpt} />
                      {therapy.node.uri && (
                        <div className="ba b--light-gray absolute bottom-0 right-0 left-0">
                          <a className="dark-gray fw7 ttu f7 db ph4 pv2 hover-white hover-bg-green" href={therapy.node.uri} title="Replace this with ACF external link">
                            Learn More
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </BlocksThree>
            </CSSTransition>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default ProgramsAndTherapies;
