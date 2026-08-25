import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  donationHistoryService,
  bloodAllocationService
} from '../services/apiService'

import { toast } from 'react-toastify'

import {
  HiUser,
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiBeaker,
  HiRefresh,
  HiClock
} from 'react-icons/hi'


const DonationHistory = () => {

  const [donations, setDonations] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  // Stores the donation currently being allocated
  const [allocationId, setAllocationId] = useState(null)

  // Units entered in allocation input
  const [allocatedUnits, setAllocatedUnits] = useState({})

  const navigate = useNavigate()


  // =====================================================
  // FETCH DONATIONS
  // =====================================================

  useEffect(() => {

    fetchDonations()

  }, [])


  const fetchDonations = async () => {

    setLoading(true)

    setError(null)

    try {

      const response =
          await donationHistoryService.getAllDonations()

      const data = Array.isArray(response.data)
          ? response.data
          : []

      setDonations(data)

    } catch (err) {

      console.error(
          'Error fetching donations:',
          err
      )

      setError(
          err.response?.data?.message ||
          'Failed to fetch donation history'
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // HANDLE UNITS INPUT
  // =====================================================

  const handleUnitsChange = (
      donationId,
      value
  ) => {

    setAllocatedUnits(previous => ({

      ...previous,

      [donationId]: value

    }))

  }


  // =====================================================
  // ALLOCATE BLOOD
  // =====================================================

  const handleAllocate = async (donation) => {

    const donationId =
        donation?.donationId

    const units =
        Number(
            allocatedUnits[donationId]
        )


    // =================================================
    // VALIDATE DONATION ID
    // =================================================

    if (!donationId) {

      toast.error(
          'Donation ID not found'
      )

      return
    }


    // =================================================
    // VALIDATE UNITS
    // =================================================

    if (!units || units <= 0) {

      toast.error(
          'Enter valid units to allocate'
      )

      return
    }


    // =================================================
    // CHECK SUCCESSFUL DONATION
    // =================================================

    if (!donation.successful) {

      toast.error(
          'Only successful donations can be allocated'
      )

      return
    }


    try {

      setAllocationId(donationId)


      console.log(
          'Allocating blood...'
      )

      console.log(
          'Donation ID:',
          donationId
      )

      console.log(
          'Units:',
          units
      )


      // =================================================
      // CALL BACKEND
      // =================================================

      const response =
          await bloodAllocationService.createAllocation(
              donationId,
              {
                allocatedUnits: units
              }
          )


      console.log(
          'Allocation response:',
          response.data
      )


      toast.success(
          'Blood allocated successfully'
      )


      // =================================================
      // CLEAR INPUT
      // =================================================

      setAllocatedUnits(previous => {

        const updated = {
          ...previous
        }

        delete updated[donationId]

        return updated

      })


    } catch (error) {

      console.error(
          'Allocation error:',
          error
      )

      console.error(
          'Response:',
          error.response?.data
      )


      toast.error(
          error.response?.data?.message ||
          'Failed to allocate blood'
      )

    } finally {

      setAllocationId(null)

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">

          <div className="text-center">

            <HiRefresh
                className="animate-spin text-4xl text-red-600 mx-auto mb-3"
            />

            <p className="text-gray-500">
              Loading donation history...
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

          <div className="text-center">

            <h2 className="text-xl font-bold text-red-600 mb-4">
              Error Loading Donations
            </h2>

            <p className="text-gray-600">
              {error}
            </p>

            <button
                onClick={fetchDonations}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

        <div className="max-w-7xl mx-auto p-6">


          {/* =================================================
            HEADER
        ================================================= */}

          <div className="flex justify-between items-center mb-6">

            <div className="flex items-center">

              <button
                  onClick={() =>
                      navigate('/dashboard')
                  }
                  className="mr-4 p-3 rounded-lg bg-white shadow-sm text-gray-600 hover:text-red-600"
              >

                <HiArrowLeft className="text-xl" />

              </button>


              <div>

                <h1 className="text-2xl font-bold text-gray-900">
                  Donation History
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  View donations and allocate donated blood
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
            DONATIONS
        ================================================= */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {donations.length === 0 ? (

                <div className="text-center py-12">

                  <HiUser
                      className="text-5xl text-gray-300 mx-auto mb-4"
                  />

                  <h2 className="text-xl font-bold text-gray-600 mb-2">
                    No Donations Found
                  </h2>

                  <p className="text-gray-500">
                    No donation records are available.
                  </p>

                </div>

            ) : (

                <div className="space-y-4">

                  {donations.map((donation) => {

                    const donationId =
                        donation.donationId

                    const isSuccessful =
                        donation.successful === true

                    const isAllocating =
                        allocationId === donationId

                    const enteredUnits =
                        allocatedUnits[donationId] || ''


                    return (

                        <div
                            key={donationId}
                            className="rounded-xl border border-gray-200 p-5 hover:border-red-100 transition"
                        >

                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                            {/* =================================================
                          DONATION INFO
                      ================================================= */}

                            <div className="flex items-start gap-4">

                              <div
                                  className={`
                            flex-shrink-0
                            w-12
                            h-12
                            rounded-full
                            flex
                            items-center
                            justify-center
                            ${
                                      isSuccessful
                                          ? 'bg-green-100'
                                          : 'bg-red-100'
                                  }
                          `}
                              >

                                {isSuccessful ? (

                                    <HiCheckCircle
                                        className="text-2xl text-green-600"
                                    />

                                ) : (

                                    <HiXCircle
                                        className="text-2xl text-red-600"
                                    />

                                )}

                              </div>


                              <div>

                                <h3 className="text-lg font-semibold text-gray-900">

                                  {donation.donationDate
                                      ? new Date(
                                          donation.donationDate
                                      ).toLocaleDateString()
                                      : 'N/A'}

                                </h3>


                                <div className="flex flex-wrap gap-3 mt-2">

                            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold">

                              {donation.unitsDonated}
                              {' '}
                              units

                            </span>


                                  <span
                                      className={`
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-semibold
                                ${
                                          isSuccessful
                                              ? 'bg-green-100 text-green-700'
                                              : 'bg-red-100 text-red-700'
                                      }
                              `}
                                  >

                              {isSuccessful
                                  ? 'Successful'
                                  : 'Failed'}

                            </span>

                                </div>


                                <div className="mt-3 space-y-1">

                                  <p className="text-xs text-gray-500">

                                    Donation ID:

                                  </p>

                                  <p className="text-xs text-gray-700 font-mono break-all">

                                    {donationId}

                                  </p>


                                  <p className="text-xs text-gray-500 mt-2">

                                    Donor ID:

                                  </p>

                                  <p className="text-xs text-gray-700 font-mono break-all">

                                    {donation.donorId || 'N/A'}

                                  </p>


                                  <p className="text-xs text-gray-500 mt-2">

                                    Blood Request ID:

                                  </p>

                                  <p className="text-xs text-gray-700 font-mono break-all">

                                    {donation.requestId || 'N/A'}

                                  </p>

                                </div>

                              </div>

                            </div>


                            {/* =================================================
                          ALLOCATION
                      ================================================= */}

                            {isSuccessful && (

                                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 min-w-[280px]">

                                  <div className="flex items-center gap-2 mb-3">

                                    <HiBeaker className="text-red-600" />

                                    <h4 className="font-semibold text-gray-800">
                                      Allocate Blood
                                    </h4>

                                  </div>


                                  <p className="text-xs text-gray-500 mb-3">

                                    Enter the number of donated units to allocate.

                                  </p>


                                  <div className="flex gap-2">

                                    <input
                                        type="number"
                                        min="1"
                                        max={
                                          donation.unitsDonated
                                        }
                                        value={enteredUnits}
                                        onChange={(e) =>
                                            handleUnitsChange(
                                                donationId,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Units"
                                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />


                                    <button
                                        onClick={() =>
                                            handleAllocate(
                                                donation
                                            )
                                        }
                                        disabled={
                                          isAllocating
                                        }
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                      {isAllocating ? (

                                          <>
                                            <HiRefresh className="animate-spin" />

                                            Allocating...
                                          </>

                                      ) : (

                                          <>
                                            <HiBeaker />

                                            Allocate
                                          </>

                                      )}

                                    </button>

                                  </div>


                                  <p className="text-[11px] text-gray-400 mt-2">

                                    Maximum:
                                    {' '}
                                    {donation.unitsDonated}
                                    {' '}
                                    units

                                  </p>

                                </div>

                            )}

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

export default DonationHistory