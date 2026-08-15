import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { hospitalService, bloodRequestService, bloodAllocationService } from '../services/apiService'
import { HiUser, HiHeart, HiCalendar, HiChartBar, HiBuildingOffice } from 'react-icons/hi'

const HospitalDashboard = ({ user }) => {
  const [hospitalProfile, setHospitalProfile] = useState(null)
  const [bloodRequests, setBloodRequests] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes, allocationsRes] = await Promise.all([
        hospitalService.getProfile(user.id),
        bloodRequestService.getPendingRequests(),
        bloodAllocationService.getAllAllocations()
      ])
      
      setHospitalProfile(profileRes.data)
      setBloodRequests(requestsRes.data)
      setAllocations(allocationsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <HiBuildingOffice className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hospital</p>
              <p className="text-lg font-semibold text-gray-900">
                {hospitalProfile?.hospitalName || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <HiHeart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-lg font-semibold text-gray-900">
                {hospitalProfile?.verified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <HiChartBar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Allocations</p>
              <p className="text-lg font-semibold text-gray-900">
                {allocations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/hospital-profile"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiUser className="h-8 w-8 mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Edit Profile</p>
          </Link>
          <Link
            to="/blood-requests"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiHeart className="h-8 w-8 mx-auto text-red-600" />
            <p className="mt-2 text-sm text-gray-600">Blood Requests</p>
          </Link>
          <Link
            to="/allocations"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiCalendar className="h-8 w-8 mx-auto text-green-600" />
            <p className="mt-2 text-sm text-gray-600">Allocations</p>
          </Link>
          <Link
            to="/notifications"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiChartBar className="h-8 w-8 mx-auto text-purple-600" />
            <p className="mt-2 text-sm text-gray-600">Notifications</p>
          </Link>
        </div>
      </div>

      {/* Recent Allocations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Allocations</h2>
        </div>
        <div className="p-6">
          {allocations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocation ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations.slice(0, 5).map((allocation) => (
                    <tr key={allocation.allocationId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.allocationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.donorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.allocatedUnits} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs font-medium rounded-full ${
                          allocation.status === 'ALLOCATED' 
                            ? 'bg-blue-100 text-blue-800' 
                            : allocation.status === 'IN_PROGRESS' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : allocation.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {allocation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(allocation.allocatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No allocations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HospitalDashboard