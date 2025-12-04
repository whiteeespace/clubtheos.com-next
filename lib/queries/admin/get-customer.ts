export const GET_CUSTOMER = `
  #graphql
  query getCustomer($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        displayName
        defaultEmailAddress {
          emailAddress
        }
      }
    }
  }
`;
