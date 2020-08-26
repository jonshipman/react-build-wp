import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import Config from "../../config";

export const useCleanup = (redirect = "/login", types = []) => {
  const history = useHistory();
  const client = useApolloClient();

  Config.removeAuthToken();

  // Clear the sensitize caches
  Object.keys(client.cache.data.data).forEach((key) =>
    types.forEach(
      (type) => 0 === key.indexOf(type) && client.cache.data.delete(key)
    )
  );

  useEffect(() => {
    history.push(redirect);
  }, [redirect, history]);
};

const Cleanup = ({ redirect, types }) => {
  useCleanup(redirect, types);

  return null;
};

export default Cleanup;
