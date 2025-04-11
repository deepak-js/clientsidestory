export default function PaymentsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payments</h1>
      
      <div className="mb-6 flex justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage invoices and track payments
          </p>
        </div>
        <button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Create Invoice
        </button>
      </div>
      
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Outstanding</h3>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Invoices Sent</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-medium">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div className="font-medium">No transactions yet</div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">-</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">-</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">-</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
