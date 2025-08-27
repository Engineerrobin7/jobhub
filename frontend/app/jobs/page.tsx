"use client"

import { useMemo, useState } from 'react'
import JobCard from '@/components/job/JobCard'
import { JobCardSkeleton } from '@/components/common/Skeleton'
import { useJobs } from '@/hooks/useJobs'

export default function JobsPage() {
  const { jobs, loading, error, searchJobs, applyFilters, pagination, loadMoreJobs } = useJobs()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')

  const displayJobs = useMemo(() => {
    return jobs.map((j: any) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      type: (j.type || 'full-time') as 'full-time' | 'part-time' | 'contract' | 'internship',
      salary: j.salary ? `$${j.salary.min?.toLocaleString?.() || ''}${j.salary.min && j.salary.max ? ' - ' : ''}${j.salary.max?.toLocaleString?.() || ''}` : '—',
      postedDate: j.postedDate ? new Date(j.postedDate).toDateString() : '',
      description: j.description,
      tags: j.tags || [],
    }))
  }, [jobs])

  const onSearch = () => {
    const filters: any = {}
    if (location) filters.location = location
    if (type) filters.type = [type]
    applyFilters(filters)
    if (keyword) searchJobs(keyword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities from top companies around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Job Title or Keywords
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Job Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={onSearch} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                Search Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              {error ? (
                <span className="text-red-600">{error}</span>
              ) : (
                <>Showing <span className="text-blue-600 font-semibold">{displayJobs.length}</span> jobs</>
              )}
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <option value="recent">Most Recent</option>
                <option value="salary">Salary</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
          {!loading && displayJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {!loading && displayJobs.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black">J</div>
              <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button
            onClick={loadMoreJobs}
            disabled={loading || pagination.page >= pagination.totalPages}
            className="px-8 py-4 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            {loading ? 'Loading...' : 'Load More Jobs'}
          </button>
        </div>
      </div>
    </div>
  )
}
