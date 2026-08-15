import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { matchingService } from '../services/apiService'
import { toast } from 'react-toastify'
import { HiUser, HiHeart, HiCheck, HiX, HiArrowLeft } from 'react-icons/hi'

const DonorRanking = () => {
  const { requestId } = useParams()
  const [rankedDonors, setRankedDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRankedDonors()
  }, [requestId])

  const fetchRankedDonors = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await matchingService.rankDonors(requestId)
      setRankedDonors(response.data)
    } catch (err) {
      setError('Failed to fetch ranked donors')
      console.error('Error fetching ranked donors:', err)
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
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Donors</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchRankedDonors}
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
              onClick={() => navigate(`/eligible-donors/${requestId}`)}
              className="mr-4 p-2 text-gray-600 hover:text-blue-600"
            >
              <HiArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Ranked Donors</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {rankedDonors.length === 0 ? (
            <div className="text-center py-12">
              <HiUser className="text-4xl text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-600 mb-2">No Ranked Donors Found</h2>
              <p className="text-gray-500">No donors have been ranked for this request yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankedDonors.map((donor) => (
                    <tr key={donor.id || donor.userId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <HiUser className="text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {donor.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {donor.bloodGroup?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donor.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => navigate(`/donor/${donor.id || donor.userId}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Profile
                        </button>
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

export default DonorRanking