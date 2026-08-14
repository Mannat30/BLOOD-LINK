import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHome, AiOutlineUser, AiOutlineSettings } from 'react-icons/ai'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <AiOutlineHome className="text-2xl font-bold text-blue-600" />
            <span className="ml-2 text-sm font-medium text-gray-600">BloodLink</span>
          </Link>
        </div>
        <nav className="hidden md:block">
          <Link to="/dashboard" className="px-4 py-2 text-gray-600 hover:text-blue-600">
            <AiOutlineUser className="text-16 mr-2" /> Dashboard
          </Link>
          <Link to="/settings" className="px-4 py-2 text-gray-600 hover:text-blue-600">
            <AiOutlineSettings className="text-16 mr-2" /> Settings
          </Link>
        </nav>
        <div className="md:hidden flex items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
            <AiOutlineUser className="text-xl mr-2" /> Login
          </button>
        </div>
      </header>
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
