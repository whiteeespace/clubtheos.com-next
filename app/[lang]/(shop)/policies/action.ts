"use server";

import { getClient } from "@whiteeespace/core/utils";

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
import { GET_PRIVACY_POLICY } from "@utils/queries/policies/get-privacy-policy";
import { GET_REFUND_POLICY } from "@utils/queries/policies/get-refund-policy";
import { GET_SHIPPING_POLICY } from "@utils/queries/policies/get-shipping-policy";
import { GET_TERMS_OF_SERVICE } from "@utils/queries/policies/get-terms-of-service";

export const getRefundPolicy = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetRefundPolicyQuery, GetRefundPolicyQueryVariables>(GET_REFUND_POLICY, {
    language: language as LanguageCode,
  });

  const refundPolicy = result.data?.shop.refundPolicy?.body;

  return {
    refundPolicy,
  };
};

export const getTermsAndConditionsPolicy = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetTermsOfServiceQuery, GetTermsOfServiceQueryVariables>(
    GET_TERMS_OF_SERVICE,
    {
      language: language as LanguageCode,
    }
  );

  const termsOfService = result.data?.shop.termsOfService?.body;

  return {
    termsOfService,
  };
};

export const getShippingPolicy = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetShippingPolicyQuery, GetShippingPolicyQueryVariables>(
    GET_SHIPPING_POLICY,
    {
      language: language as LanguageCode,
    }
  );

  const shippingPolicy = result.data?.shop.shippingPolicy?.body;

  return {
    shippingPolicy,
  };
};

export const getPrivacyPolicy = async (language: string) => {
  const client = getClient();
  const result = await client.query<GetPrivacyPolicyQuery, GetPrivacyPolicyQueryVariables>(
    GET_PRIVACY_POLICY,
    {
      language: language as LanguageCode,
    }
  );

  const privacyPolicy = result.data?.shop.privacyPolicy?.body;

  return {
    privacyPolicy,
  };
};
