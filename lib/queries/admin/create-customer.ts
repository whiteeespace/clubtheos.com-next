export const CREATE_CUSTOMER = `
  #graphql
  mutation createCustomer($email: String!) {
  customerCreate(
    input: {email: $email, emailMarketingConsent: {marketingOptInLevel: CONFIRMED_OPT_IN, marketingState: SUBSCRIBED}}
  ) {
    customer {
      id
      createdAt
    }
  }
}
`;
