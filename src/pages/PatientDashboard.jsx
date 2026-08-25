import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { patientService, bloodRequestService } from '../services/apiService'

import {
  HiUser,
  HiHeart,
  HiClock,
  HiPlus,
  HiBell,
  HiArrowRight,
  HiCalendar,
  HiShieldCheck,
  HiExclamation,
  HiClipboardList,
  HiRefresh,
  HiOfficeBuilding
} from 'react-icons/hi'

const PatientDashboard = ({ user }) => {
  const [patientProfile, setPatientProfile] = useState(null)
  const [bloodRequests, setBloodRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        patientService.getProfile(user.id),
        bloodRequestService.getPendingRequests()
      ])

      setPatientProfile(profileRes.data)
      setBloodRequests(requestsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

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

  const formatText = (value) => {
    if (!value) return '--'

    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200'

      case 'MATCHING':
        return 'bg-blue-50 text-blue-700 border-blue-200'

      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'

      case 'IN_PROGRESS':
        return 'bg-violet-50 text-violet-700 border-violet-200'

      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'

      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'

      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Loading your patient dashboard...
            </p>

          </div>

        </div>
    )
  }

  const firstName =
      user?.name?.split(' ')[0] || 'Patient'

  return (
      <div className="mx-auto max-w-7xl space-y-7">

        {/* =================================================
          HERO
      ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-6 text-white shadow-xl shadow-red-600/10 sm:p-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="flex items-center gap-2">

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                Patient Portal
              </span>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Active
              </span>

              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Hello, {firstName} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-red-100 sm:text-base">
                Manage your blood requests, monitor their status,
                and stay connected with the BloodLink network.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                    onClick={() => navigate('/blood-request/create')}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                >
                  <HiPlus className="text-lg" />
                  Request Blood
                  <HiArrowRight />
                </button>

                <button
                    onClick={() => navigate('/blood-requests')}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <HiClipboardList />
                  View Requests
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

          {/* Blood Group */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiHeart className="text-2xl text-red-600" />

              </div>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
              BLOOD
            </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Blood Group
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">
              {formatBloodGroup(patientProfile?.bloodGroup)}
            </p>

          </div>


          {/* Medical Condition */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

              <HiShieldCheck className="text-2xl text-blue-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Medical Condition
            </p>

            <p className="mt-1 truncate text-xl font-bold text-slate-800">
              {patientProfile?.medicalCondition || 'Not specified'}
            </p>

          </div>


          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">

              <HiClock className="text-2xl text-amber-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Pending Requests
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">
              {bloodRequests.length}
            </p>

          </div>


          {/* Profile */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

              <HiUser className="text-2xl text-emerald-600" />

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Profile
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-600">
              Active
            </p>

          </div>

        </div>


        {/* =================================================
          QUICK ACTIONS
      ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              Shortcuts
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              What would you like to do?
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Link
                to="/blood-request/create"
                className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition group-hover:bg-red-600">

                <HiPlus className="text-2xl text-red-600 group-hover:text-white" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                Request Blood
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Create a new blood request.
              </p>

              <HiArrowRight className="mt-4 text-red-500 transition group-hover:translate-x-1" />

            </Link>


            <Link
                to="/blood-requests"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiClipboardList className="text-2xl text-blue-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                My Requests
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Track your blood requests.
              </p>

              <HiArrowRight className="mt-4 text-blue-500 transition group-hover:translate-x-1" />

            </Link>


            <Link
                to="/patient-profile"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

                <HiUser className="text-2xl text-violet-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                My Profile
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Update your patient details.
              </p>

              <HiArrowRight className="mt-4 text-violet-500 transition group-hover:translate-x-1" />

            </Link>


            <Link
                to="/notifications"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiBell className="text-2xl text-emerald-600" />

              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                Notifications
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Check updates about your requests.
              </p>

              <HiArrowRight className="mt-4 text-emerald-500 transition group-hover:translate-x-1" />

            </Link>

          </div>

        </section>


        {/* =================================================
          REQUESTS
      ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                BloodLink Activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Pending Blood Requests
              </h2>

            </div>

            <button
                onClick={fetchData}
                className="flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <HiRefresh />
              Refresh
            </button>

          </div>


          {bloodRequests.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Request
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Blood
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

                        {formatBloodGroup(request.bloodGroup)}

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
                              className="text-xs font-semibold text-red-600 hover:text-red-700"
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

                  <HiShieldCheck className="text-3xl text-emerald-500" />

                </div>

                <h3 className="mt-5 font-semibold text-slate-700">
                  No pending requests
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  You currently don't have any pending blood requests.
                </p>

                <Link
                    to="/blood-request/create"
                    className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Create Request
                </Link>

              </div>

          )}

        </section>


        {/* =================================================
          INFO
      ================================================= */}

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">

              <HiOfficeBuilding className="text-xl text-blue-600" />

            </div>

            <div>

              <h3 className="text-sm font-bold text-blue-800">
                BloodLink Support
              </h3>

              <p className="mt-1 text-xs leading-5 text-blue-600">
                If your blood requirement is urgent, make sure your
                request has the correct priority and required time.
              </p>

            </div>

          </div>

        </div>

      </div>
  )
}

export default PatientDashboard