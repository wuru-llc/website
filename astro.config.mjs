// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://www.wuru.ai",
  base: "",
  output: "server",
  adapter: vercel(),
});