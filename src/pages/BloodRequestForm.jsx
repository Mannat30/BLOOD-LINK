import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'

import {
  HiHeart,
  HiArrowLeft,
  HiShieldCheck,
  HiExclamation,
  HiClock,
  HiOfficeBuilding,
  HiUser,
  HiInformationCircle,
  HiCheck
} from 'react-icons/hi'

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    hospitalId: '',
    bloodGroup: '',
    unitsRequired: '',
    emergencyType: '',
    priority: '',
    reason: '',
    requiredBefore: ''
  })

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const bloodGroups = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' }
  ]

  const emergencyTypes = [
    { value: 'ACCIDENT', label: 'Accident' },
    { value: 'SURGERY', label: 'Surgery' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'THALASSEMIA', label: 'Thalassemia' },
    { value: 'CANCER', label: 'Cancer' },
    { value: 'ORGAN_TRANSPLANT', label: 'Organ Transplant' },
    { value: 'INTERNAL_BLEEDING', label: 'Internal Bleeding' },
    { value: 'DENGUE', label: 'Dengue' },
    { value: 'ANEMIA', label: 'Anemia' },
    { value: 'OTHER', label: 'Other' }
  ]

  const priorities = [
    {
      value: 'NORMAL',
      label: 'Normal',
      description: 'Blood is needed soon but is not immediately critical.'
    },
    {
      value: 'HIGH',
      label: 'High',
      description: 'Blood is needed urgently.'
    },
    {
      value: 'CRITICAL',
      label: 'Critical',
      description: 'Immediate attention is required.'
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestData = {
        ...formData,
        patientId: formData.patientId,
        hospitalId: formData.hospitalId,
        unitsRequired: parseInt(formData.unitsRequired),
        requiredBefore: formData.requiredBefore
            ? new Date(formData.requiredBefore).toISOString()
            : null
      }

      await bloodRequestService.createRequest(requestData)

      toast.success('Blood request created successfully!')

      navigate('/blood-requests')
    } catch (error) {
      toast.error(
          error.response?.data?.message ||
          'Failed to create blood request'
      )
    } finally {
      setLoading(false)
    }
  }

  const selectedPriority = priorities.find(
      (item) => item.value === formData.priority
  )

  const getPriorityStyle = () => {
    switch (formData.priority) {
      case 'CRITICAL':
        return {
          container: 'border-red-200 bg-red-50',
          icon: 'bg-red-100 text-red-600',
          title: 'text-red-700',
          text: 'text-red-600'
        }

      case 'HIGH':
        return {
          container: 'border-orange-200 bg-orange-50',
          icon: 'bg-orange-100 text-orange-600',
          title: 'text-orange-700',
          text: 'text-orange-600'
        }

      default:
        return {
          container: 'border-blue-200 bg-blue-50',
          icon: 'bg-blue-100 text-blue-600',
          title: 'text-blue-700',
          text: 'text-blue-600'
        }
    }
  }

  const priorityStyle = getPriorityStyle()

  return (
      <div className="mx-auto max-w-6xl">

        {/* ==========================================
          HEADER
      =========================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <button
                type="button"
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
                BloodLink Emergency Services
              </span>

              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create Blood Request
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Submit the details below so BloodLink can help connect
                your request with available blood resources.
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:flex">

            <HiShieldCheck className="text-lg text-emerald-600" />

            <span className="text-xs font-semibold text-emerald-700">
            Secure Request
          </span>

          </div>

        </div>


        {/* ==========================================
          CRITICAL NOTICE
      =========================================== */}

        <div className="mb-6 flex gap-4 rounded-2xl border border-red-100 bg-red-50 p-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <HiInformationCircle className="text-xl text-red-600" />
          </div>

          <div>

            <h3 className="text-sm font-semibold text-red-800">
              Please provide accurate information
            </h3>

            <p className="mt-1 text-xs leading-5 text-red-600">
              Blood group, required units, urgency and required time
              should be entered carefully to help process the request
              correctly.
            </p>

          </div>

        </div>


        {/* ==========================================
          FORM
      =========================================== */}

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ======================================
              LEFT / MAIN FORM
          ======================================= */}

            <div className="space-y-6 lg:col-span-2">

              {/* Patient & Hospital */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <HiUser className="text-xl text-blue-600" />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-800">
                        Patient & Hospital
                      </h2>

                      <p className="text-xs text-slate-400">
                        Identify where the blood is required.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Patient */}

                  <div>

                    <label
                        htmlFor="patientId"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Patient ID
                    </label>

                    <input
                        id="patientId"
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                        placeholder="Enter patient UUID"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                    />

                    <p className="mt-2 text-[11px] text-slate-400">
                      Use the patient identifier associated with the request.
                    </p>

                  </div>


                  {/* Hospital */}

                  <div>

                    <label
                        htmlFor="hospitalId"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Hospital ID
                    </label>

                    <div className="relative">

                      <HiOfficeBuilding className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                      <input
                          id="hospitalId"
                          type="text"
                          name="hospitalId"
                          value={formData.hospitalId}
                          onChange={handleChange}
                          required
                          placeholder="Enter hospital UUID"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      />

                    </div>

                    <p className="mt-2 text-[11px] text-slate-400">
                      Enter the hospital where the patient is being treated.
                    </p>

                  </div>

                </div>

              </section>


              {/* Blood Requirement */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                      <HiHeart className="text-xl text-red-600" />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-800">
                        Blood Requirement
                      </h2>

                      <p className="text-xs text-slate-400">
                        Tell us exactly what type and quantity is needed.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Blood Group */}

                  <div>

                    <label
                        htmlFor="bloodGroup"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Blood Group
                    </label>

                    <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                    >

                      <option value="">
                        Select blood group
                      </option>

                      {bloodGroups.map((group) => (
                          <option
                              key={group.value}
                              value={group.value}
                          >
                            {group.label}
                          </option>
                      ))}

                    </select>


                    {/* Blood group preview */}

                    {formData.bloodGroup && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 p-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                            {bloodGroups.find(
                                (group) =>
                                    group.value === formData.bloodGroup
                            )?.label}
                          </div>

                          <div>

                            <p className="text-xs font-semibold text-red-700">
                              Requested blood group
                            </p>

                            <p className="text-xs text-red-500">
                              Please verify this before submitting.
                            </p>

                          </div>

                        </div>
                    )}

                  </div>


                  {/* Units */}

                  <div>

                    <label
                        htmlFor="unitsRequired"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Units Required
                    </label>

                    <input
                        id="unitsRequired"
                        type="number"
                        name="unitsRequired"
                        value={formData.unitsRequired}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="e.g. 2"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                    />

                    <p className="mt-2 text-[11px] text-slate-400">
                      Enter the number of blood units required.
                    </p>

                  </div>

                </div>

              </section>


              {/* Emergency Information */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                      <HiExclamation className="text-xl text-orange-600" />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-800">
                        Emergency Information
                      </h2>

                      <p className="text-xs text-slate-400">
                        Help us understand the urgency of this request.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Emergency Type */}

                  <div>

                    <label
                        htmlFor="emergencyType"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Emergency Type
                    </label>

                    <select
                        id="emergencyType"
                        name="emergencyType"
                        value={formData.emergencyType}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                    >

                      <option value="">
                        Select emergency type
                      </option>

                      {emergencyTypes.map((type) => (
                          <option
                              key={type.value}
                              value={type.value}
                          >
                            {type.label}
                          </option>
                      ))}

                    </select>

                  </div>


                  {/* Priority */}

                  <div>

                    <label
                        htmlFor="priority"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Priority
                    </label>

                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                    >

                      <option value="">
                        Select priority
                      </option>

                      {priorities.map((priority) => (
                          <option
                              key={priority.value}
                              value={priority.value}
                          >
                            {priority.label}
                          </option>
                      ))}

                    </select>

                  </div>

                </div>


                {/* Priority preview */}

                {selectedPriority && (
                    <div
                        className={`mt-5 flex gap-3 rounded-xl border p-4 ${priorityStyle.container}`}
                    >

                      <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${priorityStyle.icon}`}
                      >
                        <HiExclamation className="text-xl" />
                      </div>

                      <div>

                        <p className={`text-sm font-semibold ${priorityStyle.title}`}>
                          {selectedPriority.label} Priority
                        </p>

                        <p className={`mt-1 text-xs leading-5 ${priorityStyle.text}`}>
                          {selectedPriority.description}
                        </p>

                      </div>

                    </div>
                )}

              </section>


              {/* Reason & Deadline */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                      <HiInformationCircle className="text-xl text-violet-600" />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-800">
                        Additional Information
                      </h2>

                      <p className="text-xs text-slate-400">
                        Provide context and the required deadline.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Reason */}

                <div>

                  <label
                      htmlFor="reason"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Reason for Request
                  </label>

                  <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Briefly explain why blood is required..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />

                  <p className="mt-2 text-[11px] text-slate-400">
                    Please provide only relevant medical/request information.
                  </p>

                </div>


                {/* Deadline */}

                <div className="mt-5">

                  <label
                      htmlFor="requiredBefore"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <HiClock className="text-slate-400" />
                    Required Before
                  </label>

                  <input
                      id="requiredBefore"
                      type="datetime-local"
                      name="requiredBefore"
                      value={formData.requiredBefore}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />

                  <p className="mt-2 text-[11px] text-slate-400">
                    Select the latest time by which the blood is needed.
                  </p>

                </div>

              </section>

            </div>


            {/* ======================================
              RIGHT SUMMARY
          ======================================= */}

            <aside className="lg:col-span-1">

              <div className="sticky top-6 space-y-5">

                {/* Summary */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  <div className="bg-gradient-to-br from-red-600 to-rose-700 p-5 text-white">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-red-100">
                          Request Summary
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          Blood Request
                        </h3>

                      </div>

                      <HiHeart className="text-3xl text-white/80" />

                    </div>

                  </div>


                  <div className="space-y-4 p-5">

                    {/* Blood */}

                    <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Blood Group
                    </span>

                      <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">
                      {formData.bloodGroup
                          ? bloodGroups.find(
                              (group) =>
                                  group.value === formData.bloodGroup
                          )?.label
                          : '--'}
                    </span>

                    </div>


                    {/* Units */}

                    <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Units Required
                    </span>

                      <span className="text-sm font-bold text-slate-800">
                      {formData.unitsRequired || '--'}
                    </span>

                    </div>


                    {/* Emergency */}

                    <div className="flex items-center justify-between gap-3">

                    <span className="text-xs text-slate-400">
                      Emergency
                    </span>

                      <span className="text-right text-xs font-semibold text-slate-700">
                      {formData.emergencyType
                          ? emergencyTypes.find(
                              (type) =>
                                  type.value === formData.emergencyType
                          )?.label
                          : '--'}
                    </span>

                    </div>


                    {/* Priority */}

                    <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Priority
                    </span>

                      {formData.priority ? (
                          <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  formData.priority === 'CRITICAL'
                                      ? 'bg-red-100 text-red-700'
                                      : formData.priority === 'HIGH'
                                          ? 'bg-orange-100 text-orange-700'
                                          : 'bg-blue-100 text-blue-700'
                              }`}
                          >
                        {formData.priority}
                      </span>
                      ) : (
                          <span className="text-xs text-slate-400">
                        --
                      </span>
                      )}

                    </div>


                    <div className="border-t border-slate-100 pt-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                          <HiShieldCheck className="text-emerald-600" />
                        </div>

                        <p className="text-[11px] leading-5 text-slate-400">
                          Your request will be securely submitted
                          to the BloodLink system.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* What happens next */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <h3 className="text-sm font-bold text-slate-800">
                    What happens next?
                  </h3>

                  <div className="mt-4 space-y-4">

                    <div className="flex gap-3">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                        1
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Submit request
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          Your request is securely recorded.
                        </p>
                      </div>

                    </div>


                    <div className="flex gap-3">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                        2
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Request processing
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          BloodLink processes the request.
                        </p>
                      </div>

                    </div>


                    <div className="flex gap-3">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                        3
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Find a match
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          Potential resources can be identified.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>


          {/* ==========================================
            ACTIONS
        =========================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating request...
                  </>
              ) : (
                  <>
                    <HiCheck className="text-lg" />
                    Create Blood Request
                  </>
              )}

            </button>

          </div>

        </form>

      </div>
  )
}

export default BloodRequestForm