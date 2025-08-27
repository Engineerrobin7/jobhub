import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Logo and Brand */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl mb-6">
                <span className="text-3xl font-black text-white">J</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  JobHub
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Where <span className="font-semibold text-white">dreams</span> meet <span className="font-semibold text-white">opportunities</span>. 
                Connect with the world's leading companies and find your perfect career match.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                href="/jobs" 
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <span className="relative z-10">Explore 10,000+ Jobs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </Link>
              <Link 
                href="/register" 
                className="px-12 py-6 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-500 transform hover:-translate-y-2"
              >
                Start Your Journey
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-5xl font-black text-blue-300 mb-2 group-hover:text-white transition-colors duration-300">10K+</div>
                <div className="text-lg text-blue-200 font-medium">Active Jobs</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-blue-300 mb-2 group-hover:text-white transition-colors duration-300">500+</div>
                <div className="text-lg text-blue-200 font-medium">Top Companies</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-blue-300 mb-2 group-hover:text-white transition-colors duration-300">50K+</div>
                <div className="text-lg text-blue-200 font-medium">Success Stories</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                Why <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JobHub</span>?
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're not just a job board. We're your career partner, powered by cutting-edge AI and human expertise.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-500 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-4 hover:shadow-2xl">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered Matching</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Our advanced AI analyzes your skills, experience, and preferences to match you with the perfect opportunities that align with your career goals.
                  </p>
                </div>
              </div>
              
              <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-500 border border-green-100 hover:border-green-200 transform hover:-translate-y-4 hover:shadow-2xl">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Global Network</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Connect with Fortune 500 companies, innovative startups, and remote opportunities from around the world, all in one powerful platform.
                  </p>
                </div>
              </div>
              
              <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-500 border border-purple-100 hover:border-purple-200 transform hover:-translate-y-4 hover:shadow-2xl">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Apply to multiple jobs with one click, track your applications in real-time, and get instant notifications when employers view your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
            Ready to Transform Your Career?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 professionals who found their dream jobs on JobHub. Your next opportunity is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link 
              href="/register" 
              className="px-16 py-6 bg-white text-blue-600 font-black text-xl rounded-2xl hover:bg-gray-100 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-3xl"
            >
              Get Started Free
            </Link>
            <Link 
              href="/jobs" 
              className="px-16 py-6 bg-transparent border-3 border-white text-white font-black text-xl rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-500 transform hover:-translate-y-2"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
