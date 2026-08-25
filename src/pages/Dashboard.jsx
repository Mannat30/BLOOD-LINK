import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  authService,
  donorService,
  patientService,
  hospitalService,
  donationHistoryService
} from '../services/apiService'

import {
  HiUser,
  HiHeart,
  HiCalendar,
  HiBell,
  HiChartBar,
  HiUserGroup,
  HiPencil,
  HiArrowRight,
  HiLogout,
  HiOfficeBuilding,
  HiShieldCheck,
  HiPlus,
  HiClock,
  HiExclamationCircle
} from 'react-icons/hi'

const Dashboard = () => {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()


  // ==========================================
  // FETCH USER DATA
  // ==========================================

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/', { replace: true })
      return
    }

    const userData = JSON.parse(
        localStorage.getItem('user') || '{}'
    )

    setUser(userData)

    fetchProfile(userData.role, userData)
    fetchDonations()

  }, [navigate])


  // ==========================================
  // PREVENT BROWSER BACK ON DASHBOARD
  // ==========================================

  useEffect(() => {

    const preventBack = () => {
      window.history.pushState(
          null,
          '',
          window.location.href
      )
    }

    // Add an extra history state
    window.history.pushState(
        null,
        '',
        window.location.href
    )

    window.addEventListener(
        'popstate',
        preventBack
    )

    return () => {
      window.removeEventListener(
          'popstate',
          preventBack
      )
    }

  }, [])


  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async (role, userData) => {

    try {

      const userId =
          userData?.userId ||
          userData?.id

      if (!userId) return

      switch (role) {

        case 'DONOR': {

          const response =
              await donorService.getProfile(userId)

          setProfile(response.data)

          break
        }

        case 'PATIENT': {

          const response =
              await patientService.getProfile(userId)

          setProfile(response.data)

          break
        }

        case 'HOSPITAL': {

          const response =
              await hospitalService.getProfile(userId)

          setProfile(response.data)

          break
        }

        default:
          break
      }

    } catch (error) {

      console.error(
          'Error fetching profile:',
          error
      )

    }
  }


  // ==========================================
  // FETCH DONATIONS
  // ==========================================

  const fetchDonations = async () => {

    try {

      const response =
          await donationHistoryService.getAllDonations()

      setDonations(response.data)

    } catch (error) {

      console.error(
          'Error fetching donations:',
          error
      )

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    authService.logout()

    toast.info(
        'Logged out successfully'
    )

    // Completely replace current history entry
    window.location.replace('/')

  }


  // ==========================================
  // ROLE CONFIG
  // ==========================================

  const getRoleConfig = (role) => {

    switch (role) {

      case 'DONOR':

        return {
          label: 'Blood Donor',
          icon: HiUserGroup,
          color: 'red',
          description:
              'Help save lives by donating blood to people in need.'
        }

      case 'PATIENT':

        return {
          label: 'Patient',
          icon: HiHeart,
          color: 'rose',
          description:
              'Manage your blood requests and medical needs.'
        }

      case 'HOSPITAL':

        return {
          label: 'Hospital',
          icon: HiOfficeBuilding,
          color: 'blue',
          description:
              'Manage hospital information and blood requirements.'
        }

      case 'BLOOD_BANK':

        return {
          label: 'Blood Bank',
          icon: HiHeart,
          color: 'purple',
          description:
              'Manage blood availability and donation activity.'
        }

      case 'ADMIN':

        return {
          label: 'Administrator',
          icon: HiChartBar,
          color: 'indigo',
          description:
              'Monitor and manage the BloodLink platform.'
        }

      default:

        return {
          label: 'Member',
          icon: HiUser,
          color: 'slate',
          description:
              'Manage your BloodLink account.'
        }
    }
  }


  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const getQuickActions = () => {

    const actions = []

    if (user?.role === 'DONOR') {

      actions.push(

          {
            title: 'Find Blood Requests',
            description:
                'View people who currently need blood',
            icon: HiHeart,
            color: 'red',
            path: '/blood-requests'
          },

          {
            title: 'Update Donor Profile',
            description:
                'Keep your donor information updated',
            icon: HiPencil,
            color: 'blue',
            path: '/donor-profile'
          }

      )
    }


    if (user?.role === 'PATIENT') {

      actions.push(

          {
            title: 'Request Blood',
            description:
                'Create a new blood request',
            icon: HiPlus,
            color: 'red',
            path: '/blood-request/create'
          },

          {
            title: 'My Blood Requests',
            description:
                'Track your existing requests',
            icon: HiHeart,
            color: 'blue',
            path: '/blood-requests'
          },

          {
            title: 'Update Profile',
            description:
                'Manage your patient information',
            icon: HiPencil,
            color: 'green',
            path: '/patient-profile'
          }

      )
    }


    if (user?.role === 'HOSPITAL') {

      actions.push(

          {
            title: 'Hospital Profile',
            description:
                'Manage hospital information',
            icon: HiOfficeBuilding,
            color: 'blue',
            path: '/hospital-profile'
          },

          {
            title: 'Blood Requests',
            description:
                'View and manage blood requests',
            icon: HiHeart,
            color: 'red',
            path: '/blood-requests'
          }

      )
    }


    if (user?.role === 'BLOOD_BANK') {

      actions.push({

        title: 'Blood Requests',
        description:
            'Review current blood requirements',
        icon: HiHeart,
        color: 'red',
        path: '/blood-requests'

      })
    }


    actions.push({

      title: 'Donation History',
      description:
          'View previous donation activity',
      icon: HiCalendar,
      color: 'green',
      path: '/donation-history'

    })


    return actions
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

            <p className="mt-4 text-sm font-medium text-slate-500">
              Preparing your BloodLink dashboard...
            </p>

          </div>

        </div>
    )
  }


  const firstName =
      user?.name?.split(' ')[0] || 'User'

  const roleConfig =
      getRoleConfig(user?.role)

  const RoleIcon =
      roleConfig.icon

  const quickActions =
      getQuickActions()


  return (

      <div className="mx-auto max-w-7xl space-y-7">

        {/* ==========================================
          HERO
      =========================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-6 text-white shadow-xl shadow-red-600/10 sm:p-8 lg:p-10">

          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-white/5" />

          <div className="absolute right-1/3 top-10 h-20 w-20 rounded-full bg-white/5" />


          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-5 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                BloodLink Member
              </span>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">

                <span className="h-2 w-2 rounded-full bg-emerald-300" />

                Active

              </span>

              </div>


              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

                Welcome back,

                <br className="sm:hidden" />

                {' '}

                {firstName}! 👋

              </h1>


              <p className="mt-4 max-w-xl text-sm leading-6 text-red-100 sm:text-base">
                {roleConfig.description}
              </p>


              <div className="mt-7 flex flex-wrap gap-3">

                {user?.role === 'PATIENT' ? (

                    <button
                        onClick={() =>
                            navigate('/blood-request/create')
                        }
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                    >

                      <HiPlus className="text-lg" />

                      Request Blood

                      <HiArrowRight />

                    </button>

                ) : (

                    <button
                        onClick={() =>
                            navigate('/blood-requests')
                        }
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                    >

                      <HiHeart className="text-lg" />

                      Blood Requests

                      <HiArrowRight />

                    </button>

                )}


                <button
                    onClick={() =>
                        navigate('/notifications')
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >

                  <HiBell className="text-lg" />

                  Notifications

                </button>

              </div>

            </div>


            <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-center">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15">

                  <RoleIcon className="text-6xl text-white drop-shadow-lg" />

                </div>

              </div>

              <p className="mt-3 text-xs font-semibold text-red-100">
                {roleConfig.label}
              </p>

            </div>

          </div>

        </section>


        {/* ==========================================
          STATS
      =========================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <RoleIcon className="text-2xl text-blue-600" />

              </div>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-blue-600">
              ACCOUNT
            </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Your Role
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {roleConfig.label}
            </p>

          </div>


          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiHeart className="text-2xl text-red-600" />

              </div>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-red-600">
              BLOOD
            </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Blood Group
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {profile?.bloodGroup || 'Not set'}
            </p>

          </div>


          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiCalendar className="text-2xl text-emerald-600" />

              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600">
              IMPACT
            </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Total Donations
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {donations.length}
            </p>

          </div>


          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

                <HiShieldCheck className="text-2xl text-violet-600" />

              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600">
              ONLINE
            </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Account Status
            </p>

            <p className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-800">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              Active

            </p>

          </div>

        </section>


        {/* ==========================================
          QUICK ACTIONS
      =========================================== */}

        <section>

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
              Shortcuts
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Everything you need, right at your fingertips.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {quickActions.map((action) => {

              const Icon = action.icon

              const colorClasses = {

                red: {
                  box: 'bg-red-50',
                  icon: 'text-red-600',
                  hover: 'group-hover:bg-red-600',
                  arrow: 'text-red-500'
                },

                blue: {
                  box: 'bg-blue-50',
                  icon: 'text-blue-600',
                  hover: 'group-hover:bg-blue-600',
                  arrow: 'text-blue-500'
                },

                green: {
                  box: 'bg-emerald-50',
                  icon: 'text-emerald-600',
                  hover: 'group-hover:bg-emerald-600',
                  arrow: 'text-emerald-500'
                },

                purple: {
                  box: 'bg-purple-50',
                  icon: 'text-purple-600',
                  hover: 'group-hover:bg-purple-600',
                  arrow: 'text-purple-500'
                }

              }

              const colors =
                  colorClasses[action.color] ||
                  colorClasses.blue


              return (

                  <button
                      key={action.title}
                      onClick={() =>
                          navigate(action.path)
                      }
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                  >

                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.box} transition ${colors.hover}`}
                    >

                      <Icon
                          className={`text-2xl ${colors.icon} transition group-hover:text-white`}
                      />

                    </div>


                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-slate-800">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {action.description}
                      </p>

                    </div>


                    <HiArrowRight
                        className={`shrink-0 text-lg ${colors.arrow} transition duration-200 group-hover:translate-x-1`}
                    />

                  </button>

              )

            })}

          </div>

        </section>


        {/* ==========================================
          RECENT DONATIONS
      =========================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Recent Donations
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your latest contribution activity.
              </p>

            </div>


            {donations.length > 0 && (

                <button
                    onClick={() =>
                        navigate('/donation-history')
                    }
                    className="flex items-center gap-1 text-sm font-semibold text-red-600 transition hover:text-red-700"
                >

                  View all

                  <HiArrowRight />

                </button>

            )}

          </div>


          {donations.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[600px]">

                  <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Units
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {donations
                      .slice(0, 5)
                      .map((donation) => (

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

                            {new Date(
                                donation.donationDate
                            ).toLocaleDateString()}

                          </span>

                              </div>

                            </td>


                            <td className="px-6 py-4">

                        <span className="text-sm font-semibold text-slate-700">

                          {donation.unitsDonated} unit
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

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

                  <HiHeart className="text-3xl text-red-300" />

                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-700">
                  No donations yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Your donation history will appear here once
                  you complete your first donation.
                </p>

                {user?.role === 'DONOR' && (

                    <button
                        onClick={() =>
                            navigate('/blood-requests')
                        }
                        className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                    >

                      <HiHeart />

                      Find an Opportunity

                    </button>

                )}

              </div>

          )}

        </section>


        {/* ==========================================
          FOOTER
      =========================================== */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">

          <div className="flex items-center gap-2 text-xs text-slate-400">

            <HiHeart className="text-red-500" />

            <span>
            Every donation can make a difference.
          </span>

          </div>


          <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >

            <HiLogout />

            Logout

          </button>

        </div>

      </div>
  )
}

export default Dashboard