import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  bloodRequestService,
  matchingService,
  notificationService
} from '../services/apiService'

import { toast } from 'react-toastify'

import {
  HiHeart,
  HiArrowLeft,
  HiClock,
  HiCheckCircle,
  HiExclamation,
  HiUser,
  HiOfficeBuilding,
  HiTrash,
  HiRefresh,
  HiInformationCircle,
  HiLocationMarker,
  HiPaperAirplane,
  HiStar
} from 'react-icons/hi'


const BloodRequestDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  // =========================
  // MATCHING STATES
  // =========================

  const [donors, setDonors] = useState([])
  const [matching, setMatching] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(null)


  // =====================================================
  // FETCH REQUEST
  // =====================================================

  useEffect(() => {
    fetchRequest()
  }, [id])


  const fetchRequest = async () => {

    setLoading(true)

    try {

      const response =
          await bloodRequestService.getRequest(id)

      setRequest(response.data)

    } catch (error) {

      console.error(
          'Error fetching request:',
          error
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to fetch request details'
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // FIND + RANK DONORS
  // =====================================================

  const handleFindDonors = async () => {

    setMatching(true)

    try {

      // ================================================
      // FIND ELIGIBLE DONORS
      // ================================================

      const eligibleResponse =
          await matchingService.findEligibleDonors(id)

      console.log(
          'Eligible donors:',
          eligibleResponse.data
      )


      // ================================================
      // RANK DONORS
      // ================================================

      const rankedResponse =
          await matchingService.rankDonors(id)

      console.log(
          'Ranked donors:',
          rankedResponse.data
      )


      // ================================================
      // IMPORTANT DEBUG
      // ================================================

      console.log(
          'RANKED RESPONSE FULL:',
          JSON.stringify(
              rankedResponse.data,
              null,
              2
          )
      )


      setDonors(
          rankedResponse.data || []
      )


      if (!rankedResponse.data?.length) {

        toast.info(
            'No eligible donors found'
        )

      } else {

        toast.success(
            `${rankedResponse.data.length} donor(s) matched`
        )

      }

    } catch (error) {

      console.error(
          'Error finding matching donors:',
          error
      )

      console.error(
          'Error response:',
          error.response?.data
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to find matching donors'
      )

    } finally {

      setMatching(false)

    }
  }


  // =====================================================
  // SEND NOTIFICATION
  // =====================================================

  const handleSendNotification = async (match) => {

    console.log(
        '========================================'
    )

    console.log(
        'SEND NOTIFICATION CLICKED'
    )

    console.log(
        'FULL MATCH OBJECT:',
        match
    )

    // IMPORTANT:
    // Backend DTO uses "matchId"
    console.log(
        'DONOR MATCH ID:',
        match?.matchId
    )

    console.log(
        '========================================'
    )


    // ================================================
    // GET DONOR MATCH ID
    // ================================================

    const matchId =
        match?.matchId


    // ================================================
    // CHECK ID
    // ================================================

    if (!matchId) {

      console.error(
          'DonorMatch ID NOT FOUND'
      )

      console.error(
          'Received match:',
          match
      )

      toast.error(
          'Donor match ID not found'
      )

      return
    }


    console.log(
        'CALLING NOTIFICATION API WITH ID:',
        matchId
    )


    setNotificationLoading(matchId)


    try {

      // ================================================
      // SEND NOTIFICATION
      // ================================================

      const response =
          await notificationService.sendNotification(
              matchId
          )


      console.log(
          'NOTIFICATION SUCCESS:',
          response.data
      )


      toast.success(
          'Notification sent to donor'
      )


      // ================================================
      // UPDATE UI
      // ================================================

      setDonors(previous =>

          previous.map(item => {

            const itemId =
                item?.matchId


            if (itemId === matchId) {

              return {
                ...item,
                notificationSent: true
              }

            }


            return item

          })

      )


    } catch (error) {

      console.error(
          '========================================'
      )

      console.error(
          'NOTIFICATION ERROR'
      )

      console.error(
          'FULL ERROR:',
          error
      )

      console.error(
          'RESPONSE:',
          error.response?.data
      )

      console.error(
          'STATUS:',
          error.response?.status
      )

      console.error(
          '========================================'
      )


      toast.error(
          error.response?.data?.message ||
          'Failed to send notification'
      )


    } finally {

      setNotificationLoading(null)

    }

  }


  // =====================================================
  // CANCEL REQUEST
  // =====================================================

  const handleCancelRequest = async () => {

    if (
        !window.confirm(
            'Are you sure you want to cancel this blood request?'
        )
    ) {

      return

    }


    try {

      await bloodRequestService.cancelRequest(id)


      toast.success(
          'Blood request cancelled successfully'
      )


      navigate('/blood-requests')


    } catch (error) {

      console.error(
          'Cancel request error:',
          error
      )


      toast.error(
          error.response?.data?.message ||
          'Failed to cancel request'
      )

    }

  }


  // =====================================================
  // FORMAT BLOOD GROUP
  // =====================================================

  const formatBloodGroup = (bloodGroup) => {

    const groups = {

      A_POSITIVE: 'A+',
      A_NEGATIVE: 'A-',

      B_POSITIVE: 'B+',
      B_NEGATIVE: 'B-',

      AB_POSITIVE: 'AB+',
      AB_NEGATIVE: 'AB-',

      O_POSITIVE: 'O+',
      O_NEGATIVE: 'O-'

    }


    return (
        groups[bloodGroup] ||
        bloodGroup ||
        '--'
    )

  }


  // =====================================================
  // FORMAT TEXT
  // =====================================================

  const formatText = (value) => {

    if (!value) {
      return '--'
    }


    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(
            /\b\w/g,
            char => char.toUpperCase()
        )

  }


  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const getStatusConfig = (status) => {

    switch (status) {

      case 'PENDING':

        return {

          label: 'Pending',

          description:
              'Waiting for the request to be processed.',

          bg: 'bg-amber-50',

          text: 'text-amber-700',

          border: 'border-amber-200',

          icon: HiClock,

          dot: 'bg-amber-500'

        }


      case 'MATCHING':

        return {

          label: 'Matching',

          description:
              'BloodLink is working to identify a suitable match.',

          bg: 'bg-blue-50',

          text: 'text-blue-700',

          border: 'border-blue-200',

          icon: HiRefresh,

          dot: 'bg-blue-500'

        }


      case 'ACCEPTED':

        return {

          label: 'Accepted',

          description:
              'The request has been accepted.',

          bg: 'bg-emerald-50',

          text: 'text-emerald-700',

          border: 'border-emerald-200',

          icon: HiCheckCircle,

          dot: 'bg-emerald-500'

        }


      case 'FULFILLED':

        return {

          label: 'Fulfilled',

          description:
              'The blood request has been fulfilled.',

          bg: 'bg-green-50',

          text: 'text-green-700',

          border: 'border-green-200',

          icon: HiCheckCircle,

          dot: 'bg-green-500'

        }


      case 'CANCELLED':

        return {

          label: 'Cancelled',

          description:
              'This blood request has been cancelled.',

          bg: 'bg-red-50',

          text: 'text-red-700',

          border: 'border-red-200',

          icon: HiTrash,

          dot: 'bg-red-500'

        }


      default:

        return {

          label: formatText(status),

          description:
              'Current request status.',

          bg: 'bg-slate-50',

          text: 'text-slate-700',

          border: 'border-slate-200',

          icon: HiInformationCircle,

          dot: 'bg-slate-500'

        }

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="flex min-h-screen items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <HiRefresh
                className="animate-spin text-4xl text-red-600"
            />

            <p className="text-sm text-slate-500">
              Loading request...
            </p>

          </div>

        </div>

    )

  }


  // =====================================================
  // REQUEST NOT FOUND
  // =====================================================

  if (!request) {

    return (

        <div className="flex min-h-screen items-center justify-center">

          <div className="text-center">

            <HiExclamation
                className="mx-auto mb-3 text-5xl text-red-500"
            />

            <h2 className="text-xl font-bold text-slate-800">
              Blood Request Not Found
            </h2>

            <button
                onClick={() =>
                    navigate('/blood-requests')
                }
                className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Requests
            </button>

          </div>

        </div>

    )

  }


  // =====================================================
  // STATUS
  // =====================================================

  const statusConfig =
      getStatusConfig(request.status)

  const StatusIcon =
      statusConfig.icon


  // =====================================================
  // UI
  // =====================================================

  return (

      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


          {/* =========================================
            BACK BUTTON
        ========================================= */}

          <button
              onClick={() =>
                  navigate('/blood-requests')
              }
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"
          >

            <HiArrowLeft />

            Back to Blood Requests

          </button>


          {/* =========================================
            HEADER
        ========================================= */}

          <div className="mb-6 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Blood Request
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-800">
                  Request Details
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Request ID: {request.id}
                </p>

              </div>


              <div
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >

              <span
                  className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`}
              />

                <StatusIcon />

                <span className="text-sm font-bold">
                {statusConfig.label}
              </span>

              </div>

            </div>

          </div>


          {/* =========================================
            REQUEST INFORMATION
        ========================================= */}

          <div className="mb-6 grid gap-6 lg:grid-cols-2">


            {/* BLOOD INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                  <HiHeart className="text-xl text-red-600" />

                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Blood Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Required blood details
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-red-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Blood Group
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {formatBloodGroup(
                        request.bloodGroup
                    )}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Units Required
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {request.unitsRequired || '--'}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Priority
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {formatText(
                        request.priority
                    )}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Emergency Type
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {formatText(
                        request.emergencyType
                    )}
                  </p>

                </div>

              </div>

            </section>


            {/* HOSPITAL INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                  <HiOfficeBuilding className="text-xl text-blue-600" />

                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Hospital Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Hospital handling this request
                  </p>

                </div>

              </div>


              <div className="space-y-4">

                <div>

                  <p className="text-xs font-semibold text-slate-400">
                    Hospital
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {request.hospital?.hospitalName ||
                        '--'}
                  </p>

                </div>


                <div className="flex items-start gap-3">

                  <HiLocationMarker className="mt-1 text-red-500" />

                  <div>

                    <p className="text-xs font-semibold text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-slate-700">

                      {request.hospital?.city || '--'}

                      {request.hospital?.state
                          ? `, ${request.hospital.state}`
                          : ''}

                    </p>

                  </div>

                </div>


                <div className="flex items-start gap-3">

                  <HiUser className="mt-1 text-slate-400" />

                  <div>

                    <p className="text-xs font-semibold text-slate-400">
                      Contact Person
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {request.hospital?.contactPerson ||
                          '--'}
                    </p>

                  </div>

                </div>


                <div className="flex items-start gap-3">

                  <HiPaperAirplane className="mt-1 text-slate-400" />

                  <div>

                    <p className="text-xs font-semibold text-slate-400">
                      Contact Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {request.hospital?.contactPhone ||
                          '--'}
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>


          {/* =========================================
            FIND ELIGIBLE DONORS
        ========================================= */}

          <section className="mb-6 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                  <HiUser className="text-xl text-red-600" />

                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Find Eligible Donors
                  </h2>

                  <p className="text-xs text-slate-400">
                    Find and rank donors suitable for this blood request.
                  </p>

                </div>

              </div>


              <button
                  onClick={handleFindDonors}
                  disabled={matching}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {matching ? (

                    <>
                      <HiRefresh className="animate-spin" />
                      Finding Donors...
                    </>

                ) : (

                    <>
                      <HiRefresh />
                      Find Matching Donors
                    </>

                )}

              </button>

            </div>

          </section>


          {/* =========================================
            DONOR RESULTS
        ========================================= */}

          {donors.length > 0 && (

              <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


                <div className="mb-6 flex items-center justify-between">

                  <div>

                    <h2 className="font-bold text-slate-800">
                      Ranked Donors
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Donors are ranked according to BloodLink matching criteria.
                    </p>

                  </div>


                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">

                {donors.length} Found

              </span>

                </div>


                <div className="space-y-4">

                  {donors.map((match, index) => {

                    // ======================================
                    // IMPORTANT:
                    // Backend DTO property is matchId
                    // ======================================

                    const matchId =
                        match?.matchId


                    const donorName =
                        match?.donorName ||
                        `Donor ${index + 1}`


                    const bloodGroup =
                        match?.bloodGroup


                    const distance =
                        match?.distanceKm


                    const score =
                        match?.finalScore ??
                        match?.compatibilityScore ??
                        match?.bloodLinkScore


                    const notificationSent =
                        match?.notificationSent === true


                    const isSending =
                        notificationLoading === matchId


                    return (

                        <div
                            key={
                                matchId ||
                                match?.donorId ||
                                index
                            }
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-red-100 hover:bg-white hover:shadow-sm"
                        >

                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                            {/* =================================
                          DONOR INFO
                      ================================= */}

                            <div className="flex items-center gap-4">

                              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">

                                <HiUser className="text-xl text-red-600" />

                              </div>


                              <div>

                                <h3 className="font-bold text-slate-800">
                                  {donorName}
                                </h3>


                                <div className="mt-1 flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">

                              {formatBloodGroup(
                                  bloodGroup
                              )}

                            </span>


                                  {distance !== undefined &&
                                      distance !== null && (

                                          <span className="flex items-center gap-1 text-xs text-slate-500">

                                  <HiLocationMarker />

                                            {Number(distance).toFixed(2)}
                                            {' '}
                                            km

                                </span>

                                      )}

                                </div>

                              </div>

                            </div>


                            {/* =================================
                          SCORE + NOTIFICATION
                      ================================= */}

                            <div className="flex items-center gap-5">


                              <div className="text-center">

                                <div className="flex items-center justify-center gap-1">

                                  <HiStar className="text-amber-500" />

                                  <span className="text-lg font-bold text-slate-800">

                              {score !== undefined &&
                              score !== null
                                  ? Number(score).toFixed(1)
                                  : '--'}

                            </span>

                                </div>

                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  Score
                                </p>

                              </div>


                              {/* =================================
                            SEND NOTIFICATION
                        ================================= */}

                              <button
                                  onClick={() =>
                                      handleSendNotification(match)
                                  }
                                  disabled={
                                      !matchId ||
                                      notificationSent ||
                                      isSending
                                  }
                                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                              >

                                {isSending ? (

                                    <>
                                      <HiRefresh className="animate-spin" />
                                      Sending...
                                    </>

                                ) : notificationSent ? (

                                    <>
                                      <HiCheckCircle />
                                      Sent
                                    </>

                                ) : (

                                    <>
                                      <HiPaperAirplane />
                                      Notify Donor
                                    </>

                                )}

                              </button>

                            </div>

                          </div>

                        </div>

                    )

                  })}

                </div>

              </section>

          )}


          {/* =========================================
            CANCEL REQUEST
        ========================================= */}

          {request.status !== 'CANCELLED' &&
              request.status !== 'FULFILLED' && (

                  <div className="flex justify-end">

                    <button
                        onClick={handleCancelRequest}
                        className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >

                      <HiTrash />

                      Cancel Request

                    </button>

                  </div>

              )}

        </div>

      </div>

  )

}


export default BloodRequestDetails