import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// Singleton pattern — reuse the connection pool across hot reloads in dev
const globalForDb = globalThis as unknown as { db: ReturnType<typeof postgres> }

export const db =
  globalForDb.db ??
  postgres(connectionString, {
    // Supabase's database pooler may present a certificate chain Node does not
    // trust locally. Keep the connection encrypted while matching the existing
    // db-check configuration. For certificate verification, configure the
    // provider's CA certificate and set rejectUnauthorized to true.
    ssl: { rejectUnauthorized: false },
    // Supabase's transaction-mode pooler can route a query to a different
    // backend connection than the one that created its named prepared
    // statement. Disabling protocol-level prepares avoids intermittent
    // `prepared statement ... does not exist` errors while keeping all tagged
    // queries parameterized.
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
