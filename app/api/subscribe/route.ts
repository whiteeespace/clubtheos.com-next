import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ApiKeySession,
  ProfilesApi,
  ProfileEnum,
  ProfileSubscriptionBulkCreateJobEnum,
  ListEnum,
} from "klaviyo-api";

const emailSubscriptionSchema = z.object({
  email: z.email(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = emailSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_NEWSLETTER_LIST_ID;

  if (!apiKey || !listId) {
    return NextResponse.json(
      { error: "Server misconfigured: missing KLAVIYO_API_KEY or KLAVIYO_NEWSLETTER_LIST_ID" },
      { status: 500 }
    );
  }

  try {
    const session = new ApiKeySession(apiKey);
    const profilesApi = new ProfilesApi(session);

    const { response } = await profilesApi.bulkSubscribeProfiles({
      data: {
        type: ProfileSubscriptionBulkCreateJobEnum.ProfileSubscriptionBulkCreateJob,
        attributes: {
          profiles: {
            data: [
              {
                type: ProfileEnum.Profile,
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: ListEnum.List,
              id: listId,
            },
          },
        },
      },
    });

    const status = response?.status ?? 200;
    const data = response?.data ?? { ok: true };
    return NextResponse.json(data, { status });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
