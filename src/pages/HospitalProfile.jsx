import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hospitalService } from '../services/apiService'
import { toast } from 'react-toastify'

import {
  HiOfficeBuilding,
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiMail,
  HiShieldCheck,
  HiPencil,
  HiArrowLeft,
  HiCheck,
  HiX,
  HiIdentification,
  HiGlobeAlt
} from 'react-icons/hi'

const HospitalProfile = () => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    contactPerson: '',
    contactPhone: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: ''
  })

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    )

    const userId = user?.userId || user?.id

    if (!userId) {
      navigate('/')
      return
    }

    fetchProfile(userId)
  }, [navigate])

  const fetchProfile = async (userId) => {
    try {
      const response = await hospitalService.getProfile(userId)

      setProfile(response.data)

      setFormData({
        hospitalName: response.data.hospitalName || '',
        registrationNumber:
            response.data.registrationNumber || '',
        contactPerson:
            response.data.contactPerson || '',
        contactPhone:
            response.data.contactPhone || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        latitude: response.data.latitude || '',
        longitude: response.data.longitude || ''
      })
    } catch (error) {
      console.error('Error fetching hospital profile:', error)

      toast.error(
          error.response?.data?.message ||
          'Failed to load hospital profile'
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async () => {
    try {
      setSaving(true)

      const user = JSON.parse(
          localStorage.getItem('user') || '{}'
      )

      const userId = user?.userId || user?.id

      if (!userId) {
        toast.error('User session not found')
        return
      }

      const response =
          await hospitalService.updateProfile(
              userId,
              formData
          )

      setProfile(response.data)
      setIsEditing(false)

      toast.success(
          'Hospital profile updated successfully'
      )
    } catch (error) {
      console.error('Error updating hospital profile:', error)

      toast.error(
          error.response?.data?.message ||
          'Failed to update hospital profile'
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const cancelEditing = () => {
    setIsEditing(false)

    setFormData({
      hospitalName: profile?.hospitalName || '',
      registrationNumber:
          profile?.registrationNumber || '',
      contactPerson:
          profile?.contactPerson || '',
      contactPhone:
          profile?.contactPhone || '',
      city: profile?.city || '',
      state: profile?.state || '',
      pincode: profile?.pincode || '',
      latitude: profile?.latitude || '',
      longitude: profile?.longitude || ''
    })
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
              Loading hospital profile...
            </p>

          </div>

        </div>
    )
  }

  // =====================================================
  // PROFILE NOT FOUND
  // =====================================================

  if (!profile) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <HiOfficeBuilding className="text-3xl text-red-500" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Hospital profile not found
            </h2>

            <button
                onClick={() => navigate('/dashboard')}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Back to Dashboard
            </button>

          </div>

        </div>
    )
  }

  return (
      <div className="mx-auto max-w-6xl space-y-6">

        {/* =================================================
          HEADER
      ================================================= */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <button
                onClick={() => navigate('/dashboard')}
                className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-red-600"
            >
              <HiArrowLeft />

              Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Hospital Profile
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage your hospital information and location.
            </p>

          </div>

          {!isEditing && (
              <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                <HiPencil className="text-lg" />

                Edit Profile
              </button>
          )}

        </div>


        {/* =================================================
          HOSPITAL HERO
      ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-red-900 p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-500/10" />

          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Hospital Icon */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-red-600 shadow-lg shadow-red-950/30">

              <HiOfficeBuilding className="text-5xl text-white" />

            </div>


            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-2xl font-bold sm:text-3xl">
                  {profile.hospitalName || 'BloodLink Hospital'}
                </h2>

                {profile.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur">

                  <HiShieldCheck />

                  Verified

                </span>
                )}

              </div>


              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">

                <HiIdentification />

                Registration:
                {profile.registrationNumber || 'Not available'}

              </p>


              <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">

                <HiLocationMarker />

                {profile.city || 'City not available'}
                {profile.state
                    ? `, ${profile.state}`
                    : ''
                }

              </p>

            </div>

          </div>

        </section>


        {/* =================================================
          SUMMARY CARDS
      ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Verification */}

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

                <HiShieldCheck className="text-2xl text-emerald-600" />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Verification
                </p>

                <p className={`mt-1 text-xl font-bold ${
                    profile.verified
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                }`}>
                  {profile.verified
                      ? 'Verified'
                      : 'Pending'
                  }
                </p>

              </div>

            </div>

          </div>


          {/* Contact */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HiPhone className="text-2xl text-blue-600" />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Contact Person
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-800">
                  {profile.contactPerson || 'Not set'}
                </p>

              </div>

            </div>

          </div>


          {/* Location */}

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <HiLocationMarker className="text-2xl text-red-600" />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Location
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-800">
                  {profile.city || 'Not set'}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
          EDIT MODE
      ================================================= */}

        {isEditing ? (

            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7">

                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Edit Information
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Update Hospital Details
                </h2>

              </div>


              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Hospital Name */}

                <InputField
                    label="Hospital Name"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    icon={<HiOfficeBuilding />}
                    placeholder="Enter hospital name"
                />


                {/* Registration Number */}

                <InputField
                    label="Registration Number"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    icon={<HiIdentification />}
                    placeholder="Enter registration number"
                />


                {/* Contact Person */}

                <InputField
                    label="Contact Person"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    icon={<HiUser />}
                    placeholder="Enter contact person's name"
                />


                {/* Contact Phone */}

                <InputField
                    label="Contact Phone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    icon={<HiPhone />}
                    placeholder="Enter contact phone"
                />


                {/* City */}

                <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    icon={<HiLocationMarker />}
                    placeholder="Enter city"
                />


                {/* State */}

                <InputField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    icon={<HiGlobeAlt />}
                    placeholder="Enter state"
                />


                {/* Pincode */}

                <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    icon={<HiLocationMarker />}
                    placeholder="Enter pincode"
                />


                {/* Latitude */}

                <InputField
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    icon={<HiGlobeAlt />}
                    placeholder="Enter latitude"
                />


                {/* Longitude */}

                <InputField
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    icon={<HiGlobeAlt />}
                    placeholder="Enter longitude"
                />

              </div>


              {/* Buttons */}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <HiX />

                  Cancel
                </button>


                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <HiCheck />

                  {saving
                      ? 'Saving...'
                      : 'Save Changes'
                  }

                </button>

              </div>

            </section>

        ) : (

            <>

              {/* =================================================
              HOSPITAL INFORMATION
          ================================================= */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7 flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">

                    <HiOfficeBuilding className="text-xl text-red-600" />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                      Hospital Information
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                      Organization Details
                    </h2>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  <InfoItem
                      label="Hospital Name"
                      value={profile.hospitalName}
                      icon={<HiOfficeBuilding />}
                  />

                  <InfoItem
                      label="Registration Number"
                      value={profile.registrationNumber}
                      icon={<HiIdentification />}
                  />

                  <InfoItem
                      label="Contact Person"
                      value={profile.contactPerson}
                      icon={<HiUser />}
                  />

                  <InfoItem
                      label="Contact Phone"
                      value={profile.contactPhone}
                      icon={<HiPhone />}
                  />

                </div>

              </section>


              {/* =================================================
              LOCATION
          ================================================= */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7 flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                    <HiLocationMarker className="text-xl text-blue-600" />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                      Location
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                      Hospital Location
                    </h2>

                  </div>

                </div>


                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  <InfoItem
                      label="City"
                      value={profile.city}
                      icon={<HiLocationMarker />}
                  />

                  <InfoItem
                      label="State"
                      value={profile.state}
                      icon={<HiGlobeAlt />}
                  />

                  <InfoItem
                      label="Pincode"
                      value={profile.pincode}
                      icon={<HiLocationMarker />}
                  />

                  <InfoItem
                      label="Coordinates"
                      value={
                        profile.latitude && profile.longitude
                            ? `${profile.latitude}, ${profile.longitude}`
                            : 'Not provided'
                      }
                      icon={<HiGlobeAlt />}
                  />

                </div>

              </section>


              {/* =================================================
              VERIFICATION STATUS
          ================================================= */}

              <section>

                <div
                    className={`flex items-center gap-4 rounded-2xl border p-5 ${
                        profile.verified
                            ? 'border-emerald-100 bg-emerald-50'
                            : 'border-amber-100 bg-amber-50'
                    }`}
                >

                  <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ${
                          profile.verified
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                      }`}
                  >

                    {profile.verified ? (
                        <HiShieldCheck className="text-2xl" />
                    ) : (
                        <HiIdentification className="text-2xl" />
                    )}

                  </div>


                  <div>

                    <p
                        className={`text-sm font-bold ${
                            profile.verified
                                ? 'text-emerald-800'
                                : 'text-amber-800'
                        }`}
                    >
                      {profile.verified
                          ? 'Hospital Verified'
                          : 'Verification Pending'
                      }
                    </p>

                    <p
                        className={`mt-1 text-xs ${
                            profile.verified
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                        }`}
                    >
                      {profile.verified
                          ? 'This hospital has been verified by BloodLink.'
                          : 'This hospital profile is waiting for verification.'
                      }
                    </p>

                  </div>

                </div>

              </section>

            </>

        )}

      </div>
  )
}


// =====================================================
// INPUT FIELD
// =====================================================

const InputField = ({
                      label,
                      name,
                      value,
                      onChange,
                      icon,
                      placeholder
                    }) => {

  return (
      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>

        <div className="relative">

          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>

          <input
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>

      </div>
  )
}


// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({ label, value, icon }) => {

  return (
      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {value || 'Not provided'}
          </p>

        </div>

      </div>
  )
}


export default HospitalProfile