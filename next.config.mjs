/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM in places; let Next transpile it.
  transpilePackages: ["three"],
  // Fonts are delivered via a Google Fonts <link> in app/layout.tsx. Disabling
  // Next's build-time font inlining keeps the build free of any network fetch,
  // so it works on locked-down CI and offline. Swap to next/font to self-host.
  optimizeFonts: false,
};

export default nextConfig;
