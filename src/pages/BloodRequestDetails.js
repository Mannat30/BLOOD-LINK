import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'

const BloodRequestDetails = () => {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    setLoading(true)
    try {
      const response = await bloodRequestService.getRequest(id)
      setRequest(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch request details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    if (!window.confirm('Are you sure you want to cancel this blood request?')) {
      return
    }

    try {
      await bloodRequestService.cancelRequest(id)
      toast.success('Blood request cancelled successfully')
      navigate('/blood-requests')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h2 className="text-xl font-bold text-red-600">Request Not Found</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blood Request Details</h1>
          <button 
            onClick={() => navigate('/blood-requests')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="text-sm text-gray-600">Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Request ID</h2>
              <p className="text-2xl font-bold text-gray-900">{request.requestId}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Status</h2>
              <p className={`text-lg font-medium ${getStatusBadgeColor(request.status)}`}>
                {request.status?.toLowerCase()}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Blood Group</h2>
              <p className="text-2xl font-bold capitalize">{request.bloodGroup?.replace('_', ' ')}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Units Required</h2>
              <p className="text-2xl font-bold">{request.unitsRequired}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Emergency Type</h2>
              <p className="text-lg font-medium capitalize">{request.emergencyType?.replace('_', ' ')}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Priority</h2>
              <p className={`text-lg font-medium ${getPriorityBadgeColor(request.priority)}`}>
                {request.priority?.toLowerCase()}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Required By</h2>
              <p className="text-lg font-medium">{request.requiredBefore ? new Date(request.requiredBefore).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Patient ID</h2>
              <p className="text-lg font-medium text-gray-900">{request.patientId}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Hospital ID</h2>
              <p className="text-lg font-medium text-gray-900">{request.hospitalId}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Reason</h2>
              <p className="text-lg font-medium text-gray-600">{request.reason || 'N/A'}</p>
            </div>
          </div>

          {request.status === 'PENDING' || request.status === 'MATCHING' ? (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Actions</h2>
              <button 
                onClick={handleCancelRequest}
                className="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Request
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Request Status</h2>
              <p className="text-gray-500">This request cannot be cancelled as it is already {request.status?.toLowerCase()}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PENDING': return 'text-yellow-800'
    case 'MATCHING': return 'text-blue-800'
    case 'ACCEPTED': return 'text-green-800'
    case 'IN_PROGRESS': return 'text-purple-800'
    case 'COMPLETED': return 'text-green-800'
    case 'CANCELLED': return 'text-red-800'
    case 'EXPIRED': return 'text-gray-800'
    default: return 'text-gray-800'
  }
}

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'NORMAL': return 'text-green-800'
    case 'HIGH': return 'text-yellow-800'
    case 'CRITICAL': return 'text-red-800'
    default: return 'text-gray-800'
  }
}

export default BloodRequestDetails