import { gql, useQuery } from "@apollo/client";

const SettingsQuery = gql`
  query SettingsQuery {
    allSettings {
      title: generalSettingsTitle
      description: generalSettingsDescription
    }
  }
`;

export function useSettings() {
  const { data, loading, error } = useQuery(SettingsQuery, {
    errorPolicy: "all",
  });

  const allSettings = data?.allSettings || {};

  return {
    ...allSettings,
    loading,
    error,
  };
}

export default useSettings;
