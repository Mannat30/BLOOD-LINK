import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  donorService,
  bloodRequestService,
  bloodAllocationService
} from '../services/apiService'

import {
  HiOfficeBuilding,
  HiHeart,
  HiChartBar,
  HiUser,
  HiCalendar,
  HiArrowRight,
  HiCheckCircle,
  HiClock,
  HiClipboardList,
  HiBell,
  HiRefresh,
  HiPlus,
  HiExclamation,
  HiDatabase
} from 'react-icons/hi'


const BloodBankDashboard = ({ user }) => {

  const [donorProfile, setDonorProfile] = useState(null)
  const [bloodRequests, setBloodRequests] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()


  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {

    try {

      const [
        profileRes,
        requestsRes,
        allocationsRes
      ] = await Promise.all([

        donorService.getProfile(user.id),

        bloodRequestService.getPendingRequests(),

        bloodAllocationService.getAllAllocations()

      ])

      setDonorProfile(profileRes.data)

      setBloodRequests(requestsRes.data)

      setAllocations(allocationsRes.data)

    } catch (error) {

      console.error('Error fetching blood bank data:', error)

    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // HELPERS
  // =====================================================

  const formatText = (value) => {

    if (!value) return '--'

    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())

  }


  const getPriorityStyle = (priority) => {

    switch (priority) {

      case 'CRITICAL':
        return 'bg-red-50 text-red-700'

      case 'HIGH':
        return 'bg-orange-50 text-orange-700'

      default:
        return 'bg-emerald-50 text-emerald-700'

    }

  }


  const getStatusStyle = (status) => {

    switch (status) {

      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200'

      case 'MATCHING':
        return 'bg-blue-50 text-blue-700 border-blue-200'

      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'

      case 'ALLOCATED':
        return 'bg-blue-50 text-blue-700 border-blue-200'

      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-200'

      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'

      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'

    }

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
              Loading blood bank dashboard...
            </p>

          </div>

        </div>

    )

  }


  const bloodBankName =
      donorProfile?.name ||
      user?.name ||
      'Blood Bank'


  return (

      <div className="mx-auto max-w-7xl space-y-7">


        {/* =================================================
          HERO
      ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-700 p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">


              <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">

                Blood Bank Portal

              </span>


                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200">

                <HiCheckCircle />

                Live System

              </span>

              </div>


              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">

                Blood Inventory & Operations

              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-red-100 sm:text-base">

                Monitor blood requests, coordinate allocations,
                and help connect available blood with patients
                who need it.

              </p>


              <div className="mt-6 flex flex-wrap gap-3">

                <button
                    onClick={() => navigate('/blood-requests')}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                >

                  <HiClipboardList className="text-lg" />

                  View Requests

                  <HiArrowRight />

                </button>


                <button
                    onClick={() => navigate('/blood-allocation')}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >

                  <HiDatabase />

                  Allocations

                </button>

              </div>

            </div>


            <div className="hidden lg:flex">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">

                  <HiOfficeBuilding className="text-6xl text-red-600" />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
          STATISTICS
      ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* Blood Bank */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiOfficeBuilding className="text-2xl text-red-600" />

              </div>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">

              BANK

            </span>

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Blood Bank
            </p>


            <p className="mt-1 truncate text-xl font-bold text-slate-800">

              {bloodBankName}

            </p>

          </div>


          {/* Availability */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

              {donorProfile?.available ? (

                  <HiCheckCircle className="text-2xl text-emerald-600" />

              ) : (

                  <HiClock className="text-2xl text-amber-600" />

              )}

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Availability
            </p>


            <p className={`mt-1 text-xl font-bold ${
                donorProfile?.available
                    ? 'text-emerald-600'
                    : 'text-amber-600'
            }`}>

              {donorProfile?.available
                  ? 'Available'
                  : 'Unavailable'}

            </p>

          </div>


          {/* Requests */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">

              <HiHeart className="text-2xl text-orange-600" />

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Pending Requests
            </p>


            <p className="mt-1 text-2xl font-bold text-slate-800">
              {bloodRequests.length}
            </p>

          </div>


          {/* Allocations */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

              <HiChartBar className="text-2xl text-violet-600" />

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Total Allocations
            </p>


            <p className="mt-1 text-2xl font-bold text-slate-800">
              {allocations.length}
            </p>

          </div>

        </div>


        {/* =================================================
          QUICK ACTIONS
      ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              Blood Bank Operations
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Quick Actions
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


            <Link
                to="/donor-profile"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiUser className="text-2xl text-blue-600" />

              </div>


              <h3 className="mt-5 font-bold text-slate-800">
                Profile
              </h3>


              <p className="mt-1 text-xs leading-5 text-slate-400">
                View and manage your account information.
              </p>


              <HiArrowRight className="mt-4 text-blue-500 transition group-hover:translate-x-1" />

            </Link>


            <Link
                to="/blood-requests"
                className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiHeart className="text-2xl text-red-600" />

              </div>


              <h3 className="mt-5 font-bold text-slate-800">
                Blood Requests
              </h3>


              <p className="mt-1 text-xs leading-5 text-slate-400">
                Monitor patients and hospitals requiring blood.
              </p>


              <HiArrowRight className="mt-4 text-red-500 transition group-hover:translate-x-1" />

            </Link>


            <Link
                to="/blood-allocation"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiChartBar className="text-2xl text-emerald-600" />

              </div>


              <h3 className="mt-5 font-bold text-slate-800">
                Allocations
              </h3>


              <p className="mt-1 text-xs leading-5 text-slate-400">
                Track blood distribution and allocation status.
              </p>


              <HiArrowRight className="mt-4 text-emerald-500 transition group-hover:translate-x-1" />

            </Link>


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
                Stay updated with important blood alerts.
              </p>


              <HiArrowRight className="mt-4 text-violet-500 transition group-hover:translate-x-1" />

            </Link>

          </div>

        </section>


        {/* =================================================
          PENDING BLOOD REQUESTS
      ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                Urgent Requirements
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Pending Blood Requests
              </h2>

            </div>


            <div className="flex gap-2">

              <button
                  onClick={fetchData}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >

                <HiRefresh />

                Refresh

              </button>


              <Link
                  to="/blood-requests"
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
              >

                View All

                <HiArrowRight />

              </Link>

            </div>

          </div>


          {bloodRequests.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                  <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Request
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Blood Group
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {bloodRequests.slice(0, 5).map(request => (

                      <tr
                          key={request.requestId}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-slate-700">

                            #{request.requestId}

                          </p>

                        </td>


                        <td className="px-6 py-4">

                      <span className="inline-flex h-9 min-w-12 items-center justify-center rounded-lg bg-red-50 px-3 text-sm font-bold text-red-600">

                        {formatText(request.bloodGroup)}

                      </span>

                        </td>


                        <td className="px-6 py-4">

                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(request.priority)}`}>

                        {formatText(request.priority)}

                      </span>

                        </td>


                        <td className="px-6 py-4">

                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(request.status)}`}>

                        {formatText(request.status)}

                      </span>

                        </td>


                        <td className="px-6 py-4 text-right">

                          <button
                              onClick={() =>
                                  navigate(`/blood-request/${request.requestId}`)
                              }
                              className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                          >

                            View →

                          </button>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>

          ) : (

              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">

                  <HiCheckCircle className="text-3xl text-emerald-500" />

                </div>


                <h3 className="mt-5 font-semibold text-slate-700">
                  No pending requests
                </h3>


                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  There are currently no pending blood requirements.
                </p>

              </div>

          )}

        </section>


        {/* =================================================
          RECENT ALLOCATIONS
      ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                Distribution
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Recent Allocations
              </h2>

            </div>


            <Link
                to="/blood-allocation"
                className="flex items-center gap-2 self-start rounded-xl bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >

              View all

              <HiArrowRight />

            </Link>

          </div>


          {allocations.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                  <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Allocation
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Donor
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Units
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {allocations.slice(0, 5).map(allocation => (

                      <tr
                          key={allocation.allocationId}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                      <span className="text-sm font-semibold text-slate-700">

                        #{allocation.allocationId}

                      </span>

                        </td>


                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

                              <HiUser className="text-red-600" />

                            </div>

                            <span className="max-w-[150px] truncate text-sm text-slate-600">

                          {allocation.donorId}

                        </span>

                          </div>

                        </td>


                        <td className="px-6 py-4">

                      <span className="font-semibold text-slate-700">

                        {allocation.allocatedUnits} units

                      </span>

                        </td>


                        <td className="px-6 py-4">

                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(allocation.status)}`}>

                        {formatText(allocation.status)}

                      </span>

                        </td>


                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-500">

                            <HiCalendar />

                            {allocation.allocatedAt
                                ? new Date(
                                    allocation.allocatedAt
                                ).toLocaleDateString()
                                : '--'}

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>

          ) : (

              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

                  <HiChartBar className="text-3xl text-blue-500" />

                </div>


                <h3 className="mt-5 font-semibold text-slate-700">
                  No allocations yet
                </h3>


                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Blood allocation activity will appear here.
                </p>

              </div>

          )}

        </section>


        {/* =================================================
          INFORMATION BANNER
      ================================================= */}

        <section className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">

              <HiHeart className="text-xl text-red-600" />

            </div>


            <div>

              <h3 className="font-bold text-red-800">
                Every unit can save a life
              </h3>


              <p className="mt-1 max-w-3xl text-sm leading-6 text-red-700">

                Keep blood requests and allocations up to date
                so hospitals, donors and patients can coordinate
                faster during emergencies.

              </p>

            </div>

          </div>

        </section>

      </div>

  )

}


export default BloodBankDashboard