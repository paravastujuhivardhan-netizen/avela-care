import { build } from 'vite'
await build({ configFile: false, logLevel: 'warn', build: { ssr: 'tests/regression.ts', outDir: '.test-build', emptyOutDir: true, minify: false, rollupOptions: { output: { entryFileNames: 'regression.mjs' } } } })
await import('../.test-build/regression.mjs')
