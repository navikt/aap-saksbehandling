import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'css-stub',
      transform(code, id) {
        if (id.endsWith('.css')) {
          return { code: 'export default {}' };
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['vitestSetup.ts'],
    server: {
      deps: {
        inline: ['@navikt/familie-endringslogg'],
      },
    },
  },
});
