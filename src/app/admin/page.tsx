// app/admin/page.tsx
import { getCustomers, getEstimates } from '@/lib/db-admin';

export default async function AdminPage() {
  const [customers, estimates] = await Promise.all([
    getCustomers(),
    getEstimates(),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Database Overview</h1>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Recent Customers
          <span className="ml-2 bg-green-500 text-white text-sm px-2 py-1 rounded">
            {customers.length}
          </span>
        </h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.city}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Recent Estimates
          <span className="ml-2 bg-green-500 text-white text-sm px-2 py-1 rounded">
            {estimates.length}
          </span>
        </h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Timeline</th>
                <th className="p-3 text-left">Style</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e: any) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{e.id}</td>
                  <td className="p-3">
                    {e.customer_name}
                    <br />
                    <span className="text-sm text-gray-600">{e.customer_email}</span>
                  </td>
                  <td className="p-3">{e.timeline}</td>
                  <td className="p-3">{e.style_preference}</td>
                  <td className="p-3 text-sm max-w-xs truncate">{e.notes}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
