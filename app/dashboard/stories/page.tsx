import Link from 'next/link'

export default function StoriesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Client Success Stories</h1>
      
      <div className="mb-6 flex justify-between">
        <div>
          <p className="text-muted-foreground">
            Create and manage client success stories to showcase your work
          </p>
        </div>
        <Link 
          href="/dashboard/stories/new" 
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Create New Story
        </Link>
      </div>
      
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div className="font-medium">No stories yet</div>
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
