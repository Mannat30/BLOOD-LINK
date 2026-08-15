import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { donorService } from '../services/apiService'
import { toast } from 'react-toastify'

const DonorProfile = () => {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    bloodGroup: '',
    gender: '',
    dateOfBirth: '',
    weight: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
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
      const response = await donorService.getProfile(userId)
      setProfile(response.data)
      setFormData({
        bloodGroup: response.data.bloodGroup || '',
        gender: response.data.gender || '',
        dateOfBirth: response.data.dateOfBirth || '',
        weight: response.data.weight || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        latitude: response.data.latitude || '',
        longitude: response.data.longitude || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user?.userId || user?.id
      if (!userId) return

      const response = await donorService.updateProfile(userId, formData)
      toast.success('Profile updated successfully')
      setProfile(response.data)
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
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
          <h1 className="text-2xl font-bold text-gray-900">Donor Profile</h1>
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
            <h2 className="text-xl font-semibold mb-4">Blood Information</h2>
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
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <p className="text-lg font-medium text-gray-900">{profile?.weight} kg</p>
              </div>
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

        <div className="flex justify-end">
          <button 
            onClick={() => navigate('/donor-profile/edit')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonorProfile