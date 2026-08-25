import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  donorService,
  bloodRequestService,
  donationHistoryService
} from '../services/apiService'

import { connectDonorWebSocket } from '../services/websocketService'

import { toast } from 'react-toastify'

import {
  HiUser,
  HiHeart,
  HiCalendar,
  HiBell,
  HiArrowRight,
  HiShieldCheck,
  HiRefresh,
  HiUserGroup
} from 'react-icons/hi'


const DonorDashboard = ({ user }) => {

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const storedUser =
      JSON.parse(localStorage.getItem('user') || 'null')

  const currentUser = user || storedUser


  const [donorProfile, setDonorProfile] = useState(null)
  const [bloodRequests, setBloodRequests] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()


  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    fetchData()
  }, [])


  // =====================================================
  // WEBSOCKET
  // =====================================================

  useEffect(() => {

    // Donor profile must be loaded first
    if (!donorProfile?.id) {

      console.log(
          'Waiting for donor profile before connecting WebSocket...'
      )

      return
    }


    console.log(
        'Connecting WebSocket for donor:',
        donorProfile.id
    )


    const disconnect =
        connectDonorWebSocket(
            donorProfile.id,

            (alert) => {

              console.log(
                  '🚨 Emergency alert received:',
                  alert
              )


              const bloodGroup =
                  formatBloodGroup(
                      alert.bloodGroup
                  )


              const hospital =
                  alert.hospitalName ||
                  'Nearby Hospital'


              const distance =
                  alert.distanceKm != null
                      ? `${Number(alert.distanceKm).toFixed(1)} km away`
                      : 'Nearby'


              toast.error(
                  `🚨 ${bloodGroup} blood needed at ${hospital} (${distance})`,
                  {
                    autoClose: 10000
                  }
              )

            }
        )


    // Cleanup when dashboard closes
    return () => {

      console.log(
          'Disconnecting donor WebSocket'
      )

      disconnect()

    }

  }, [donorProfile?.id])


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchData = async () => {

    try {

      // -------------------------------------------------
      // CHECK USER
      // -------------------------------------------------

      if (!currentUser?.id) {

        console.error(
            'User ID not found:',
            currentUser
        )

        toast.error(
            'User session not found. Please login again.'
        )

        setLoading(false)

        return
      }


      console.log(
          'Fetching donor profile for user:',
          currentUser.id
      )


      // -------------------------------------------------
      // API CALLS
      // -------------------------------------------------

      const [
        profileRes,
        requestsRes,
        donationsRes
      ] = await Promise.all([

        donorService.getProfile(
            currentUser.id
        ),

        bloodRequestService.getPendingRequests(),

        donationHistoryService.getAllDonations()

      ])


      // -------------------------------------------------
      // DONOR PROFILE
      // -------------------------------------------------

      setDonorProfile(
          profileRes.data
      )


      // -------------------------------------------------
      // BLOOD REQUESTS
      // -------------------------------------------------

      setBloodRequests(
          Array.isArray(requestsRes.data)
              ? requestsRes.data
              : []
      )


      // -------------------------------------------------
      // DONATIONS
      // -------------------------------------------------

      const allDonations =
          Array.isArray(donationsRes.data)
              ? donationsRes.data
              : []


      setDonations(
          allDonations.filter(
              donation =>
                  donation.donorId === currentUser.id
          )
      )


    } catch (error) {

      console.error(
          'Error fetching dashboard data:',
          error
      )


      // If donor profile doesn't exist
      if (error.response?.status === 404) {

        toast.error(
            'Donor profile not found. Please complete your donor profile.'
        )

      } else {

        toast.error(
            error.response?.data?.message ||
            'Failed to load dashboard data'
        )

      }

    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // BLOOD GROUP FORMAT
  // =====================================================

  const formatBloodGroup = (group) => {

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

    return groups[group] || group || 'Not set'
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

            </div>

            <p className="mt-4 text-sm text-slate-500">

              Loading your donor dashboard...

            </p>

          </div>

        </div>

    )
  }


  // =====================================================
  // FIRST NAME
  // =====================================================

  const firstName =
      currentUser?.name?.split(' ')[0] ||
      currentUser?.username?.split(' ')[0] ||
      'Donor'


  // =====================================================
  // RENDER
  // =====================================================

  return (

      <div className="mx-auto max-w-7xl space-y-7">


        {/* =================================================
          HERO
      ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-6 text-white shadow-xl shadow-red-600/10 sm:p-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 right-20 h-56 w-56 rounded-full bg-white/5" />


          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">

                Donor Portal

              </span>


                {donorProfile?.available && (

                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">

                  <span className="h-2 w-2 rounded-full bg-emerald-300" />

                  Available to Donate

                </span>

                )}

              </div>


              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">

                Welcome, {firstName} ❤️

              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-red-100 sm:text-base">

                Your donation has the power to help someone
                when they need it most. Explore current blood
                requests and make an impact.

              </p>


              <div className="mt-6 flex flex-wrap gap-3">

                <button
                    onClick={() => navigate('/blood-requests')}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                >

                  <HiHeart className="text-lg" />

                  Find Blood Requests

                  <HiArrowRight />

                </button>


                <button
                    onClick={() => navigate('/donor-profile')}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >

                  <HiUser />

                  My Profile

                </button>

              </div>

            </div>


            <div className="hidden lg:flex">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10">

                  <HiHeart className="text-7xl text-white" />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
          STATS
      ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* BLOOD GROUP */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

              <HiHeart className="text-2xl text-red-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">

              Blood Group

            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">

              {formatBloodGroup(
                  donorProfile?.bloodGroup
              )}

            </p>

          </div>


          {/* AVAILABILITY */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    donorProfile?.available
                        ? 'bg-emerald-50'
                        : 'bg-slate-100'
                }`}
            >

              <HiShieldCheck
                  className={`text-2xl ${
                      donorProfile?.available
                          ? 'text-emerald-600'
                          : 'text-slate-500'
                  }`}
              />

            </div>

            <p className="mt-5 text-sm text-slate-400">

              Donation Status

            </p>

            <p
                className={`mt-1 text-xl font-bold ${
                    donorProfile?.available
                        ? 'text-emerald-600'
                        : 'text-slate-700'
                }`}
            >

              {donorProfile?.available
                  ? 'Available'
                  : 'Unavailable'}

            </p>

          </div>


          {/* DONATIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

              <HiCalendar className="text-2xl text-blue-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">

              Total Donations

            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">

              {donations.length}

            </p>

          </div>


          {/* ACTIVE REQUESTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">

              <HiUserGroup className="text-2xl text-orange-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">

              Active Requests

            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">

              {bloodRequests.length}

            </p>

          </div>

        </div>


        {/* =================================================
          DONOR STATUS
      ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      donorProfile?.available
                          ? 'bg-emerald-50'
                          : 'bg-slate-100'
                  }`}
              >

                <HiShieldCheck
                    className={`text-2xl ${
                        donorProfile?.available
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                    }`}
                />

              </div>


              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                  Donation Availability

                </p>


                <h2 className="mt-1 font-bold text-slate-800">

                  {donorProfile?.available
                      ? 'You are available to donate'
                      : 'You are currently unavailable'}

                </h2>


                <p className="mt-1 text-xs text-slate-400">

                  {donorProfile?.available
                      ? 'You may be contacted for matching blood requests.'
                      : 'Update your profile when you are ready to donate.'}

                </p>

              </div>

            </div>


            <Link
                to="/donor-profile"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >

              Update Status

              <HiArrowRight />

            </Link>

          </div>

        </section>


        {/* =================================================
          QUICK ACTIONS
      ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wider text-red-500">

              Shortcuts

            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">

              Quick Actions

            </h2>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


            {/* REQUESTS */}

            <Link
                to="/blood-requests"
                className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiHeart className="text-2xl text-red-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">

                Find Requests

              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">

                Find people who need your blood group.

              </p>

              <HiArrowRight className="mt-4 text-red-500 transition group-hover:translate-x-1" />

            </Link>


            {/* PROFILE */}

            <Link
                to="/donor-profile"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiUser className="text-2xl text-blue-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">

                Donor Profile

              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">

                Keep your donor information updated.

              </p>

              <HiArrowRight className="mt-4 text-blue-500 transition group-hover:translate-x-1" />

            </Link>


            {/* HISTORY */}

            <Link
                to="/donation-history"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiCalendar className="text-2xl text-emerald-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">

                Donation History

              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">

                See your previous donations.

              </p>

              <HiArrowRight className="mt-4 text-emerald-500 transition group-hover:translate-x-1" />

            </Link>


            {/* NOTIFICATIONS */}

            <Link
                to="/notifications"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

                <HiBell className="text-2xl text-violet-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">

                Notifications

              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">

                Check donor matching updates.

              </p>

              <HiArrowRight className="mt-4 text-violet-500 transition group-hover:translate-x-1" />

            </Link>

          </div>

        </section>


        {/* =================================================
          RECENT DONATIONS
      ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">

                Your Impact

              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">

                Recent Donations

              </h2>

            </div>


            <div className="flex gap-2">

              <button
                  onClick={fetchData}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >

                <HiRefresh />

                Refresh

              </button>


              {donations.length > 0 && (

                  <Link
                      to="/donation-history"
                      className="flex items-center gap-1 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >

                    View all

                    <HiArrowRight />

                  </Link>

              )}

            </div>

          </div>


          {donations.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">

                      Donation Date

                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">

                      Units

                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">

                      Status

                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {donations
                      .slice(0, 5)
                      .map(donation => (

                          <tr
                              key={donation.donationId}
                              className="border-b border-slate-100 transition hover:bg-slate-50"
                          >

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

                                  <HiCalendar className="text-red-600" />

                                </div>

                                <span className="text-sm font-medium text-slate-700">

                            {donation.donationDate
                                ? new Date(
                                    donation.donationDate
                                ).toLocaleDateString()
                                : '--'}

                          </span>

                              </div>

                            </td>


                            <td className="px-6 py-4">

                        <span className="font-semibold text-slate-700">

                          {donation.unitsDonated || 0} unit
                          {donation.unitsDonated !== 1
                              ? 's'
                              : ''}

                        </span>

                            </td>


                            <td className="px-6 py-4">

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                donation.successful
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-red-700'
                            }`}
                        >

                          <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                  donation.successful
                                      ? 'bg-emerald-500'
                                      : 'bg-red-500'
                              }`}
                          />

                          {donation.successful
                              ? 'Successful'
                              : 'Failed'}

                        </span>

                            </td>

                          </tr>

                      ))}

                  </tbody>

                </table>

              </div>

          ) : (

              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

                  <HiHeart className="text-3xl text-red-400" />

                </div>

                <h3 className="mt-5 font-semibold text-slate-700">

                  No donations yet

                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-400">

                  Your completed donations will appear here.
                  Keep your donor profile updated to receive
                  matching opportunities.

                </p>

                <Link
                    to="/blood-requests"
                    className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                >

                  Find Opportunities

                </Link>

              </div>

          )}

        </section>


        {/* =================================================
          MOTIVATION
      ================================================= */}

        <section className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">

              <HiHeart className="text-xl text-red-600" />

            </div>

            <div>

              <h3 className="font-bold text-red-800">

                Your donation can make a difference

              </h3>

              <p className="mt-1 text-sm leading-6 text-red-600">

                Every successful donation is an opportunity to
                help someone through a critical moment.

              </p>

            </div>

          </div>

        </section>

      </div>

  )
}


export default DonorDashboard