import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/apiService'
import { toast } from 'react-toastify'
import {
  HiHeart,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiShieldCheck,
  HiUserGroup,
  HiUser,
  HiPhone,
  HiOfficeBuilding,
  HiChevronDown
} from 'react-icons/hi'

const roles = [
  {
    value: 'DONOR',
    label: 'Donor',
    description: 'Donate blood and help save lives',
    icon: HiUserGroup
  },
  {
    value: 'PATIENT',
    label: 'Patient',
    description: 'Request blood when you need it',
    icon: HiHeart
  },
  {
    value: 'HOSPITAL',
    label: 'Hospital',
    description: 'Manage blood requirements',
    icon: HiOfficeBuilding
  },
  {
    value: 'BLOOD_BANK',
    label: 'Blood Bank',
    description: 'Manage blood inventory',
    icon: HiHeart
  }
]

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: ''
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.register(formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))

      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(
          error.response?.data?.message || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-slate-50">

        <div className="grid min-h-screen lg:grid-cols-2">

          {/* =====================================
            LEFT BRANDING
        ====================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-rose-800 lg:flex">

            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5" />

            <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-white/5" />

            <div className="absolute right-20 top-1/3 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

              {/* Logo */}

              <Link
                  to="/"
                  className="flex w-fit items-center gap-3"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <HiHeart className="text-2xl text-red-600" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    BloodLink
                  </h1>

                  <p className="text-xs text-red-100">
                    Saving lives together
                  </p>
                </div>

              </Link>


              {/* Main message */}

              <div className="max-w-lg">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">

                  <HiUserGroup className="text-lg text-red-100" />

                  <span className="text-xs font-semibold text-white">
                  Join the BloodLink community
                </span>

                </div>

                <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                  Be part of something
                  <span className="block text-red-100">
                  that saves lives.
                </span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-red-100 xl:text-base">
                  Whether you're a donor, patient, hospital or
                  blood bank, BloodLink helps connect you with
                  the people and resources that matter.
                </p>


                {/* Benefits */}

                <div className="mt-10 space-y-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <HiHeart className="text-lg text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Make an impact
                      </p>

                      <p className="text-xs text-red-100">
                        Every donation can help save a life.
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <HiUserGroup className="text-lg text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Connect with others
                      </p>

                      <p className="text-xs text-red-100">
                        Join a growing blood donation network.
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <HiShieldCheck className="text-lg text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Secure platform
                      </p>

                      <p className="text-xs text-red-100">
                        Your account information is protected.
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              <p className="text-xs text-red-100">
                © {new Date().getFullYear()} BloodLink. Every drop matters.
              </p>

            </div>

          </div>


          {/* =====================================
            REGISTRATION FORM
        ====================================== */}

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

            <div className="w-full max-w-xl">

              {/* Mobile logo */}

              <div className="mb-8 flex justify-center lg:hidden">

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
                    <HiHeart className="text-2xl text-white" />
                  </div>

                  <div>
                    <h1 className="text-lg font-bold text-slate-900">
                      BloodLink
                    </h1>

                    <p className="text-xs text-slate-400">
                      Saving lives together
                    </p>
                  </div>

                </Link>

              </div>


              {/* Heading */}

              <div className="mb-7">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                  <HiUser className="text-2xl text-red-600" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Join BloodLink and become part of a network
                  working together to save lives.
                </p>

              </div>


              {/* Form Card */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                  {/* Name */}

                  <div>

                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </label>

                    <div className="relative">

                      <HiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                      <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          minLength={3}
                          maxLength={100}
                          autoComplete="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      />

                    </div>

                  </div>


                  {/* Email + Phone */}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {/* Email */}

                    <div>

                      <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email address
                      </label>

                      <div className="relative">

                        <HiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                        />

                      </div>

                    </div>


                    {/* Phone */}

                    <div>

                      <label
                          htmlFor="phoneNumber"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Phone number
                      </label>

                      <div className="relative">

                        <HiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            required
                            pattern="[6-9][0-9]{9}"
                            placeholder="10 digit number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                        />

                      </div>

                    </div>

                  </div>


                  {/* Password */}

                  <div>

                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <HiLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                      <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          maxLength={20}
                          autoComplete="new-password"
                          placeholder="Create a password (8-20 characters)"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      />

                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        {showPassword ? (
                            <HiEyeOff className="text-lg" />
                        ) : (
                            <HiEye className="text-lg" />
                        )}
                      </button>

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Use at least 8 characters for your password.
                    </p>

                  </div>


                  {/* Role */}

                  <div>

                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      I want to join as
                    </label>

                    <div className="relative">

                      <select
                          id="role"
                          name="role"
                          required
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-11 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      >

                        <option value="">
                          Select your role
                        </option>

                        {roles.map((role) => (
                            <option
                                key={role.value}
                                value={role.value}
                            >
                              {role.label}
                            </option>
                        ))}

                      </select>

                      <HiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                    </div>


                    {/* Selected role description */}

                    {formData.role && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 p-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">

                            {(() => {
                              const selectedRole = roles.find(
                                  (role) => role.value === formData.role
                              )

                              const Icon = selectedRole?.icon

                              return Icon ? (
                                  <Icon className="text-lg text-red-600" />
                              ) : null
                            })()}

                          </div>

                          <div>

                            <p className="text-xs font-semibold text-red-700">
                              {roles.find(
                                  (role) => role.value === formData.role
                              )?.label}
                            </p>

                            <p className="text-xs text-red-500">
                              {roles.find(
                                  (role) => role.value === formData.role
                              )?.description}
                            </p>

                          </div>

                        </div>
                    )}

                  </div>


                  {/* Security */}

                  <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">

                    <HiShieldCheck className="mt-0.5 shrink-0 text-lg text-emerald-600" />

                    <p className="text-xs leading-5 text-emerald-700">
                      Your account information is securely
                      processed and protected.
                    </p>

                  </div>


                  {/* Submit */}

                  <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >

                    {loading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Creating account...
                        </>
                    ) : (
                        <>
                          Create Account
                          <span className="text-lg">→</span>
                        </>
                    )}

                  </button>

                </form>


                {/* Login */}

                <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                  <p className="text-sm text-slate-500">

                    Already have an account?{' '}

                    <Link
                        to="/"
                        className="font-semibold text-red-600 transition hover:text-red-700"
                    >
                      Sign in
                    </Link>

                  </p>

                </div>

              </div>


              {/* Bottom trust */}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

                <HiShieldCheck className="text-green-500" />

                Secure registration powered by BloodLink

              </div>

            </div>

          </div>

        </div>

      </div>
  )
}

export default Registration