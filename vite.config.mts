/// <reference types="vitest" />
/// <reference types="vite/client" />
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    root: './front/',
    server: {
      port: 3000,
      proxy: {
        '/api': `http://localhost:${4000}`,
      },
    },
    preview: {
      port: 3000,
      proxy: {
        '/api': `http://localhost:${4000}/`,
      },
    },
    worker: {
      format: 'es',
    },
    esbuild: {
      define: {
        this: 'window',
      },
    },
    plugins: [react(), tsconfigPaths(), basicSsl()],
    build: {
      outDir: './build',
    },
  }
})
