import { InMemoryCache } from "@apollo/client";
export const cache = new InMemoryCache({
  typePolicies: {
    Post: {
      fields: {
        date: {
          read: function (date) {
            const d = new Date(date);

            return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
          },
        },
      },
    },
  },
});
