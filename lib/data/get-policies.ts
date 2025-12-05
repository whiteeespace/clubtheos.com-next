import {
  GetPrivacyPolicyQuery,
  GetPrivacyPolicyQueryVariables,
  GetRefundPolicyQuery,
  GetRefundPolicyQueryVariables,
  GetShippingPolicyQuery,
  GetShippingPolicyQueryVariables,
  GetTermsOfServiceQuery,
  GetTermsOfServiceQueryVariables,
  LanguageCode,
} from "@/gql/graphql";
import { GET_PRIVACY_POLICY } from "@/lib/queries/policies/get-privacy-policy";
import { GET_REFUND_POLICY } from "@/lib/queries/policies/get-refund-policy";
import { GET_SHIPPING_POLICY } from "@/lib/queries/policies/get-shipping-policy";
import { GET_TERMS_OF_SERVICE } from "@/lib/queries/policies/get-terms-of-service";
import { shopifyQuery } from "@/lib/shopify";

export async function getRefundPolicy(language: string) {
  const result = await shopifyQuery<GetRefundPolicyQuery, GetRefundPolicyQueryVariables>(
    GET_REFUND_POLICY,
    { language: language as LanguageCode }
  );

  return { refundPolicy: result.shop.refundPolicy?.body };
}

export async function getTermsAndConditionsPolicy(language: string) {
  const result = await shopifyQuery<GetTermsOfServiceQuery, GetTermsOfServiceQueryVariables>(
    GET_TERMS_OF_SERVICE,
    { language: language as LanguageCode }
  );

  return { termsOfService: result.shop.termsOfService?.body };
}

export async function getShippingPolicy(language: string) {
  const result = await shopifyQuery<GetShippingPolicyQuery, GetShippingPolicyQueryVariables>(
    GET_SHIPPING_POLICY,
    { language: language as LanguageCode }
  );

  return { shippingPolicy: result.shop.shippingPolicy?.body };
}

export async function getPrivacyPolicy(language: string) {
  const result = await shopifyQuery<GetPrivacyPolicyQuery, GetPrivacyPolicyQueryVariables>(
    GET_PRIVACY_POLICY,
    { language: language as LanguageCode }
  );

  return { privacyPolicy: result.shop.privacyPolicy?.body };
}

