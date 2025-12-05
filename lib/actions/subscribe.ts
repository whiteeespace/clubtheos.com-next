"use server";

import { CREATE_CUSTOMER } from "@/lib/queries/admin/create-customer";
import { GET_CUSTOMER } from "@/lib/queries/admin/get-customer";
import { UPDATE_CUSTOMER_EMAIL_SUBSCRIPTION } from "@/lib/queries/admin/update-customer-subscription";
import { shopifyAdmin } from "@/lib/shopify-admin";

interface CustomerNode {
  id: string;
  displayName: string;
  email: string;
}

interface GetCustomerData {
  customers: {
    nodes: CustomerNode[];
  };
}

interface CustomerMutationData {
  customer?: {
    id: string;
  };
}

interface UpdateCustomerEmailSubData {
  customerEmailMarketingConsentUpdate?: CustomerMutationData;
}

interface CreateCustomerData {
  customerCreate?: CustomerMutationData;
}

export async function subscribe(
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  try {
    const getCustomerResponse = await shopifyAdmin.request(GET_CUSTOMER, {
      variables: { query: email },
    });

    const customerData = (getCustomerResponse as { data: GetCustomerData | undefined }).data;

    if (customerData?.customers.nodes.length !== 0 && customerData?.customers.nodes[0]?.id) {
      // Customer already exists — update subscription
      const customerId: string = customerData.customers.nodes[0].id;
      const updateResponse = await shopifyAdmin.request(UPDATE_CUSTOMER_EMAIL_SUBSCRIPTION, {
        variables: { customerId },
      });

      const updateCustomerData = (updateResponse as { data: UpdateCustomerEmailSubData | undefined }).data;
      const id = updateCustomerData?.customerEmailMarketingConsentUpdate?.customer?.id;
      if (!id) {
        console.error("[subscribe] Update failed - no customer ID returned");
        return { success: false, error: "Failed to update subscription." };
      }
      return { success: true, id };
    }

    // Create new customer
    const createResponse = await shopifyAdmin.request(CREATE_CUSTOMER, {
      variables: { email },
    });

    const createCustomerData = (createResponse as { data: CreateCustomerData | undefined }).data;
    const id = createCustomerData?.customerCreate?.customer?.id;
    if (!id) {
      console.error("[subscribe] Create failed - no customer ID returned");
      return { success: false, error: "Failed to subscribe." };
    }
    return { success: true, id };
  } catch (error) {
    console.error("[subscribe] Exception:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
