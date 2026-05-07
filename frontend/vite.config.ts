import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
/// <reference types="vitest/config" />

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/tests/mocks/setup.ts']
  },
  plugins: [react(), tailwindcss()],
});
