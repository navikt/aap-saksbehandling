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
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['vitestSetup.ts'],
    environmentMatchGlobs: [
      // Pure logic tests — no DOM needed
      ['lib/**/*.test.ts', 'node'],
      ['components/**/*.test.ts', 'node'],
    ],
    onConsoleLog(log) {
      // Suppress noisy sourcemap warnings from packages that ship without source files
      if (log.includes('Sourcemap for') && log.includes('points to missing source files')) return false;
    },
    server: {
      deps: {
        inline: ['@navikt/endringslogg'],
      },
    },
  },
});
