'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Track your job applications and career progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">33%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {[
                { company: 'TechCorp Inc.', position: 'Senior Frontend Developer', status: 'Interview', date: '2 days ago' },
                { company: 'StartupXYZ', position: 'Product Manager', status: 'Applied', date: '1 week ago' },
                { company: 'Design Studio Pro', position: 'UX/UI Designer', status: 'Rejected', date: '2 weeks ago' },
                { company: 'DataFlow Systems', position: 'Backend Engineer', status: 'Applied', date: '3 weeks ago' }
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.position}</p>
                    <p className="text-sm text-gray-600">{app.company}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'Interview' ? 'bg-green-100 text-green-800' :
                      app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Recommendations</h2>
            <div className="space-y-4">
              {[
                { title: 'Full Stack Developer', company: 'Innovation Labs', match: '95%' },
                { title: 'React Developer', company: 'Web Solutions Co.', match: '88%' },
                { title: 'Frontend Engineer', company: 'Digital Agency', match: '82%' },
                { title: 'UI Developer', company: 'Creative Studio', match: '78%' }
              ].map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {job.match} match
                    </span>
                    <Link href="/jobs" className="block text-xs text-blue-600 mt-1 hover:underline">
                      View Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
