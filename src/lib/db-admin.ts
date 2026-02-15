// lib/db-admin.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || '15.204.156.235',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'sela_cabinets',
  user: process.env.DB_USER || 'sela_app',
  password: process.env.DB_PASSWORD || 'sela_secure_2024',
  ssl: false,
});

export async function getCustomers() {
  const result = await pool.query(
    'SELECT * FROM customers ORDER BY created_at DESC LIMIT 50'
  );
  return result.rows;
}

export async function getEstimates() {
  const result = await pool.query(`
    SELECT 
      e.*,
      c.name as customer_name,
      c.email as customer_email
    FROM estimates e 
    JOIN customers c ON e.customer_id = c.id 
    ORDER BY e.created_at DESC 
    LIMIT 50
  `);
  return result.rows;
}
