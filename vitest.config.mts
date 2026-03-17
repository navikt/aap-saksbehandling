import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
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
        inline: ['@navikt/endringslogg'],
      },
    },
  },
});
