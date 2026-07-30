// lib/db-admin.ts
import { pool } from '@/lib/db'

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
