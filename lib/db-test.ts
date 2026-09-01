import { db } from '@/lib/db'

async function testConnection() {
  try {
    const result = await db`SELECT NOW() as time`
    console.log('✅ Database connected:', result[0].time)

    const tables = await db`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `
    console.log('Tables:', tables.map((t) => t.table_name))
  } catch (err) {
    console.error('❌ Database connection failed:', err)
  } finally {
    process.exit(0)
  }
}

testConnection()
