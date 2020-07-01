import React, { Component } from "react";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query HeartbeatQuery {
    viewer {
      jwtAuthExpiration
    }
  }
`;

const HeartBeatQuery = ({ beats, onError }) => {
  const { error } = useQuery(QUERY, {
    errorPolicy: "all",
    fetchPolicy: "network-only",
    variables: { beats },
  });

  if (error) {
    onError(error);
  }

  return null;
};

export default class extends Component {
  interval = null;
  state = {
    beats: 0,
  };

  componentDidMount() {
    const { ibi=30000 } = this.props;
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
    const { onError=() => true } = this.props;

    return <HeartBeatQuery onError={onError} beats={beats} />;
  }
}
