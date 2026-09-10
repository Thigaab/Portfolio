import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  // `next dev` and `next build` share .next by default, and a dev server that
  // boots on production artifacts ends up in a permanent recompile loop with a
  // mismatched chunk map. Set NEXT_DIST_DIR to build somewhere else while a
  // dev server is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
