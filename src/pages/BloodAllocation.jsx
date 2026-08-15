import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'
import { HiPlus, HiArrowLeft } from 'react-icons/hi'

const BloodAllocation = () => {
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    donationId: '',
    allocatedUnits: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllocations()
  }, [])

  const fetchAllocations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bloodRequestService.getAllAllocations()
      setAllocations(response.data)
    } catch (err) {
      setError('Failed to fetch allocations')
      console.error('Error fetching allocations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestData = {
        allocatedUnits: parseInt(formData.allocatedUnits)
      }

      const response = await bloodRequestService.allocateBlood(formData.donationId, requestData)
      toast.success('Blood allocated successfully!')
      setShowForm(false)
      setFormData({ donationId: '', allocatedUnits: '' })
      fetchAllocations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to allocate blood')
    } finally {
      setLoading(false)
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
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Allocations</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchAllocations}
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
            <h1 className="text-2xl font-bold text-gray-900">Blood Allocation</h1>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <HiPlus className="mr-2" /> New Allocation
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Allocation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Donation ID</label>
                  <input
                    type="text"
                    name="donationId"
                    value={formData.donationId}
                    onChange={(e) => setFormData({...formData, donationId: e.target.value})}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter donation UUID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allocated Units</label>
                  <input
                    type="number"
                    name="allocatedUnits"
                    value={formData.allocatedUnits}
                    onChange={(e) => setFormData({...formData, allocatedUnits: e.target.value})}
                    required
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter units"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Allocation'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {allocations.length === 0 ? (
            <div className="text-center py-12">
              <HiPlus className="text-4xl text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-600 mb-2">No Allocations Found</h2>
              <p className="text-gray-500">No blood allocations have been created yet.</p>
            </div>
          ) : (
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
                      Blood Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations.map((allocation) => (
                    <tr key={allocation.allocationId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.allocationId?.toString().substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.donorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.bloodRequestId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.hospitalId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.allocatedUnits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs font-medium rounded-full ${getStatusBadgeColor(allocation.status)}`}>
                          {allocation.status?.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocation.allocatedAt ? new Date(allocation.allocatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'ALLOCATED': return 'bg-blue-100 text-blue-800'
    case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default BloodAllocation