'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiService } from '@/services/api'
import { Job } from '@/types'
import { JobCardSkeleton } from '@/components/common/Skeleton'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [similarJobs, setSimilarJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: '',
    portfolio: '',
    linkedin: '',
    github: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const jobData = await apiService.getJobById(params.id as string)
        setJob(jobData)
        
        // Fetch similar jobs
        const similar = await apiService.getSimilarJobs(params.id as string, 3)
        setSimilarJobs(similar)
      } catch (err) {
        setError('Failed to load job details')
        console.error('Error fetching job:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }

    try {
      setSubmitting(true)
      await apiService.applyToJob(job!.id, applicationData)
      setShowApplicationForm(false)
      alert('Application submitted successfully!')
      router.push('/dashboard')
    } catch (err) {
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified'
    const min = salary.min?.toLocaleString()
    const max = salary.max?.toLocaleString()
    return `$${min}${max ? ` - $${max}` : ''} ${salary.currency}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <JobCardSkeleton />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs" className="btn-primary">
            Browse All Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/jobs" className="hover:text-blue-600">Jobs</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{job.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Posted {formatDate(job.postedDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                    job.type === 'full-time' ? 'bg-green-50 text-green-700 border-green-200' :
                    job.type === 'part-time' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    job.type === 'contract' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {job.type.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{formatSalary(job.salary)}</div>
                  <div className="text-sm text-gray-600">Salary</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{job.applications}</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{job.remote ? 'Remote' : 'On-site'}</div>
                  <div className="text-sm text-gray-600">Work Type</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowApplicationForm(true)}
                className="btn-primary w-full"
              >
                Apply Now
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="list-disc list-inside space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {job.company}</h2>
              <p className="text-gray-700 leading-relaxed">
                {job.employer.description || 'A great company to work for with amazing opportunities for growth and development.'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Form */}
            {showApplicationForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for this position</h3>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us why you're interested in this position..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume URL
                    </label>
                    <input
                      type="url"
                      value={applicationData.resume}
                      onChange={(e) => setApplicationData({...applicationData, resume: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={applicationData.portfolio}
                      onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/portfolio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={applicationData.linkedin}
                      onChange={(e) => setApplicationData({...applicationData, linkedin: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={applicationData.github}
                      onChange={(e) => setApplicationData({...applicationData, github: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      href={`/jobs/${similarJob.id}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{similarJob.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{similarJob.company}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{similarJob.location}</span>
                        <span>{formatSalary(similarJob.salary)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
