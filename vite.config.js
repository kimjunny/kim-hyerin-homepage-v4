import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const root = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: `${root}index.html`,
        profile: `${root}profile.html`,
        research: `${root}research.html`,
        publications: `${root}publications.html`,
        education: `${root}education.html`,
        sources: `${root}sources.html`,
      },
    },
  },
})
