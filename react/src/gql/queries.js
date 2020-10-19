import { gql } from "@apollo/client";

export const QuerySettings = () => gql`
  query headlessLocationWpSettings {
    allSettings {
      id
      generalSettingsTitle
      generalSettingsDescription
    }
  }
`;
