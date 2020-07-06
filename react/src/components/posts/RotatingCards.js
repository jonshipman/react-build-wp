import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import { gql } from "@apollo/client";

import withApolloClient from "../hoc/withApolloClient";

import Loading from "../elements/Loading";
import LoadingError from "../elements/LoadingError";

import { isMobile } from "../utils/Browser";

const DEFAULT_QUERY = gql`
  query DefaultCardQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { status: PUBLISH, hasPassword: false }
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
 * Base animation card component.
 */
export default withApolloClient(
  class extends Component {
    state = {
      cards: [],
      pageInfo: {},
      triggerAnimation: false,
      error: false,
      loading: false,
    };

    nextState = {};

    componentDidMount = () => {
      this.executeQuery();
    };

    componentWillUnmount = () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    };

    callTimeout = (cb) => {
      this.timeout = setTimeout(cb, 5000);
    };

    executeQuery = async () => {
      if (this.props.client) {
        const { pageInfo } = this.state;
        let postsPerPage = this.props.count || 4;

        if (isMobile()) {
          postsPerPage = 1;
        }

        let variables = {
          first: postsPerPage,
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

        const { loading, error, data } = await this.props.client.query({
          query: this.props.query || DEFAULT_QUERY,
          variables,
        });

        if (loading) {
          this.setState({ loading });
          return;
        }

        if (error) {
          this.setState({ error });
          return;
        }

        if (data?.posts?.edges?.length > 0) {
          this.nextState = {
            cards: data.posts.edges,
            pageInfo: data.posts.pageInfo,
          };

          if (this.props.isMounted()) {
            this.setState({
              triggerAnimation: !this.state.triggerAnimation,
              error,
              loading,
            });
          }
        }
      }
    };

    DefaultWrap({ cards, children, ...props }) {
      return (
        <ul className="list pl0 flex-l flex-wrap-l" {...props}>
          {cards.map((card) => children(card))}
        </ul>
      );
    }

    DefaultCard(card) {
      return <li>{card?.node?.title}</li>;
    }

    render() {
      const { wrapper, children } = this.props;
      const { triggerAnimation, cards, error, loading } = this.state;

      if (loading) return <Loading />;
      if (error) return <LoadingError error={error.message} />;

      const W = wrapper || this.DefaultWrap.bind(this);
      const C = children || this.DefaultCard.bind(this);

      return (
        <CSSTransition
          in={triggerAnimation}
          timeout={this.props.timeout || 501}
          classNames={this.props.classNames || "cards-cycling"}
          onExited={() => {
            if (this.props.isMounted()) {
              this.setState({ triggerAnimation: !this.state.triggerAnimation });
            }
          }}
          onEnter={() => {
            if (this.props.isMounted()) {
              this.setState({ ...this.nextState });
            }
          }}
          onEntered={() => {
            if (this.props.isMounted()) {
              this.callTimeout(this.executeQuery);
            }
          }}
        >
          <W cards={cards}>{(card) => C(card)}</W>
        </CSSTransition>
      );
    }
  }
);
