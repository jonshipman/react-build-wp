import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { gql } from '@apollo/client';

import withApolloClient from '../hoc/withApolloClient';

import { isMobile } from '../utils/Browser';

const ADVANTAGES_QUERY = gql`
  query AdvantageQuery(
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
        }
        cursor
      }
    }
  }
`;

/**
 * Runs/gets a advanages cursor
 */
class CyclingCards extends Component {
  state = {
    advantages: [],
    pageInfo: {},
    triggerAnimation: false
  }

  nextState = {}

  componentDidMount = () => {
    this.executeQuery();
  }

  componentWillUnmount = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  callTimeout = cb => {
    this.timeout = setTimeout(cb, 5000);
  }

  executeQuery = async () => {
    if (this.props.client) {
      const { pageInfo } = this.state;
      let postsPerPage = 4;

      if (isMobile()) {
        postsPerPage = 2;
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
        query: ADVANTAGES_QUERY,
        variables
      });

      if (result.data.posts.edges) {
        this.nextState = { advantages: result.data.posts.edges, pageInfo: result.data.posts.pageInfo };
        this.setState({ triggerAnimation: !this.state.triggerAnimation });
      }
    }
  };

  Inner = () => {
    const { advantages } = this.state;

    return (
      <ul className="advantages list pl0 flex-l flex-wrap-l mw7 center">
        {advantages && advantages.map(advantage => (
          <li className="w-100 w-50-l advantage pa3" key={advantage.node.id}>
            <div className="w-100 bg-white aspect-ratio-l aspect-ratio--16x9-l">
              <div className="advantage--inner w-100 absolute-l z-1 pa2 pa0-l">
                <div className="w-100 grow">
                  <img src="https://www.fillmurray.com/64/64" alt="Replace with featured or custom meta (paste svg into acf textarea)" />
                </div>
                <div className="mt2 f7 fw7 w-90 center">{advantage.node.title}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { triggerAnimation } = this.state;

    return (
      <div className="w-100 h-100 bg-dark-gray pa4 tc flex-l items-center-l">
        <div className="w-100-l">
          <h3><span className="fw4 f2 white">Our Company <span className="fw7">Advantage</span></span></h3>
          <CSSTransition
            in={triggerAnimation}
            timeout={501}
            classNames="advantages"
            onExited={() => {
              this.setState({ triggerAnimation: !this.state.triggerAnimation });
            }}
            onEnter={() => {
              this.setState(this.nextState);
            }}
            onEntered={() => {
              this.callTimeout(this.executeQuery);
            }}
          >
            {this.Inner}
          </CSSTransition>
        </div>
      </div>
    );
  }
}

export default withApolloClient(CyclingCards);
