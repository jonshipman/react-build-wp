import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { gql } from '@apollo/client';

import { isMobile } from '../utils/Browser';

import { BlocksThree } from '../elements/Blocks';
import PostContent from '../elements/PostContent';
import Image from '../elements/Image';

import withApolloClient from '../hoc/withApolloClient';

const QUERY = gql`
  query CardTallQuery(
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
 * Runs/gets a programs and cards cursor
 */
class ProgramsAndcards extends Component {
  state = {
    cards: [],
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
    if (this.props.client) {
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

      const result = await this.props.client.query({
        query: QUERY,
        variables
      });

      if (result.data.posts.edges) {
        this.nextState = { cards: result.data.posts.edges, pageInfo: result.data.posts.pageInfo };
        if (this.props.isMounted()) {
          this.setState({ triggerAnimation: !this.state.triggerAnimation });
        }
      }
    }
  };

  render() {
    const { cards, triggerAnimation } = this.state;

    return (
      <CSSTransition
        in={triggerAnimation}
        timeout={1001}
        classNames="cards-tall"
        onEnter={() => {
          if (this.props.isMounted()) {
            this.setState(this.nextState);
          }
        }}
        onEntered={() => {
          this.callTimeout(this.executeQuery);
        }}
        onExited={() => {
          if (this.props.isMounted()) {
            this.setState({ triggerAnimation: !this.state.triggerAnimation });
          }
        }}
      >
        <BlocksThree
          items={cards}
          onMouseOver={() => {
            this.killTimeout();
          }}
          onMouseOut={() => {
            this.callTimeout(this.executeQuery);
          }}
        >
          {card => (
            <div className="card bg-near-white h-100 ba b--light-gray relative z-1">
              <div className="card--image">
                <Image className="center db" alt={card.node.title} width={300} height={180} />
              </div>
              <div className="card--text pa4">
                <div className="card--title ttu f7 fw7">{card.node.title}</div>
                <PostContent className="card--content pb2 f7" content={card.node.excerpt} />
                {card.node.uri && (
                  <div className="ba b--light-gray absolute bottom-0 right-0 left-0">
                    <a className="dark-gray fw7 ttu f7 db ph4 pv2 hover-white hover-bg-green" href={card.node.uri} title="Replace this with ACF external link">
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
  }
}

export default withApolloClient(ProgramsAndcards);
