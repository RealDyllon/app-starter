import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to load Drizzle config')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/server/db',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
