import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '../services/apiService'
import { toast } from 'react-toastify'
import { HiBell, HiArrowLeft, HiCheck, HiX, HiClock } from 'react-icons/hi'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificationService.getAllNotifications()
      const data = response.data
      setNotifications(data)
      
      // Count unread notifications
      const count = data.filter(n => n.status === 'PENDING' || n.status === 'SENT').length
      setUnreadCount(count)
    } catch (err) {
      setError('Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      toast.success('Notification marked as read')
      fetchNotifications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as read')
    }
  }

  const handleAcceptRequest = async (id) => {
    try {
      await notificationService.acceptRequest(id)
      toast.success('Request accepted')
      fetchNotifications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    }
  }

  const handleRejectRequest = async (id) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return
    }

    try {
      await notificationService.rejectRequest(id)
      toast.success('Request rejected')
      fetchNotifications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Notifications</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-blue-600"
            >
              <HiArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <HiBell className="text-4xl text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-600 mb-2">No Notifications</h2>
              <p className="text-gray-500">You have no new notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.notificationId} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <HiBell className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.title || 'Notification'}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(notification.status)}`}>
                          {notification.status?.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {notification.message || 'No message'}
                      </p>
                      <div className="text-xs text-gray-500">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Just now'}
                      </div>
                    </div>
                    <div className="flex-shrink-0 space-y-2">
                      {notification.status === 'PENDING' || notification.status === 'SENT' && (
                        <>
                          <button 
                            onClick={() => handleMarkAsRead(notification.notificationId)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark as Read
                          </button>
                          {notification.type === 'REQUEST' && (
                            <>
                              <button 
                                onClick={() => handleAcceptRequest(notification.notificationId)}
                                className="ml-2 text-green-600 hover:text-green-800 text-sm"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(notification.notificationId)}
                                className="ml-2 text-red-600 hover:text-red-800 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'SENT': return 'bg-blue-100 text-blue-800'
    case 'READ': return 'bg-gray-100 text-gray-800'
    case 'ACCEPTED': return 'bg-green-100 text-green-800'
    case 'REJECTED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default Notifications