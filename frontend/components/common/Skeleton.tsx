export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />
  )
}

export function JobCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-14 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


