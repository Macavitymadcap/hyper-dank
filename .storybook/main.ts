import type { StorybookConfig } from "@storybook/html-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  async viteFinal(config) {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: [".."],
        },
      },
    });
  },
};

export default config;
