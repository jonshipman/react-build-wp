import React, {
  Component,
  useEffect,
  isValidElement,
  createElement,
} from "react";
import { gql, useQuery } from "@apollo/client";

import Config, { BACKEND_URL } from "../../config";

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
    if (
      typeof onError.type === "string" ||
      typeof onError.type === "function"
    ) {
      return createElement(onError, props);
    } else {
      const RenderOnError = onError;
      return <RenderOnError {...props} />;
    }
  }

  if (Config.AJAXenabled) {
    return (
      <iframe
        className="dn"
        src={`${BACKEND_URL}/cors/${Config.getAuthToken()}`}
        title="CORS Cookie Auth for AJAX and iFrames"
      />
    );
  } else {
    return null;
  }
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
