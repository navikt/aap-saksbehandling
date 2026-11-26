import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const nodeTests = ['lib/**/*.test.ts', 'components/**/*.test.ts'];
const domExceptions = ['lib/utils/umami/varighet.test.ts'];

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
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: nodeTests,
          exclude: [...configDefaults.exclude, ...domExceptions],
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'happy-dom',
          include: ['**/*.test.tsx', 'hooks/**/*.test.ts', ...domExceptions],
          exclude: configDefaults.exclude,
          setupFiles: ['vitestSetup.ts'],
        },
      },
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
