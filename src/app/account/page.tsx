import { getUserSession } from '@/lib/user-auth'
import { redirect } from 'next/navigation'
import { pool } from '@/lib/db'

export default async function AccountPage() {
  const session = await getUserSession()
  if (!session) redirect('/account/login')

  const result = await pool.query(
    `SELECT id, job_number, phase, status, start_date, address
     FROM jobs
     WHERE lower(customer_email) = lower($1)
     ORDER BY created_at DESC`,
    [session.email]
  )

  let invoices: any[] = []
  try {
    const inv = await pool.query(
      `SELECT id, invoice_number, status, issue_date, due_date, total, amount_paid, balance_due
       FROM invoices
       WHERE lower(customer_email) = lower($1)
       ORDER BY created_at DESC`,
      [session.email]
    )
    invoices = inv.rows
  } catch {
    invoices = []
  }

  const data = { jobs: result.rows, invoices }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Orders & Installations</h1>
            <p className="text-gray-600">Signed in as {session.email}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="px-4 py-2 border rounded">Logout</button>
          </form>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b bg-gray-50 font-semibold">Installations</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Job #</th>
                <th className="text-left p-3">Phase</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Start Date</th>
                <th className="text-left p-3">Address</th>
              </tr>
            </thead>
            <tbody>
              {(data.jobs || []).length === 0 ? (
                <tr><td className="p-4 text-gray-500" colSpan={5}>No installations found yet for your email.</td></tr>
              ) : (data.jobs || []).map((job: any) => (
                <tr key={job.id} className="border-t">
                  <td className="p-3 font-medium">{job.job_number || '—'}</td>
                  <td className="p-3">{job.phase || '—'}</td>
                  <td className="p-3">{job.status || '—'}</td>
                  <td className="p-3">{job.start_date ? new Date(job.start_date).toLocaleDateString() : '—'}</td>
                  <td className="p-3">{job.address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 font-semibold">Invoices</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Invoice #</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Issue Date</th>
                <th className="text-left p-3">Due Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Paid</th>
                <th className="text-left p-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(data.invoices || []).length === 0 ? (
                <tr><td className="p-4 text-gray-500" colSpan={7}>No invoices yet.</td></tr>
              ) : (data.invoices || []).map((inv: any) => (
                <tr key={inv.id} className="border-t">
                  <td className="p-3 font-medium">{inv.invoice_number}</td>
                  <td className="p-3">{inv.status}</td>
                  <td className="p-3">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '—'}</td>
                  <td className="p-3">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                  <td className="p-3">${Number(inv.total || 0).toLocaleString()}</td>
                  <td className="p-3">${Number(inv.amount_paid || 0).toLocaleString()}</td>
                  <td className="p-3">${Number(inv.balance_due || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
