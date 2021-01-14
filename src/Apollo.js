import React from "react";
import {
  ApolloClient,
  ApolloProvider as Provider,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const cache = new InMemoryCache({
  typePolicies: {
    Post: {
      fields: {
        date: {
          read: function (date) {
            const d = new Date(date);

            return `${
              monthNames[d.getMonth()]
            } ${d.getDate()}, ${d.getFullYear()}`;
          },
        },
      },
    },
  },
});

const authAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // If we get an error, log the error.
    if (response?.errors?.length > 0) {
      console.error(response.errors);
    }

    return response;
  });
});

const link = new HttpLink({
  uri: `${process.env.REACT_APP_DOMAIN}/graphql`,
});

export const ApolloProvider = ({ children }) => {
  const client = new ApolloClient({
    link: from([authAfterware, link]),
    cache,
  });

  return <Provider {...{ client }}>{children}</Provider>;
};
