import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { bloodRequestService, bloodAllocationService, donationHistoryService, notificationService } from '../services/apiService'
import { HiUser, HiHeart, HiCalendar, HiBell } from 'react-icons/hi'
const AdminDashboard = ({ user }) => {
  const [bloodRequests, setBloodRequests] = useState([])
  const [allocations, setAllocations] = useState([])
  const [donations, setDonations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [requestsRes, allocationsRes, donationsRes, notificationsRes] = await Promise.all([
        bloodRequestService.getPendingRequests(),
        bloodAllocationService.getAllAllocations(),
        donationHistoryService.getAllDonations(),
        notificationService.getAllNotifications()
      ])
      
      setBloodRequests(requestsRes.data)
      setAllocations(allocationsRes.data)
      setDonations(donationsRes.data)
      setNotifications(notificationsRes.data)
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <HiHeart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Blood Requests</p>
              <p className="text-lg font-semibold text-gray-900">
                {bloodRequests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <HiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Allocations</p>
              <p className="text-lg font-semibold text-gray-900">
                {allocations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <HiUser className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Donations</p>
              <p className="text-lg font-semibold text-gray-900">
                {donations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <HiBell className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Notifications</p>
              <p className="text-lg font-semibold text-gray-900">
                {notifications.length}
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
            <HiCalendar className="h-8 w-8 mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Allocations</p>
          </Link>
          <Link
            to="/donations"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiUser className="h-8 w-8 mx-auto text-green-600" />
            <p className="mt-2 text-sm text-gray-600">Donations</p>
          </Link>
          <Link
            to="/notifications"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <HiBell className="h-8 w-8 mx-auto text-purple-600" />
            <p className="mt-2 text-sm text-gray-600">Notifications</p>
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Blood Requests</h2>
        </div>
        <div className="p-6">
          {bloodRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bloodRequests.map((request) => (
                    <tr key={request.requestId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.requestId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.bloodGroup}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs font-medium rounded-full ${
                          request.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : request.status === 'ACCEPTED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No pending requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard