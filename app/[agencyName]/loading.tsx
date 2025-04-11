export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero Section Skeleton */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          
          <div className="mb-4 flex items-center justify-center">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>
          
          <div className="mb-2 flex justify-center">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          
          <div className="mb-8 flex justify-center">
            <div className="h-6 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          
          {/* CTA Buttons Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 sm:w-32"></div>
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 sm:w-32"></div>
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 sm:w-32"></div>
          </div>
        </div>
        
        {/* Success Metrics Skeleton */}
        <div className="mb-16 rounded-xl bg-gray-50 p-8">
          <div className="mb-6 flex justify-center">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Skeleton */}
        <div className="mb-16">
          <div className="mb-6 flex justify-center">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
                  <div>
                    <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="text-center">
          <div className="mx-auto mb-2 h-4 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
