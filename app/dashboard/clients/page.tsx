export default function ClientsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Clients</h1>
      
      <div className="mb-6 flex justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage your clients and their information
          </p>
        </div>
        <button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Add New Client
        </button>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div className="font-medium">No clients yet</div>
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
