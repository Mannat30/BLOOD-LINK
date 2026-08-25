import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineBell,
  AiOutlineLogout,
  AiOutlineHistory
} from 'react-icons/ai'

import { authService } from '../services/apiService'

const Layout = ({ children }) => {

  const location = useLocation()
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ==========================================
  // AUTHENTICATION CHECK
  // ==========================================

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/', { replace: true })
    }

  }, [navigate, location.pathname])


  // ==========================================
  // BROWSER BACK / BF CACHE PROTECTION
  // ==========================================

  useEffect(() => {

    const handlePageShow = () => {

      const token = localStorage.getItem('token')

      if (!token) {
        window.location.replace('/')
      }

    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }

  }, [])


  // ==========================================
  // USER
  // ==========================================

  const user = JSON.parse(
      localStorage.getItem('user') || '{}'
  )

  const userName =
      user?.name || 'BloodLink User'

  const userRole =
      user?.role
          ?.replace(/_/g, ' ')
          ?.toLowerCase()
          ?.replace(/\b\w/g, (char) => char.toUpperCase()) ||
      'Member'


  // ==========================================
  // NAVIGATION
  // ==========================================

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: AiOutlineHome
    },
    {
      name: 'Blood Requests',
      path: '/blood-requests',
      icon: AiOutlineHeart
    },
    {
      name: 'Donation History',
      path: '/donation-history',
      icon: AiOutlineHistory
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: AiOutlineBell
    },
    {
      name: 'Profile',
      path: '/settings',
      icon: AiOutlineUser
    }
  ]


  const isActive = (path) => {

    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }

    return location.pathname.startsWith(path)
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    authService.logout()

    setMobileMenuOpen(false)

    // Replace current history entry
    window.location.replace('/')

  }


  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const handleNavigation = () => {
    setMobileMenuOpen(false)
  }


  // ==========================================
  // UI
  // ==========================================

  return (

      <div className="min-h-screen bg-slate-50 text-slate-900">

        {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[270px] flex-col border-r border-slate-200 bg-white lg:flex">

          {/* ================= LOGO ================= */}

          <div className="flex h-20 items-center border-b border-slate-100 px-6">

            <Link
                to="/dashboard"
                className="flex items-center gap-3"
            >

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">

                <AiOutlineHeart className="text-2xl text-white" />

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

              </div>

              <div>

                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  BloodLink
                </h1>

                <p className="text-[11px] font-medium text-slate-400">
                  Saving lives together
                </p>

              </div>

            </Link>

          </div>


          {/* ================= NAVIGATION ================= */}

          <div className="flex-1 overflow-y-auto px-4 py-7">

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1.5">

              {navItems.map((item) => {

                const Icon = item.icon
                const active = isActive(item.path)

                return (

                    <Link
                        key={item.name}
                        to={item.path}
                        className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            active
                                ? 'bg-red-50 text-red-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >

                      {active && (
                          <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-red-600" />
                      )}

                      <Icon
                          className={`text-xl transition ${
                              active
                                  ? 'text-red-600'
                                  : 'text-slate-400 group-hover:text-slate-700'
                          }`}
                      />

                      <span>
                    {item.name}
                  </span>

                      {active && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-red-600" />
                      )}

                    </Link>

                )

              })}

            </nav>


            {/* ================= DIVIDER ================= */}

            <div className="my-7 border-t border-slate-100" />


            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Account
            </p>


            {/* ================= SETTINGS ================= */}

            <Link
                to="/settings"
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive('/settings')
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >

              <AiOutlineSetting className="text-xl text-slate-400 group-hover:text-slate-700" />

              Settings

            </Link>


            {/* ================= HELP CARD ================= */}

            <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-5 text-white shadow-lg shadow-red-600/20">

              <div className="relative">

                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10" />

                <div className="relative">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <AiOutlineHeart className="text-xl" />
                  </div>

                  <h3 className="text-sm font-bold">
                    Every drop matters
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-red-100">
                    Your contribution can help save a life.
                  </p>

                  <button
                      onClick={() => navigate('/blood-requests')}
                      className="mt-4 w-full rounded-lg bg-white px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Find a way to help
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* ================= USER FOOTER ================= */}

          <div className="border-t border-slate-100 p-4">

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">

                <AiOutlineUser className="text-lg text-red-600" />

              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-800">
                  {userName}
                </p>

                <p className="truncate text-[11px] text-slate-400">
                  {userRole}
                </p>

              </div>

              <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >

                <AiOutlineLogout className="text-lg" />

              </button>

            </div>

          </div>

        </aside>


        {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">

          <Link
              to="/dashboard"
              className="flex items-center gap-2.5"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 shadow-md shadow-red-600/20">

              <AiOutlineHeart className="text-xl text-white" />

            </div>

            <div>

            <span className="block text-sm font-bold text-slate-900">
              BloodLink
            </span>

              <span className="block text-[9px] font-medium text-slate-400">
              Saving lives together
            </span>

            </div>

          </Link>


          <div className="flex items-center gap-2">

            {/* Notification */}

            <button
                onClick={() => navigate('/notifications')}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
            >

              <AiOutlineBell className="text-xl" />

              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500" />

            </button>


            {/* Menu */}

            <button
                onClick={() =>
                    setMobileMenuOpen(!mobileMenuOpen)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >

              {mobileMenuOpen ? (
                  <AiOutlineClose className="text-xl" />
              ) : (
                  <AiOutlineMenu className="text-xl" />
              )}

            </button>

          </div>

        </header>


        {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}

        {mobileMenuOpen && (

            <>

              {/* Overlay */}

              <div
                  className="fixed inset-0 top-16 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
              />


              {/* Menu */}

              <div className="fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden">

                {/* User */}

                <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">

                    <AiOutlineUser className="text-lg text-red-600" />

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {userName}
                    </p>

                    <p className="text-xs text-slate-400">
                      {userRole}
                    </p>

                  </div>

                </div>


                {/* Navigation */}

                <nav className="space-y-1.5">

                  {navItems.map((item) => {

                    const Icon = item.icon
                    const active = isActive(item.path)

                    return (

                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={handleNavigation}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                active
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >

                          <Icon className="text-xl" />

                          {item.name}

                          {active && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-red-600" />
                          )}

                        </Link>

                    )

                  })}


                  {/* Settings */}

                  <Link
                      to="/settings"
                      onClick={handleNavigation}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive('/settings')
                              ? 'bg-slate-100 text-slate-800'
                              : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >

                    <AiOutlineSetting className="text-xl" />

                    Settings

                  </Link>

                </nav>


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >

                  <AiOutlineLogout className="text-xl" />

                  Logout

                </button>

              </div>

            </>

        )}


        {/* =====================================================
          MAIN APPLICATION
      ====================================================== */}

        <div className="min-h-screen lg:ml-[270px]">


          {/* ================= DESKTOP TOP BAR ================= */}

          <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Blood donation platform
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-800">
                Welcome back 👋
              </h2>

            </div>


            <div className="flex items-center gap-3">

              {/* Notification */}

              <button
                  onClick={() => navigate('/notifications')}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
              >

                <AiOutlineBell className="text-xl" />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

              </button>


              {/* Profile */}

              <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:border-slate-300 hover:bg-slate-50"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">

                  <AiOutlineUser className="text-red-600" />

                </div>


                <div className="hidden xl:block">

                  <p className="max-w-[130px] truncate text-xs font-semibold text-slate-800">
                    {userName}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {userRole}
                  </p>

                </div>

              </Link>

            </div>

          </header>


          {/* ================= PAGE CONTENT ================= */}

          <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">

            <div className="mx-auto w-full max-w-7xl">

              {children}

            </div>

          </main>


          {/* ================= FOOTER ================= */}

          <footer className="border-t border-slate-200 bg-white px-6 py-5 lg:px-8">

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">

              <div className="flex items-center gap-2 text-xs text-slate-400">

                <AiOutlineHeart className="text-red-500" />

                <span>
                BloodLink — Saving lives together.
              </span>

              </div>

              <span className="text-[11px] text-slate-300">
              Secure blood donation platform
            </span>

            </div>

          </footer>

        </div>

      </div>
  )
}

export default Layout