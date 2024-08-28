A boilerplate in Next.js for shopify storefront. By whiteee.space.

## Getting Started

1. Install the necessary dependencies using `npm install` or `npm i`.
2. Create a `.env.local` file with the following content and replace the values to the ones in the headless app in Shopify:

   ```
   NEXT_PUBLIC_STOREFRONT_ID="your-shop"
    NEXT_PUBLIC_STOREFRONT_API_TOKEN="your_storefront_token"
   ```

3. Create a `next-env.d.ts` file with the following content:

   ```
   /// <reference types="next" />
   /// <reference types="next/image-types/global" />

   // NOTE: This file should not be edited
   // see https://nextjs.org/docs/basic-features/typescript for more information.

   ```

4. Generate the graphql types with `npm run codegen`.
5. Start your development server with `npm run dev`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
