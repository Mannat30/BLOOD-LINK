import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '../services/apiService'
import { toast } from 'react-toastify'
import {
  HiBell,
  HiArrowLeft,
  HiCheck,
  HiX,
  HiClock,
  HiRefresh
} from 'react-icons/hi'

const Notifications = () => {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [processingId, setProcessingId] = useState(null)

  const navigate = useNavigate()

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {

    setLoading(true)
    setError(null)

    try {

      const response =
          await notificationService.getAllNotifications()

      const data = Array.isArray(response.data)
          ? response.data
          : []

      setNotifications(data)

      // SENT notifications are unread
      const unread = data.filter(
          notification =>
              notification.status === 'SENT'
      ).length

      setUnreadCount(unread)

    } catch (err) {

      console.error(
          'Error fetching notifications:',
          err
      )

      setError(
          err.response?.data?.message ||
          'Failed to fetch notifications'
      )

    } finally {

      setLoading(false)

    }
  }

  // =====================================================
  // MARK AS READ
  // =====================================================

  const handleMarkAsRead = async (id) => {

    try {

      setProcessingId(id)

      await notificationService.markAsRead(id)

      toast.success('Notification marked as read')

      await fetchNotifications()

    } catch (error) {

      console.error(
          'Error marking notification as read:',
          error
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to mark notification as read'
      )

    } finally {

      setProcessingId(null)
    }
  }

  // =====================================================
  // ACCEPT REQUEST
  // =====================================================

  const handleAcceptRequest = async (id) => {

    try {

      setProcessingId(id)

      await notificationService.acceptRequest(id)

      toast.success(
          'Blood donation request accepted ❤️'
      )

      await fetchNotifications()

    } catch (error) {

      console.error(
          'Error accepting request:',
          error
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to accept request'
      )

    } finally {

      setProcessingId(null)
    }
  }

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  const handleRejectRequest = async (id) => {

    const confirmed = window.confirm(
        'Are you sure you want to reject this blood donation request?'
    )

    if (!confirmed) {
      return
    }

    try {

      setProcessingId(id)

      await notificationService.rejectRequest(id)

      toast.success(
          'Blood donation request rejected'
      )

      await fetchNotifications()

    } catch (error) {

      console.error(
          'Error rejecting request:',
          error
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to reject request'
      )

    } finally {

      setProcessingId(null)
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">

          <div className="text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading notifications...
            </p>

          </div>

        </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">

          <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">

            <HiBell className="text-5xl text-red-300 mx-auto mb-4" />

            <h2 className="text-xl font-bold text-red-600 mb-2">
              Error Loading Notifications
            </h2>

            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <button
                onClick={fetchNotifications}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <HiRefresh />
              Retry
            </button>

          </div>

        </div>
    )
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

      <div className="min-h-screen bg-gray-50">

        <div className="max-w-5xl mx-auto p-6">

          {/* =================================================
            HEADER
        ================================================= */}

          <div className="flex justify-between items-center mb-8">

            <div className="flex items-center">

              <button
                  onClick={() => navigate('/dashboard')}
                  className="mr-4 p-3 rounded-lg bg-white shadow-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
              >
                <HiArrowLeft className="text-xl" />
              </button>

              <div>

                <div className="flex items-center gap-2">

                  <HiBell className="text-red-600 text-2xl" />

                  <h1 className="text-3xl font-bold text-gray-900">
                    Notifications
                  </h1>

                </div>

                <p className="text-gray-500 mt-1">
                  Blood donation requests and updates
                </p>

              </div>

            </div>

            {/* UNREAD COUNT */}

            {unreadCount > 0 && (

                <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium">

              {unreadCount}
                  {' '}
                  {unreadCount === 1 ? 'Unread' : 'Unread'}

            </span>

            )}

          </div>


          {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {notifications.length === 0 ? (

                // =================================================
                // EMPTY STATE
                // =================================================

                <div className="text-center py-16">

                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">

                    <HiBell className="text-4xl text-gray-300" />

                  </div>

                  <h2 className="text-xl font-bold text-gray-700 mb-2">
                    No Notifications
                  </h2>

                  <p className="text-gray-500">
                    You don't have any blood donation requests yet.
                  </p>

                </div>

            ) : (

                // =================================================
                // NOTIFICATIONS
                // =================================================

                <div className="space-y-4">

                  {notifications.map((notification) => {

                    /*
                     * IMPORTANT:
                     *
                     * Backend Notification entity has:
                     *
                     * private UUID id;
                     *
                     * So use notification.id
                     * NOT notification.notificationId
                     */

                    const notificationId =
                        notification.id

                    const isProcessing =
                        processingId === notificationId

                    const isSent =
                        notification.status === 'SENT'

                    const isRead =
                        notification.status === 'READ'

                    const isAccepted =
                        notification.status === 'ACCEPTED'

                    const isRejected =
                        notification.status === 'REJECTED'

                    return (

                        <div
                            key={notificationId}
                            className={`
                      rounded-xl border p-5 transition
                      ${
                                isSent
                                    ? 'border-red-200 bg-red-50/30'
                                    : 'border-gray-200 bg-white'
                            }
                    `}
                        >

                          <div className="flex items-start gap-4">

                            {/* =================================================
                          ICON
                      ================================================= */}

                            <div
                                className={`
                          flex-shrink-0
                          w-12 h-12
                          rounded-full
                          flex items-center justify-center
                          ${
                                    isSent
                                        ? 'bg-red-100'
                                        : isAccepted
                                            ? 'bg-green-100'
                                            : isRejected
                                                ? 'bg-red-100'
                                                : 'bg-gray-100'
                                }
                        `}
                            >

                              {isAccepted ? (

                                  <HiCheck className="text-2xl text-green-600" />

                              ) : isRejected ? (

                                  <HiX className="text-2xl text-red-600" />

                              ) : (

                                  <HiBell
                                      className={`
                              text-2xl
                              ${
                                          isSent
                                              ? 'text-red-600'
                                              : 'text-gray-500'
                                      }
                            `}
                                  />

                              )}

                            </div>


                            {/* =================================================
                          CONTENT
                      ================================================= */}

                            <div className="flex-1 min-w-0">

                              {/* TITLE + STATUS */}

                              <div className="flex justify-between items-start gap-4 mb-2">

                                <h3 className="text-lg font-semibold text-gray-900">

                                  {notification.title ||
                                      'Blood Donation Request'}

                                </h3>

                                <span
                                    className={`
                              px-3 py-1
                              text-xs
                              font-medium
                              rounded-full
                              whitespace-nowrap
                              ${getStatusBadgeColor(
                                        notification.status
                                    )}
                            `}
                                >
                            {formatStatus(
                                notification.status
                            )}
                          </span>

                              </div>


                              {/* MESSAGE */}

                              <div className="text-gray-600 whitespace-pre-line leading-relaxed mb-4">

                                {notification.message ||
                                    'No message available.'}

                              </div>


                              {/* DATE */}

                              <div className="flex items-center gap-2 text-xs text-gray-400">

                                <HiClock />

                                <span>

                            {notification.createdAt
                                ? new Date(
                                    notification.createdAt
                                ).toLocaleString()
                                : 'Just now'}

                          </span>

                              </div>


                              {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                              {(isSent || isRead) && (

                                  <div className="flex flex-wrap gap-3 mt-5">

                                    {/* MARK AS READ */}

                                    {isSent && (

                                        <button
                                            disabled={isProcessing}
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notificationId
                                                )
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
                                        >

                                          <HiCheck />

                                          Mark as Read

                                        </button>

                                    )}


                                    {/* ACCEPT */}

                                    <button
                                        disabled={isProcessing}
                                        onClick={() =>
                                            handleAcceptRequest(
                                                notificationId
                                            )
                                        }
                                        className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                    >

                                      {isProcessing ? (
                                          <span className="animate-spin">
                                  ⟳
                                </span>
                                      ) : (
                                          <HiCheck />
                                      )}

                                      Accept Request

                                    </button>


                                    {/* REJECT */}

                                    <button
                                        disabled={isProcessing}
                                        onClick={() =>
                                            handleRejectRequest(
                                                notificationId
                                            )
                                        }
                                        className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                                    >

                                      {isProcessing ? (
                                          <span className="animate-spin">
                                  ⟳
                                </span>
                                      ) : (
                                          <HiX />
                                      )}

                                      Reject Request

                                    </button>

                                  </div>

                              )}

                            </div>

                          </div>

                        </div>

                    )

                  })}

                </div>

            )}

          </div>

        </div>

      </div>
  )
}


// =====================================================
// STATUS BADGE COLOR
// =====================================================

const getStatusBadgeColor = (status) => {

  switch (status) {

    case 'SENT':
      return 'bg-blue-100 text-blue-800'

    case 'READ':
      return 'bg-gray-100 text-gray-700'

    case 'ACCEPTED':
      return 'bg-green-100 text-green-800'

    case 'REJECTED':
      return 'bg-red-100 text-red-800'

    default:
      return 'bg-gray-100 text-gray-700'
  }
}


// =====================================================
// FORMAT STATUS
// =====================================================

const formatStatus = (status) => {

  if (!status) {
    return 'Unknown'
  }

  return status.charAt(0) +
      status.slice(1).toLowerCase()

}


export default Notifications