import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary: string
  postedDate: string
  description: string
  tags: string[]
}

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'part-time':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'contract':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'internship':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 blur-2xl" />
      <div className="p-6 relative">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-md">
              {job.company?.slice(0, 1) || 'J'}
            </div>
            <div>
              <h3 className="mb-1 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-sm font-medium text-gray-600">{job.company}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getTypeStyles(job.type)}`}>
            {job.type.replace('-', ' ')}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="font-medium text-gray-700">{job.salary}</span>
          </div>
          <div className="ml-auto text-xs text-gray-400">{job.postedDate}</div>
        </div>

        <p className="mb-5 line-clamp-3 leading-relaxed text-gray-600">{job.description}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {job.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              +{job.tags.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Link
            href={`/jobs/${job.id}`}
            className="btn-primary w-full text-center"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
