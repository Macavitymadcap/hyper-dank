import type { StorybookConfig } from "@storybook/html-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  stories: [
    "../apps/walking-pace/src/**/*.stories.@(ts|tsx)",
    "../libs/components/src/**/*.stories.@(ts|tsx)",
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      build: {
        chunkSizeWarningLimit: 1_000,
      },
      server: {
        fs: {
          allow: ["..", "../apps/walking-pace", "../libs/components"],
        },
      },
    });
  },
};

export default config;
