export const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? `https://www.clubtheos.com`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
