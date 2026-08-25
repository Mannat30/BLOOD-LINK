import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { donorService } from '../services/apiService'
import { toast } from 'react-toastify'
import {
  HiUser,
  HiHeart,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiCalendar,
  HiPencil,
  HiArrowLeft,
  HiCheck,
  HiX,
  HiShieldCheck
} from 'react-icons/hi'

const emptyForm = {
  bloodGroup: '',
  gender: '',
  dateOfBirth: '',
  weight: '',
  city: '',
  state: '',
  pincode: '',
  latitude: '',
  longitude: ''
}

const DonorProfile = () => {

  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)

  const [formData, setFormData] = useState(emptyForm)

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  // false = update mode
  // true = create mode
  const [isCreating, setIsCreating] = useState(false)

  const [isEditing, setIsEditing] = useState(false)


  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = () => {

    try {

      const user = JSON.parse(
          localStorage.getItem('user') || '{}'
      )

      return user?.userId || user?.id || null

    } catch (error) {

      console.error('Error reading user:', error)

      return null
    }
  }


  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {

    const userId = getUserId()

    if (!userId) {

      toast.error('User session not found')

      navigate('/')

      return
    }

    fetchProfile(userId)

  }, [navigate])


  const fetchProfile = async (userId) => {

    try {

      setLoading(true)

      console.log('Fetching donor profile for:', userId)

      const response =
          await donorService.getProfile(userId)

      console.log('Donor profile response:', response.data)

      setProfile(response.data)

      setFormData({
        bloodGroup: response.data.bloodGroup || '',
        gender: response.data.gender || '',
        dateOfBirth: response.data.dateOfBirth
            ? response.data.dateOfBirth.substring(0, 10)
            : '',
        weight: response.data.weight || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        latitude: response.data.latitude || '',
        longitude: response.data.longitude || ''
      })

      setIsCreating(false)

    } catch (error) {

      console.error(
          'Error fetching donor profile:',
          error
      )

      const message =
          error.response?.data?.message || ''

      /*
       * IMPORTANT:
       * User exists but donor profile does not exist.
       *
       * In this situation we should NOT show
       * "Profile not found".
       *
       * Instead show the CREATE PROFILE form.
       */

      if (
          error.response?.status === 404 ||
          message.toLowerCase().includes('donor profile not found')
      ) {

        console.log(
            'Donor profile does not exist. Opening create form.'
        )

        setProfile(null)

        setFormData(emptyForm)

        setIsCreating(true)

      } else {

        toast.error(
            message || 'Failed to load donor profile'
        )

      }

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  // =====================================================
  // CREATE / UPDATE PROFILE
  // =====================================================

  const handleSubmit = async () => {

    try {

      setSaving(true)

      const userId = getUserId()

      if (!userId) {

        toast.error('User session not found')

        return
      }


      // ================================================
      // BASIC VALIDATION
      // ================================================

      if (!formData.bloodGroup) {

        toast.error('Please select blood group')

        return
      }

      if (!formData.gender) {

        toast.error('Please select gender')

        return
      }

      if (!formData.dateOfBirth) {

        toast.error('Please select date of birth')

        return
      }

      if (!formData.weight) {

        toast.error('Please enter weight')

        return
      }

      if (Number(formData.weight) < 50) {

        toast.error(
            'Weight must be at least 50 kg'
        )

        return
      }

      if (!formData.city.trim()) {

        toast.error('Please enter city')

        return
      }

      if (!formData.state.trim()) {

        toast.error('Please enter state')

        return
      }

      if (!formData.pincode.trim()) {

        toast.error('Please enter pincode')

        return
      }

      if (!formData.latitude) {

        toast.error('Please enter latitude')

        return
      }

      if (!formData.longitude) {

        toast.error('Please enter longitude')

        return
      }


      // ================================================
      // PREPARE REQUEST
      // ================================================

      const requestData = {

        bloodGroup: formData.bloodGroup,

        gender: formData.gender,

        dateOfBirth: formData.dateOfBirth,

        weight: Number(formData.weight),

        city: formData.city.trim(),

        state: formData.state.trim(),

        pincode: formData.pincode.trim(),

        latitude: Number(formData.latitude),

        longitude: Number(formData.longitude)
      }


      console.log(
          'Saving donor profile:',
          requestData
      )


      // ================================================
      // CREATE PROFILE
      // ================================================

      if (isCreating) {

        console.log(
            'Creating donor profile for:',
            userId
        )

        const response =
            await donorService.createProfile(
                userId,
                requestData
            )

        console.log(
            'Donor profile created:',
            response.data
        )

        setProfile(response.data)

        setIsCreating(false)

        setIsEditing(false)

        toast.success(
            'Donor profile created successfully!'
        )

        /*
         * Fetch again because backend response DTO
         * may contain fewer fields than the full profile.
         */

        await fetchProfile(userId)

        return
      }


      // ================================================
      // UPDATE PROFILE
      // ================================================

      console.log(
          'Updating donor profile for:',
          userId
      )

      const response =
          await donorService.updateProfile(
              userId,
              requestData
          )

      console.log(
          'Donor profile updated:',
          response.data
      )

      setProfile(response.data)

      setIsEditing(false)

      toast.success(
          'Profile updated successfully!'
      )

      await fetchProfile(userId)

    } catch (error) {

      console.error(
          'Error saving donor profile:',
          error
      )

      toast.error(
          error.response?.data?.message ||
          'Failed to save donor profile'
      )

    } finally {

      setSaving(false)

    }
  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEditing = () => {

    if (isCreating) {

      return
    }

    setIsEditing(false)

    setFormData({
      bloodGroup: profile?.bloodGroup || '',
      gender: profile?.gender || '',
      dateOfBirth: profile?.dateOfBirth
          ? profile.dateOfBirth.substring(0, 10)
          : '',
      weight: profile?.weight || '',
      city: profile?.city || '',
      state: profile?.state || '',
      pincode: profile?.pincode || '',
      latitude: profile?.latitude || '',
      longitude: profile?.longitude || ''
    })
  }


  // =====================================================
  // FORMAT BLOOD GROUP
  // =====================================================

  const formatBloodGroup = (value) => {

    if (!value) {
      return 'Not set'
    }

    return value
        .replace('_POSITIVE', '+')
        .replace('_NEGATIVE', '-')
  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {

    if (!value) {
      return 'Not provided'
    }

    return new Date(value).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
    )
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
              Loading donor profile...
            </p>

          </div>

        </div>
    )
  }


  // =====================================================
  // CREATE PROFILE
  // =====================================================

  if (isCreating) {

    return (
        <div className="mx-auto max-w-5xl space-y-6">

          {/* HEADER */}

          <div>

            <button
                onClick={() => navigate('/dashboard')}
                className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-red-600"
            >
              <HiArrowLeft />

              Back to Dashboard

            </button>

            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              Donor Registration
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
              Create Your Donor Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete your donor information to start helping patients in need.
            </p>

          </div>


          {/* HERO */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-6 text-white shadow-xl sm:p-8">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

            <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5" />

            <div className="relative z-10 flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

                <HiHeart className="text-4xl text-white" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Become a BloodLink Donor ❤️
                </h2>

                <p className="mt-2 text-sm text-red-100">
                  Your information helps us find the right blood donor match.
                </p>

              </div>

            </div>

          </section>


          {/* FORM */}

          <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">

              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                Donor Information
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Complete Your Details
              </h2>

            </div>


            <DonorForm
                formData={formData}
                handleChange={handleChange}
            />


            {/* BUTTONS */}

            <div className="mt-8 flex justify-end">

              <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <HiCheck />

                {saving
                    ? 'Creating Profile...'
                    : 'Create Donor Profile'}

              </button>

            </div>

          </section>

        </div>
    )
  }


  // =====================================================
  // PROFILE SHOULD EXIST HERE
  // =====================================================

  if (!profile) {

    return (
        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

              <HiUser className="text-3xl text-red-500" />

            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Profile unavailable
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


  // =====================================================
  // NORMAL PROFILE PAGE
  // =====================================================

  return (

      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}

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
              Donor Profile
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage your donor information and availability details.
            </p>

          </div>


          {!isEditing && (

              <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
              >

                <HiPencil className="text-lg" />

                Edit Profile

              </button>

          )}

        </div>


        {/* PROFILE HERO */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

              <HiUser className="text-5xl text-white" />

            </div>


            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-2xl font-bold sm:text-3xl">

                  {profile.name || 'BloodLink Donor'}

                </h2>

                <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">

                <HiShieldCheck />

                Verified Donor

              </span>

              </div>


              <p className="mt-2 flex items-center gap-2 text-sm text-red-100">

                <HiMail />

                {profile.email || 'Email not available'}

              </p>


              <p className="mt-1 flex items-center gap-2 text-sm text-red-100">

                <HiPhone />

                {profile.phoneNumber || 'Phone not available'}

              </p>

            </div>

          </div>

        </section>


        {/* SUMMARY */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <SummaryCard
              icon={<HiHeart />}
              label="Blood Group"
              value={formatBloodGroup(profile.bloodGroup)}
              color="red"
          />

          <SummaryCard
              icon={<HiUser />}
              label="Gender"
              value={profile.gender || 'Not set'}
              color="blue"
          />

          <SummaryCard
              icon={<HiCalendar />}
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
              color="green"
          />

        </div>


        {/* EDIT */}

        {isEditing ? (

            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7">

                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Edit Information
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Update Donor Details
                </h2>

              </div>


              <DonorForm
                  formData={formData}
                  handleChange={handleChange}
              />


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
                      : 'Save Changes'}

                </button>

              </div>

            </section>

        ) : (

            <>

              {/* PERSONAL INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7">

                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Personal Information
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-800">
                    Donor Details
                  </h2>

                </div>


                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  <InfoItem
                      label="Full Name"
                      value={profile.name}
                      icon={<HiUser />}
                  />

                  <InfoItem
                      label="Email Address"
                      value={profile.email}
                      icon={<HiMail />}
                  />

                  <InfoItem
                      label="Phone Number"
                      value={profile.phoneNumber}
                      icon={<HiPhone />}
                  />

                  <InfoItem
                      label="Role"
                      value={profile.role}
                      icon={<HiShieldCheck />}
                  />

                  <InfoItem
                      label="Gender"
                      value={profile.gender}
                      icon={<HiUser />}
                  />

                  <InfoItem
                      label="Weight"
                      value={
                        profile.weight
                            ? `${profile.weight} kg`
                            : 'Not provided'
                      }
                      icon={<HiHeart />}
                  />

                </div>

              </section>


              {/* LOCATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7">

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                    Location
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-800">
                    Donor Location
                  </h2>

                </div>


                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                  <InfoItem
                      label="City"
                      value={profile.city}
                      icon={<HiLocationMarker />}
                  />

                  <InfoItem
                      label="State"
                      value={profile.state}
                      icon={<HiLocationMarker />}
                  />

                  <InfoItem
                      label="Pincode"
                      value={profile.pincode}
                      icon={<HiLocationMarker />}
                  />

                  <InfoItem
                      label="Coordinates"
                      value={
                        profile.latitude != null &&
                        profile.longitude != null
                            ? `${profile.latitude}, ${profile.longitude}`
                            : 'Not provided'
                      }
                      icon={<HiLocationMarker />}
                  />

                </div>

              </section>

            </>

        )}

      </div>
  )
}


// =====================================================
// DONOR FORM
// =====================================================

const DonorForm = ({
                     formData,
                     handleChange
                   }) => {

  return (

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* BLOOD GROUP */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Blood Group
          </label>

          <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          >

            <option value="">
              Select blood group
            </option>

            <option value="A_POSITIVE">
              A+
            </option>

            <option value="A_NEGATIVE">
              A-
            </option>

            <option value="B_POSITIVE">
              B+
            </option>

            <option value="B_NEGATIVE">
              B-
            </option>

            <option value="AB_POSITIVE">
              AB+
            </option>

            <option value="AB_NEGATIVE">
              AB-
            </option>

            <option value="O_POSITIVE">
              O+
            </option>

            <option value="O_NEGATIVE">
              O-
            </option>

          </select>

        </div>


        {/* GENDER */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Gender
          </label>

          <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          >

            <option value="">
              Select gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>

          </select>

        </div>


        {/* DOB */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Date of Birth
          </label>

          <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* WEIGHT */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Weight (kg)
          </label>

          <input
              type="number"
              name="weight"
              min="50"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Minimum 50 kg"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* CITY */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City
          </label>

          <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* STATE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            State
          </label>

          <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* PINCODE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pincode
          </label>

          <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter 6 digit pincode"
              maxLength="6"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* LATITUDE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Latitude
          </label>

          <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g. 26.9124"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>


        {/* LONGITUDE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Longitude
          </label>

          <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g. 75.7873"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
          />

        </div>

      </div>
  )
}


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
                       icon,
                       label,
                       value,
                       color
                     }) => {

  const colors = {

    red: {
      box: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100'
    },

    blue: {
      box: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-slate-200'
    },

    green: {
      box: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-slate-200'
    }

  }

  const selected =
      colors[color] || colors.blue

  return (

      <div
          className={`rounded-2xl border ${selected.border} bg-white p-5 shadow-sm`}
      >

        <div className="flex items-center gap-4">

          <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected.box}`}
          >

          <span className={`text-2xl ${selected.icon}`}>
            {icon}
          </span>

          </div>

          <div>

            <p className="text-xs font-medium text-slate-400">
              {label}
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {value}
            </p>

          </div>

        </div>

      </div>
  )
}


// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({
                    label,
                    value,
                    icon
                  }) => {

  return (

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">

          {icon}

        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {value || 'Not provided'}
          </p>

        </div>

      </div>
  )
}


export default DonorProfile