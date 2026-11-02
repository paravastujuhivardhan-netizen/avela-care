import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    ssr: 'server/chat.ts',
    outDir: 'api',
    emptyOutDir: false,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'chat.js' } }
  }
})
