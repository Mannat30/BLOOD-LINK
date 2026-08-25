import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'

import {
  HiSearch,
  HiTrash,
  HiPlus,
  HiClock,
  HiExclamationCircle,
  HiUser,
  HiOfficeBuilding,
  HiHeart,
  HiArrowLeft,
  HiArrowRight,
  HiRefresh,
  HiFilter,
  HiX,
  HiEye
} from 'react-icons/hi'

const BloodRequestList = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await bloodRequestService.getPendingRequests()
      setRequests(response.data)
    } catch (err) {
      setError('Failed to fetch blood requests')
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async (id) => {
    if (
        !window.confirm(
            'Are you sure you want to cancel this blood request?'
        )
    ) {
      return
    }

    try {
      await bloodRequestService.cancelRequest(id)

      toast.success('Blood request cancelled successfully')

      fetchRequests()
    } catch (error) {
      toast.error(
          error.response?.data?.message ||
          'Failed to cancel request'
      )
    }
  }

  // ==========================================
  // FILTERING
  // ==========================================

  const filteredRequests = requests.filter((request) => {
    const search = searchTerm.toLowerCase().trim()

    const matchesSearch =
        !search ||
        request.patientId?.toString().toLowerCase().includes(search) ||
        request.hospitalId?.toString().toLowerCase().includes(search) ||
        request.bloodGroup?.toString().toLowerCase().includes(search) ||
        request.emergencyType?.toString().toLowerCase().includes(search) ||
        request.requestId?.toString().toLowerCase().includes(search)

    const matchesStatus =
        filterStatus === 'all' ||
        request.status?.toString().toLowerCase() ===
        filterStatus.toLowerCase()

    const matchesPriority =
        filterPriority === 'all' ||
        request.priority?.toString().toLowerCase() ===
        filterPriority.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          classes: 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-500'
        }

      case 'MATCHING':
        return {
          label: 'Matching',
          classes: 'bg-blue-50 text-blue-700 border-blue-100',
          dot: 'bg-blue-500'
        }

      case 'ACCEPTED':
        return {
          label: 'Accepted',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500'
        }

      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          classes: 'bg-violet-50 text-violet-700 border-violet-100',
          dot: 'bg-violet-500'
        }

      case 'COMPLETED':
        return {
          label: 'Completed',
          classes: 'bg-green-50 text-green-700 border-green-100',
          dot: 'bg-green-500'
        }

      case 'CANCELLED':
        return {
          label: 'Cancelled',
          classes: 'bg-red-50 text-red-700 border-red-100',
          dot: 'bg-red-500'
        }

      case 'EXPIRED':
        return {
          label: 'Expired',
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400'
        }

      default:
        return {
          label: status || 'Unknown',
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400'
        }
    }
  }

  // ==========================================
  // PRIORITY
  // ==========================================

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'NORMAL':
        return {
          label: 'Normal',
          classes: 'bg-emerald-50 text-emerald-700',
          dot: 'bg-emerald-500'
        }

      case 'HIGH':
        return {
          label: 'High',
          classes: 'bg-orange-50 text-orange-700',
          dot: 'bg-orange-500'
        }

      case 'CRITICAL':
        return {
          label: 'Critical',
          classes: 'bg-red-50 text-red-700',
          dot: 'bg-red-500'
        }

      default:
        return {
          label: priority || 'Unknown',
          classes: 'bg-slate-100 text-slate-600',
          dot: 'bg-slate-400'
        }
    }
  }

  // ==========================================
  // BLOOD GROUP
  // ==========================================

  const formatBloodGroup = (bloodGroup) => {
    if (!bloodGroup) return '--'

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

    return groups[bloodGroup] || bloodGroup
  }

  // ==========================================
  // EMERGENCY
  // ==========================================

  const formatEmergency = (type) => {
    if (!type) return '--'

    return type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading blood requests...
            </p>

          </div>
        </div>
    )
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <HiExclamationCircle className="text-3xl text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Unable to load requests
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
                onClick={fetchRequests}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              <HiRefresh />
              Try Again
            </button>

          </div>

        </div>
    )
  }

  return (
      <div className="mx-auto max-w-7xl">

        {/* ==========================================
          HEADER
      =========================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <button
                onClick={() => navigate('/dashboard')}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <HiArrowLeft className="text-xl" />
            </button>

            <div>

              <div className="flex items-center gap-2">

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                <HiHeart className="text-red-600" />
              </span>

                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                BloodLink
              </span>

              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Blood Requests
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track, search and manage blood requests.
              </p>

            </div>

          </div>


          <button
              onClick={() => navigate('/blood-request/create')}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            <HiPlus className="text-lg" />
            New Request
          </button>

        </div>


        {/* ==========================================
          STATISTICS
      =========================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <HiHeart className="text-xl text-red-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
              TOTAL
            </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-800">
              {requests.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Blood requests
            </p>

          </div>


          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <HiClock className="text-xl text-amber-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
              PENDING
            </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-800">
              {
                requests.filter(
                    (request) => request.status === 'PENDING'
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Awaiting action
            </p>

          </div>


          {/* Critical */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <HiExclamationCircle className="text-xl text-red-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
              CRITICAL
            </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-800">
              {
                requests.filter(
                    (request) => request.priority === 'CRITICAL'
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Urgent requests
            </p>

          </div>


          {/* Accepted */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <HiHeart className="text-xl text-emerald-600" />
              </div>

              <span className="text-xs font-medium text-slate-400">
              ACCEPTED
            </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-800">
              {
                requests.filter(
                    (request) => request.status === 'ACCEPTED'
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Accepted requests
            </p>

          </div>

        </div>


        {/* ==========================================
          SEARCH + FILTERS
      =========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* Search */}

            <div className="relative flex-1">

              <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

              <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient, hospital, blood group or request ID..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />

              {searchTerm && (
                  <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <HiX />
                  </button>
              )}

            </div>


            {/* Filters */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="flex items-center gap-2">

                <HiFilter className="hidden text-slate-400 sm:block" />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 sm:w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="MATCHING">Matching</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                </select>

              </div>


              <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 sm:w-auto"
              >
                <option value="all">All Priorities</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>

            </div>

          </div>


          {/* Active filters */}

          {(searchTerm ||
              filterStatus !== 'all' ||
              filterPriority !== 'all') && (

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">

            <span className="text-xs font-medium text-slate-400">
              Showing {filteredRequests.length} of {requests.length}
            </span>

                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                    >
                      Search: {searchTerm} ×
                    </button>
                )}

                {filterStatus !== 'all' && (
                    <button
                        onClick={() => setFilterStatus('all')}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      Status: {filterStatus} ×
                    </button>
                )}

                {filterPriority !== 'all' && (
                    <button
                        onClick={() => setFilterPriority('all')}
                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                    >
                      Priority: {filterPriority} ×
                    </button>
                )}

              </div>

          )}

        </div>


        {/* ==========================================
          REQUESTS
      =========================================== */}

        {filteredRequests.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <HiSearch className="text-3xl text-slate-400" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-700">
                No Blood Requests Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {requests.length === 0
                    ? 'There are no blood requests available yet.'
                    : 'Try adjusting your search or filter criteria.'}
              </p>

              {requests.length === 0 && (
                  <button
                      onClick={() => navigate('/blood-request/create')}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                  >
                    <HiPlus />
                    Create First Request
                  </button>
              )}

            </div>

        ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Table header */}

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                <div>

                  <h2 className="font-bold text-slate-800">
                    All Requests
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {filteredRequests.length} request
                    {filteredRequests.length !== 1 ? 's' : ''} found
                  </p>

                </div>

                <button
                    onClick={fetchRequests}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title="Refresh"
                >
                  <HiRefresh className="text-lg" />
                </button>

              </div>


              {/* Desktop table */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full">

                  <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Request
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Hospital
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Blood
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Priority
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filteredRequests.map((request) => {

                    const status = getStatusConfig(request.status)
                    const priority = getPriorityConfig(request.priority)

                    return (
                        <tr
                            key={request.requestId}
                            className="border-b border-slate-100 transition hover:bg-slate-50/70"
                        >

                          {/* Request */}

                          <td className="px-5 py-5">

                            <div>

                              <p className="text-sm font-semibold text-slate-800">
                                #{request.requestId
                                  ?.toString()
                                  .substring(0, 8)}
                                ...
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {request.requiredBefore
                                    ? new Date(
                                        request.requiredBefore
                                    ).toLocaleDateString()
                                    : 'No deadline'}
                              </p>

                            </div>

                          </td>


                          {/* Patient */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <HiUser className="text-sm text-blue-600" />
                              </div>

                              <span className="max-w-[120px] truncate text-xs font-medium text-slate-600">
                            {request.patientId}
                          </span>

                            </div>

                          </td>


                          {/* Hospital */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                                <HiOfficeBuilding className="text-sm text-violet-600" />
                              </div>

                              <span className="max-w-[120px] truncate text-xs font-medium text-slate-600">
                            {request.hospitalId}
                          </span>

                            </div>

                          </td>


                          {/* Blood */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-xs font-bold text-white">
                                {formatBloodGroup(request.bloodGroup)}
                              </div>

                              <div>

                                <p className="text-xs font-semibold text-slate-700">
                                  {request.unitsRequired} unit
                                  {request.unitsRequired !== 1 ? 's' : ''}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  {formatEmergency(request.emergencyType)}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* Priority */}

                          <td className="px-5 py-5">

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${priority.classes}`}
                        >

                          <span
                              className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                          />

                          {priority.label}

                        </span>

                          </td>


                          {/* Status */}

                          <td className="px-5 py-5">

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${status.classes}`}
                        >

                          <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          {status.label}

                        </span>

                          </td>


                          {/* Actions */}

                          <td className="px-5 py-5 text-right">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                  onClick={() =>
                                      navigate(
                                          `/blood-request/${request.requestId}`
                                      )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                  title="View request"
                              >
                                <HiEye />
                              </button>

                              {(request.status === 'PENDING' ||
                                  request.status === 'MATCHING') && (

                                  <button
                                      onClick={() =>
                                          handleCancelRequest(
                                              request.requestId
                                          )
                                      }
                                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                      title="Cancel request"
                                  >
                                    <HiTrash />
                                  </button>

                              )}

                            </div>

                          </td>

                        </tr>
                    )
                  })}

                  </tbody>

                </table>

              </div>


              {/* ======================================
              MOBILE CARDS
          ======================================= */}

              <div className="divide-y divide-slate-100 lg:hidden">

                {filteredRequests.map((request) => {

                  const status = getStatusConfig(request.status)
                  const priority = getPriorityConfig(request.priority)

                  return (
                      <div
                          key={request.requestId}
                          className="p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
                              {formatBloodGroup(request.bloodGroup)}
                            </div>

                            <div>

                              <p className="font-bold text-slate-800">
                                {request.unitsRequired} unit
                                {request.unitsRequired !== 1 ? 's' : ''}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                #{request.requestId
                                  ?.toString()
                                  .substring(0, 8)}
                                ...
                              </p>

                            </div>

                          </div>


                          <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.classes}`}
                          >
                      <span
                          className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />
                            {status.label}
                    </span>

                        </div>


                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Priority
                            </p>

                            <span
                                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${priority.classes}`}
                            >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                        />
                              {priority.label}
                      </span>

                          </div>


                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Required By
                            </p>

                            <p className="mt-2 text-xs font-semibold text-slate-700">
                              {request.requiredBefore
                                  ? new Date(
                                      request.requiredBefore
                                  ).toLocaleDateString()
                                  : 'N/A'}
                            </p>

                          </div>

                        </div>


                        <div className="mt-3 space-y-2">

                          <div className="flex items-center gap-2 text-xs text-slate-500">

                            <HiUser className="text-slate-400" />

                            <span className="truncate">
                        Patient: {request.patientId}
                      </span>

                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">

                            <HiOfficeBuilding className="text-slate-400" />

                            <span className="truncate">
                        Hospital: {request.hospitalId}
                      </span>

                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">

                            <HiExclamationCircle className="text-slate-400" />

                            <span>
                        {formatEmergency(request.emergencyType)}
                      </span>

                          </div>

                        </div>


                        <div className="mt-5 flex gap-2">

                          <button
                              onClick={() =>
                                  navigate(
                                      `/blood-request/${request.requestId}`
                                  )
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            <HiEye />
                            View Request
                          </button>

                          {(request.status === 'PENDING' ||
                              request.status === 'MATCHING') && (

                              <button
                                  onClick={() =>
                                      handleCancelRequest(
                                          request.requestId
                                      )
                                  }
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                              >
                                <HiTrash />
                              </button>

                          )}

                        </div>

                      </div>
                  )
                })}

              </div>

            </div>

        )}

      </div>
  )
}

export default BloodRequestList