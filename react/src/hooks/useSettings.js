import { useQuery } from "@apollo/client";
import { useQueries } from "react-wp-gql";

export const useSettings = () => {
  const { queries } = useQueries();

  const { data, loading, error } = useQuery(queries.QuerySettings, {
    errorPolicy: "all",
    ssr: true,
  });

  const allSettings = data?.allSettings || {};

  return {
    ...allSettings,
    loading,
    error,
  };
};
