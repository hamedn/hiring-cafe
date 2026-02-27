/** @type {import('next').NextConfig} */
const { withBotId } = require("botid/next/config");
const nextConfig = {
  // You can enable reactStrictMode if you want
  // reactStrictMode: true,

  // Transpile these packages (moved out of experimental in Next.js 16)
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-picker",
    "rc-pagination",
    "rc-table",
    "rc-steps",
    "rc-dialog",
    "rc-input-number",
    "rc-tooltip",
    "rc-notification",
    "rc-collapse",
    "rc-form",
    "rc-cascader",
    "rc-checkbox",
    "rc-radio",
    "rc-mentions",
  ],

  // Rewrite sitemap URLs to Vercel Blob storage (serves 200 with XML content)
  async rewrites() {
    const blobBase = process.env.BLOB_STORE_URL;
    if (!blobBase) return [];
    return [
      {
        source: "/sitemap-index.xml",
        destination: `${blobBase}/sitemap-index.xml`,
      },
      {
        source: "/sitemaps/:path*",
        destination: `${blobBase}/sitemaps/:path*`,
      },
    ];
  },
};

module.exports = withBotId(nextConfig);
