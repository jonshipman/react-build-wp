import { createElement } from "react";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query PermissionsQuery {
    viewer {
      id
      capabilities
    }
  }
`;

export default ({ cap, children, fallback = null, ...props }) => {
  const { data } = useQuery(QUERY, { errorPolicy: "all" });

  if (data?.viewer?.capabilities?.length > 0) {
    if (data.viewer.capabilities.includes(cap)) {
      return children;
    }
  }

  if (null === fallback) {
    return null;
  }

  return createElement(fallback, props);
};
