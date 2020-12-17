import { gql } from "@apollo/client";

export const QuerySettings = () => gql`
  query headlessLocationWpSettings {
    allSettings {
      generalSettingsTitle
      generalSettingsDescription
    }
  }
`;
