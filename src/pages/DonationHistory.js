import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { donationHistoryService } from '../services/apiService'
import { toast } from 'react-toastify'
import { HiCalendar, HiUser, HiCheck, HiX } from 'react-icons/hi'

const DonationHistory = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await donationHistoryService.getAllDonations()
      setDonations(response.data)
    } catch (err) {
      setError('Failed to fetch donation history')
      console.error('Error fetching donations:', err)
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
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Donations</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDonations}
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
            <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <HiUser className="text-4xl text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-600 mb-2">No Donations Found</h2>
              <p className="text-gray-500">You haven't made any donations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.donationId} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <HiUser className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {donation.unitsDonated} units
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {donation.successful ? 'Successful donation' : 'Failed donation'}
                      </p>
                      <div className="text-xs text-gray-500">
                        {donation.donorId ? 'Donor ID: ' + donation.donorId : 'N/A'}
                      </div>
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

export default DonationHistory