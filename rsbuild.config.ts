import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  dev: {
    client: {
      host: '0.0.0.0',
      port: 3000,
      protocol: 'ws',
    },
    writeToDisk: true,
  },
  server: {
    publicDir: {
      copyOnBuild: false,
    },
    open: false,
    port: 3000,
    strictPort: true,
  },
  output: {
    filenameHash: false,
  },
  environments: {
    web: {
      plugins: [pluginReact()],
      source: {
        entry: {
          popup: './src/popup/index.tsx',
        },
      },
      html: {
        title: '',
      },
      output: {
        target: 'web',
        copy: [{ from: './public' }],
      },
    },
    webworker: {
      source: {
        entry: {
          background: './src/background/index.ts',
        },
      },
      output: {
        target: 'web-worker',
      },
    },
  },
});
