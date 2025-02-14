import { loadEnv } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// https://vite.dev/config/, https://vite.dev/guide/api-javascript#mergeconfig
export default defineConfig((configEnv) =>
  mergeConfig(viteConfig(configEnv), defineConfig({
    // plugins: [react()], // merged
    test: {
      globals: true,
      environment: 'jsdom',
      env: loadEnv('', process.cwd()),
      fileParallelism: false,
      include: [
        "tests/**/(*.)+(test).?(m)[jt]s?(x)"
      ],
      coverage: {
        enabled: true,
        reportOnFailure: true,
        exclude: ["build/", "node_modules/", "tests/",
          "**/*.d.ts",
          "src/Resources.ts",
          "src/main.tsx",
          "src/backend/testdata.ts",
          "src/components/LinkContainer.tsx",
          "src/backend/fetchWithErrorHandling.tsx",
        ],
        include: ['src/**/*.{ts,js,mjs,tsx,jsx,mts}']
      },
      reporters: [
        'default',
        ['junit', { outputFile: "junit.xml" }]
      ],
      setupFiles: [
        '@testing-library/jest-dom/vitest'
      ]
    }
  }))
);
