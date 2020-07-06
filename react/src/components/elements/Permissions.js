import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query PermissionsQuery {
    viewer {
      id
      capabilities
    }
  }
`;

// Wrap components with this to check against capabilities.
export default ({ cap, children }) => {
  const { data } = useQuery(QUERY, { errorPolicy: "all" });

  if (data?.viewer?.capabilities?.length > 0) {
    if (data.viewer.capabilities.includes(cap)) {
      return children;
    }
  }

  return null;
};
