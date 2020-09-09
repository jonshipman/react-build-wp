import { gql, useQuery } from "@apollo/client";

const QUERY = gql`
  query SettingsQuery {
    allSettings {
      id
      generalSettingsTitle
      generalSettingsDescription
      wpBoilerplateNodesSettingsPhoneNumber
      wpBoilerplateNodesSettingsContactEmail
    }
  }
`;

const useSettings = () => {
  const { data, loading, error } = useQuery(QUERY, {
    errorPolicy: "all",
    ssr: false,
  });

  const settings = data?.allSettings || {};
  const {
    generalSettingsTitle: title,
    wpBoilerplateNodesSettingsPhoneNumber: phone,
    wpBoilerplateNodesSettingsContactEmail: email,
    generalSettingsDescription: description,
  } = settings;

  return {
    description,
    title,
    phone,
    email,
    settings,
    loading,
    error,
  };
};

export default useSettings;
