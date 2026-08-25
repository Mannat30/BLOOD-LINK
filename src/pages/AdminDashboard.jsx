import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  bloodRequestService,
  bloodAllocationService,
  donationHistoryService,
  notificationService
} from '../services/apiService'

import {
  HiHeart,
  HiCalendar,
  HiUser,
  HiBell,
  HiArrowRight,
  HiRefresh,
  HiClipboardList,
  HiDatabase,
  HiCheckCircle,
  HiClock,
  HiExclamation,
  HiChartBar,
  HiShieldCheck
} from 'react-icons/hi'


const AdminDashboard = ({ user }) => {

  const [bloodRequests, setBloodRequests] = useState([])
  const [allocations, setAllocations] = useState([])
  const [donations, setDonations] = useState([])
  const [notifications, setNotifications] = useState([])
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
        requestsRes,
        allocationsRes,
        donationsRes,
        notificationsRes
      ] = await Promise.all([

        bloodRequestService.getPendingRequests(),

        bloodAllocationService.getAllAllocations(),

        donationHistoryService.getAllDonations(),

        notificationService.getAllNotifications()

      ])

      setBloodRequests(requestsRes.data)

      setAllocations(allocationsRes.data)

      setDonations(donationsRes.data)

      setNotifications(notificationsRes.data)

    } catch (error) {

      console.error('Error fetching admin data:', error)

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

      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'

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
              Loading admin dashboard...
            </p>

          </div>

        </div>

    )

  }


  return (

      <div className="mx-auto max-w-7xl space-y-7">


        {/* =================================================
          ADMIN HERO
      ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-red-500/10" />

          <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-red-500/5" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">


              <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">

                Admin Control Center

              </span>


                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">

                <HiShieldCheck />

                System Active

              </span>

              </div>


              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">

                BloodLink Administration

              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">

                Monitor blood requests, donations, allocations and
                notifications from one centralized dashboard.

              </p>


              <div className="mt-6 flex flex-wrap gap-3">

                <button
                    onClick={() => navigate('/blood-requests')}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 hover:bg-red-500"
                >

                  <HiClipboardList className="text-lg" />

                  Manage Requests

                  <HiArrowRight />

                </button>


                <button
                    onClick={() => navigate('/blood-allocation')}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >

                  <HiDatabase />

                  View Allocations

                </button>

              </div>

            </div>


            {/* Admin icon */}

            <div className="hidden lg:flex">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-600">

                  <HiShieldCheck className="text-6xl text-white" />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
          STATISTICS
      ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* Requests */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiHeart className="text-2xl text-red-600" />

              </div>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">

              REQUESTS

            </span>

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Blood Requests
            </p>


            <p className="mt-1 text-3xl font-bold text-slate-800">

              {bloodRequests.length}

            </p>


            <p className="mt-1 text-xs text-slate-400">
              Currently pending
            </p>

          </div>


          {/* Allocations */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiDatabase className="text-2xl text-blue-600" />

              </div>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">

              ALLOCATION

            </span>

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Blood Allocations
            </p>


            <p className="mt-1 text-3xl font-bold text-slate-800">

              {allocations.length}

            </p>


            <p className="mt-1 text-xs text-slate-400">
              Total allocation records
            </p>

          </div>


          {/* Donations */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiUser className="text-2xl text-emerald-600" />

              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">

              DONATIONS

            </span>

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Total Donations
            </p>


            <p className="mt-1 text-3xl font-bold text-slate-800">

              {donations.length}

            </p>


            <p className="mt-1 text-xs text-slate-400">
              Recorded donations
            </p>

          </div>


          {/* Notifications */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

                <HiBell className="text-2xl text-violet-600" />

              </div>

              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600">

              ALERTS

            </span>

            </div>


            <p className="mt-5 text-sm text-slate-400">
              Notifications
            </p>


            <p className="mt-1 text-3xl font-bold text-slate-800">

              {notifications.length}

            </p>


            <p className="mt-1 text-xs text-slate-400">
              System notifications
            </p>

          </div>

        </div>


        {/* =================================================
          QUICK ACTIONS
      ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              Administration
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Quick Actions
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


            {/* Requests */}

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
                Review and monitor blood requirements.
              </p>


              <HiArrowRight className="mt-4 text-red-500 transition group-hover:translate-x-1" />

            </Link>


            {/* Allocations */}

            <Link
                to="/blood-allocation"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiDatabase className="text-2xl text-blue-600" />

              </div>


              <h3 className="mt-5 font-bold text-slate-800">
                Allocations
              </h3>


              <p className="mt-1 text-xs leading-5 text-slate-400">
                Monitor blood allocation records.
              </p>


              <HiArrowRight className="mt-4 text-blue-500 transition group-hover:translate-x-1" />

            </Link>


            {/* Donations */}

            <Link
                to="/donation-history"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiUser className="text-2xl text-emerald-600" />

              </div>


              <h3 className="mt-5 font-bold text-slate-800">
                Donations
              </h3>


              <p className="mt-1 text-xs leading-5 text-slate-400">
                Review recorded donation activity.
              </p>


              <HiArrowRight className="mt-4 text-emerald-500 transition group-hover:translate-x-1" />

            </Link>


            {/* Notifications */}

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
                Monitor platform notifications.
              </p>


              <HiArrowRight className="mt-4 text-violet-500 transition group-hover:translate-x-1" />

            </Link>

          </div>

        </section>


        {/* =================================================
          PENDING REQUESTS
      ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                Attention Required
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

                  {bloodRequests.slice(0, 7).map(request => (

                      <tr
                          key={request.requestId}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

                              <HiHeart className="text-red-600" />

                            </div>


                            <div>

                              <p className="text-sm font-semibold text-slate-700">

                                #{request.requestId}

                              </p>

                              <p className="text-[11px] text-slate-400">
                                Blood request
                              </p>

                            </div>

                          </div>

                        </td>


                        <td className="px-6 py-4">

                      <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">

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
                  All clear
                </h3>


                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  There are currently no pending blood requests.
                </p>

              </div>

          )}

        </section>


        {/* =================================================
          SYSTEM OVERVIEW
      ================================================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">


          {/* Allocation summary */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Distribution
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-800">
                  Allocation Overview
                </h2>

              </div>


              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

                <HiChartBar className="text-xl text-blue-600" />

              </div>

            </div>


            <div className="mt-6 grid grid-cols-2 gap-3">


              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs text-slate-400">
                  Total
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">

                  {allocations.length}

                </p>

              </div>


              <div className="rounded-xl bg-emerald-50 p-4">

                <p className="text-xs text-emerald-600">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-700">

                  {
                    allocations.filter(
                        item => item.status === 'COMPLETED'
                    ).length
                  }

                </p>

              </div>


            </div>


            <Link
                to="/blood-allocation"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >

              Manage Allocations

              <HiArrowRight />

            </Link>

          </section>


          {/* Notification summary */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                  Communication
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-800">
                  Notification Center
                </h2>

              </div>


              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">

                <HiBell className="text-xl text-violet-600" />

              </div>

            </div>


            <div className="mt-6 rounded-xl bg-violet-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">

                  <HiBell className="text-violet-600" />

                </div>


                <div>

                  <p className="text-sm font-bold text-violet-800">

                    {notifications.length} notifications

                  </p>

                  <p className="text-xs text-violet-600">

                    Available in the system

                  </p>

                </div>

              </div>

            </div>


            <Link
                to="/notifications"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >

              Open Notifications

              <HiArrowRight />

            </Link>

          </section>

        </div>


        {/* =================================================
          ADMIN INFORMATION
      ================================================= */}

        <section className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">

              <HiShieldCheck className="text-xl text-red-600" />

            </div>


            <div>

              <h3 className="font-bold text-red-800">
                BloodLink Admin System
              </h3>


              <p className="mt-1 max-w-3xl text-sm leading-6 text-red-700">

                Use this dashboard to monitor the overall blood
                donation workflow, requests, allocations, donations
                and platform notifications.

              </p>

            </div>

          </div>

        </section>

      </div>

  )

}


export default AdminDashboard