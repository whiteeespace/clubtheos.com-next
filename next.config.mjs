import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "@ark-ui/react", "lodash"],
  },
};

export default withNextIntl(nextConfig);
