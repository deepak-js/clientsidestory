export default function FormsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Forms</h1>
      
      <div className="mb-6 flex justify-between">
        <div>
          <p className="text-muted-foreground">
            Create and manage forms for client onboarding
          </p>
        </div>
        <button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Create New Form
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Client Intake</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Basic information collection form for new clients
          </p>
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Active
          </div>
          <div className="flex space-x-2">
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Edit
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Share
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Results
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Project Brief</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Detailed project requirements collection
          </p>
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>
            Draft
          </div>
          <div className="flex space-x-2">
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Edit
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Share
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Results
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Feedback Survey</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Client satisfaction and feedback collection
          </p>
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Active
          </div>
          <div className="flex space-x-2">
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Edit
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Share
            </button>
            <button className="rounded border border-input bg-background px-3 py-1 text-xs hover:bg-muted">
              Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
