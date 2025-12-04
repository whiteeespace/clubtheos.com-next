export const UPDATE_CUSTOMER_EMAIL_SUBSCRIPTION = `
  #graphql
  mutation updateCustomerEmailSub($customerId: ID!) {
    customerEmailMarketingConsentUpdate(
      input: { customerId: $customerId, emailMarketingConsent: { marketingOptInLevel: CONFIRMED_OPT_IN, marketingState: SUBSCRIBED } }
    ) {
      customer {
        id
      }
    }
  }
`;
