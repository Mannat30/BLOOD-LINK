import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService, donorService, patientService, hospitalService, donationHistoryService } from '../services/apiService'
import { 
  HiUser, HiHeart, HiCalendar, HiBell, HiChartBar, HiUserGroup,
  HiPencil, HiTrash, HiPlus, HiSearch, HiStar, HiCheck, HiX
} from 'react-icons/hi'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)

    fetchProfile(userData.role)
    fetchDonations()
  }, [navigate])

  const fetchProfile = async (role) => {
    try {
      const userId = userData?.userId || userData?.id
      if (!userId) return

      switch (role) {
        case 'DONOR':
          const donorRes = await donorService.getProfile(userId)
          setProfile(donorRes.data)
          break
        case 'PATIENT':
          const patientRes = await patientService.getProfile(userId)
          setProfile(patientRes.data)
          break
        case 'HOSPITAL':
          const hospitalRes = await hospitalService.getProfile(userId)
          setProfile(hospitalRes.data)
          break
        default:
          break
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchDonations = async () => {
    try {
      const res = await donationHistoryService.getAllDonations()
      setDonations(res.data)
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/')
    toast.info('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'DONOR': return HiUserGroup
      case 'PATIENT': return HiHeart
      case 'HOSPITAL': return HiBuilding
      case 'BLOOD_BANK': return HiStar
      case 'ADMIN': return HiChartBar
      default: return HiUser
    }
  }

  const RoleIcon = getRoleIcon(user?.role)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h1>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiBell className="text-2xl text-gray-600" />
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <RoleIcon className="text-3xl text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Your Role</p>
              <p className="font-semibold">{user?.role}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HiHeart className="text-3xl text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="font-semibold">{profile?.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HiCalendar className="text-3xl text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="font-semibold">{donations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HiStar className="text-3xl text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'DONOR' && (
            <>
              <button 
                onClick={() => navigate('/blood-requests')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
              >
                <HiPlus className="mx-auto text-2xl text-gray-400" />
                <p className="mt-2 text-sm font-medium">Create Blood Request</p>
              </button>
              <button 
                onClick={() => navigate('/donor-profile')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
              >
                <HiPencil className="mx-auto text-2xl text-gray-400" />
                <p className="mt-2 text-sm font-medium">Update Profile</p>
              </button>
            </>
          )}
          {user?.role === 'PATIENT' && (
            <>
              <button 
                onClick={() => navigate('/blood-requests')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
              >
                <HiHeart className="mx-auto text-2xl text-gray-400" />
                <p className="mt-2 text-sm font-medium">Request Blood</p>
              </button>
              <button 
                onClick={() => navigate('/patient-profile')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
              >
                <HiPencil className="mx-auto text-2xl text-gray-400" />
                <p className="mt-2 text-sm font-medium">Update Profile</p>
              </button>
            </>
          )}
          {user?.role === 'HOSPITAL' && (
            <>
              <button 
                onClick={() => navigate('/hospital-profile')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
              >
                <HiPencil className="mx-auto text-2xl text-gray-400" />
                <p className="mt-2 text-sm font-medium">Update Hospital Info</p>
              </button>
            </>
          )}
          <button 
            onClick={() => navigate('/donation-history')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center"
          >
            <HiCalendar className="mx-auto text-2xl text-gray-400" />
            <p className="mt-2 text-sm font-medium">Donation History</p>
          </button>
        </div>
      </div>

      {donations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.donationId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.unitsDonated} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-medium rounded-full ${
                        donation.successful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {donation.successful ? 'Successful' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard