import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    hospitalId: '',
    bloodGroup: '',
    unitsRequired: '',
    emergencyType: '',
    priority: '',
    reason: '',
    requiredBefore: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const bloodGroups = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' }
  ]

  const emergencyTypes = [
    { value: 'ACCIDENT', label: 'Accident' },
    { value: 'SURGERY', label: 'Surgery' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'THALASSEMIA', label: 'Thalassemia' },
    { value: 'CANCER', label: 'Cancer' },
    { value: 'ORGAN_TRANSPLANT', label: 'Organ Transplant' },
    { value: 'INTERNAL_BLEEDING', label: 'Internal Bleeding' },
    { value: 'DENGUE', label: 'Dengue' },
    { value: 'ANEMIA', label: 'Anemia' },
    { value: 'OTHER', label: 'Other' }
  ]

  const priorities = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert string values to appropriate types
      const requestData = {
        ...formData,
        patientId: formData.patientId,
        hospitalId: formData.hospitalId,
        unitsRequired: parseInt(formData.unitsRequired),
        requiredBefore: formData.requiredBefore ? new Date(formData.requiredBefore).toISOString() : null
      }

      const response = await bloodRequestService.createRequest(requestData)
      toast.success('Blood request created successfully!')
      navigate('/blood-requests')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blood request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Blood Request</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="text-sm text-gray-600">Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient UUID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital ID</label>
                <input
                  type="text"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hospital UUID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Units Required</label>
                <input
                  type="number"
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of units"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Type</label>
                <select
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Emergency Type</option>
                  {emergencyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Priority</option>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for blood request"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Required Before</label>
                <input
                  type="datetime-local"
                  name="requiredBefore"
                  value={formData.requiredBefore}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BloodRequestForm