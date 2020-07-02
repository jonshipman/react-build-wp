import React, { Component, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query HeartbeatQuery {
    viewer {
      id
      jwtAuthExpiration
    }
  }
`;

const HeartBeatQuery = ({ beats, onError, ...props }) => {
  const { error } = useQuery(QUERY, {
    errorPolicy: "all",
    fetchPolicy: "network-only",
    variables: { beats },
  });

  useEffect(() => {
    if (error) {
      onError({ ...props, error });
    }
  }, [onError, error, props]);

  return null;
};

class Heartbeat extends Component {
  interval = null;
  state = {
    beats: 0,
  };

  componentDidMount() {
    const { ibi } = this.props;
    this.interval = setInterval(this.pulse.bind(this), ibi);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  pulse() {
    let { beats } = this.state;
    beats++;
    this.setState({ beats });
  }

  render() {
    const { beats } = this.state;
    const { onError, ...props } = this.props;

    return <HeartBeatQuery onError={onError} beats={beats} {...props} />;
  }
}

export default (WrappedComponent, onError = () => true, ibi = 30000) => {
  return class extends Component {
    render() {
      return (
        <>
          <WrappedComponent {...this.props} />
          <Heartbeat onError={onError} ibi={ibi} {...this.props} />
        </>
      );
    }
  };
};
