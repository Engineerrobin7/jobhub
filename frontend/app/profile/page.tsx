'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { apiService } from '@/services/api'
import { User } from '@/types'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    education: '',
    experience: 0,
    skills: [] as string[],
    linkedin: '',
    github: '',
    portfolio: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const profileData = await apiService.getProfile()
        setProfile(profileData)
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          education: profileData.education || '',
          experience: profileData.experience || 0,
          skills: profileData.skills || [],
          linkedin: profileData.socialLinks?.linkedin || '',
          github: profileData.socialLinks?.github || '',
          portfolio: profileData.socialLinks?.portfolio || ''
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      
      const updatedProfile = {
        ...formData,
        socialLinks: {
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio
        }
      }
      
      await apiService.updateProfile(updatedProfile)
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null)
      setEditMode(false)
      setMessage('Profile updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }))
    }
  }

  const addCustomSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-2xl p-8">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your professional profile and preferences</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {profile?.name?.charAt(0) || user.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{profile?.name || user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Role</h3>
                    <p className="text-gray-600 capitalize">{user.role}</p>
                  </div>
                  
                  {profile?.location && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600">{profile.location}</p>
                    </div>
                  )}
                  
                  {profile?.experience && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                      <p className="text-gray-600">{profile.experience} years</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-red-600 hover:text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.name || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.location || 'Not specified'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {editMode ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.bio || 'No bio added yet'}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.education}
                          onChange={(e) => setFormData({...formData, education: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Bachelor in Computer Science"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.education || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      {editMode ? (
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="50"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.experience || 0} years</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'SQL', 'AWS', 'Docker', 'Git', 'Agile'].map((skill) => (
                            <label key={skill} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.skills.includes(skill)}
                                onChange={(e) => handleSkillChange(skill, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{skill}</span>
                            </label>
                          ))}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Add custom skill..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addCustomSkill(e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleSkillChange(skill, false)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills added yet</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        {editMode ? (
                          <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.socialLinks?.linkedin ? (
                              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Profile
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        {editMode ? (
                          <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData({...formData, github: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/yourusername"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.socialLinks?.github ? (
                              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Profile
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio
                        </label>
                        {editMode ? (
                          <input
                            type="url"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://yourportfolio.com"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.socialLinks?.portfolio ? (
                              <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Portfolio
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
