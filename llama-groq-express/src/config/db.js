import mysql from 'mysql2/promise'

// Basic MySQL connection pool using environment variables
const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3307', // Default to 3307 (common XAMPP/WAMP port)
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'ai_saas',
} = process.env

// Handle password - use undefined for no password (empty string or missing)
const password = DB_PASSWORD && DB_PASSWORD.trim() !== '' ? DB_PASSWORD : undefined

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: password, // undefined means no password
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const testConnection = async () => {
  try {
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    console.log('✅ MySQL connection successful')
  } catch (err) {
    if (err.message.includes('Access denied')) {
      console.error('❌ MySQL connection failed: Access denied')
      console.error('   Please check your DB_PASSWORD in the .env file.')
      console.error('   Make sure it matches your MySQL root password.')
    } else {
      console.error('❌ MySQL connection failed:', err.message)
    }
  }
}


