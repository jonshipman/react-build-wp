import { createElement, cloneElement } from "react";
import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query PermissionsQuery {
    viewer {
      id
      databaseId
      capabilities
    }
  }
`;

export default ({ cap, children, fallback = null, authorId, ...props }) => {
  const { data } = useQuery(QUERY, { errorPolicy: "all" });

  if (data?.viewer?.capabilities?.length > 0) {
    if (data.viewer.capabilities.includes(cap)) {
      const others = cap.replace("_", "_others_");
      if (authorId) {
        if (
          data.viewer.databaseId === authorId ||
          data.viewer.capabilities.includes(others)
        ) {
          return cloneElement(children, props);
        }
      } else {
        return cloneElement(children, props);
      }
    }
  }

  if (null === fallback) {
    return null;
  }

  return createElement(fallback, props);
};
