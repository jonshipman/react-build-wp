import React, { Component, useEffect, isValidElement } from "react";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query HeartbeatQuery {
    viewer {
      id
      jwtAuthExpiration
      capabilities
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
    if (error && !isValidElement(onError)) {
      onError({ ...props, error });
    }
  }, [onError, error, props]);

  if (error && isValidElement(onError)) {
    return <onError.type {...props} {...onError.props} />;
  }

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

const withHeartbeatHOC = (
  WrappedComponent,
  onError = () => true,
  ibi = 30000
) => {
  return function withHeartbeat(props) {
    return (
      <>
        <WrappedComponent {...props} />
        <Heartbeat onError={onError} ibi={ibi} {...props} />
      </>
    );
  };
};

export default withHeartbeatHOC;
