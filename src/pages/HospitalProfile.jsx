import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hospitalService } from '../services/apiService'
import { toast } from 'react-toastify'

const HospitalProfile = () => {
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
      const response = await hospitalService.getProfile(userId)
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
          <h1 className="text-2xl font-bold text-gray-900">Hospital Profile</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="text-sm text-gray-600">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hospital Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <p className="text-lg font-medium text-gray-900">{profile?.hospitalName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <p className="text-lg font-medium text-gray-900">{profile?.registrationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <p className="text-lg font-medium text-gray-900">{profile?.contactPerson}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <p className="text-lg font-medium text-gray-900">{profile?.contactPhone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Verified</label>
                <p className="text-lg font-medium text-gray-900">
                  {profile?.verified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="text-lg font-medium text-gray-900">{profile?.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <p className="text-lg font-medium text-gray-900">{profile?.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <p className="text-lg font-medium text-gray-900">{profile?.pincode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coordinates</label>
                <p className="text-lg font-medium text-gray-900">
                  Lat: {profile?.latitude || 'N/A'}, Long: {profile?.longitude || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => navigate('/hospital-profile/edit')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default HospitalProfile