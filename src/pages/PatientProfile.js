import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientService } from '../services/apiService'
import { toast } from 'react-toastify'

const PatientProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.userId || user?.id
    if (!userId) {
      navigate('/login')
      return
    }

    fetchProfile(userId)
  }, [navigate])

  const fetchProfile = async (userId) => {
    try {
      const response = await patientService.getProfile(userId)
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="text-sm text-gray-600">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-lg font-medium text-gray-900">{profile?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-lg font-medium text-gray-900">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-lg font-medium text-gray-900">{profile?.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="text-lg font-medium text-gray-900">{profile?.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <p className="text-lg font-medium text-gray-900 capitalize">{profile?.bloodGroup}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-lg font-medium text-gray-900 capitalize">{profile?.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-lg font-medium text-gray-900">
                  {profile?.dateOfBirth ? new Date(profile?.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Condition</label>
                <p className="text-lg font-medium text-gray-900">{profile?.medicalCondition}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <p className="text-lg font-medium text-gray-900">
                  {profile?.emergencyContactAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => navigate('/patient-profile/edit')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile