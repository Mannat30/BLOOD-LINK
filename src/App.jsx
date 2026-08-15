import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Layout
import Layout from './components/Layout.jsx'

// Authentication
import Login from './pages/Login.jsx'
import Registration from './pages/Registration.jsx'

// Dashboards
import AdminDashboard from './pages/AdminDashboard.jsx'
import DonorDashboard from './pages/DonorDashboard.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import HospitalDashboard from './pages/HospitalDashboard.jsx'
import BloodBankDashboard from './pages/BloodBankDashboard.jsx'

// Other pages
import DonorProfile from './pages/DonorProfile.jsx'
import PatientProfile from './pages/PatientProfile.jsx'
import HospitalProfile from './pages/HospitalProfile.jsx'
import DonationHistory from './pages/DonationHistory.jsx'
import DonorRanking from './pages/DonorRanking.jsx'
import EligibleDonors from './pages/EligibleDonors.jsx'
import BloodRequestForm from './pages/BloodRequestForm.jsx'
import BloodRequestList from './pages/BloodRequestList.jsx'
import BloodRequestDetails from './pages/BloodRequestDetails.jsx'
import BloodAllocation from './pages/BloodAllocation.jsx'
import Notifications from './pages/Notifications.jsx'


// ============================================
// ROLE BASED DASHBOARD
// ============================================

const RoleDashboard = () => {

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    )

    const role = user?.role

    switch (role) {

        case 'ADMIN':
            return <AdminDashboard />

        case 'DONOR':
            return <DonorDashboard />

        case 'PATIENT':
            return <PatientDashboard />

        case 'HOSPITAL':
            return <HospitalDashboard />

        case 'BLOOD_BANK':
            return <BloodBankDashboard />

        default:
            console.log('Unknown role:', role)

            return <Navigate to="/" replace />
    }
}


// ============================================
// APP
// ============================================

function App() {

    return (
        <Router>

            <Layout>

                <Routes>

                    {/* ================= AUTH ================= */}

                    <Route
                        path="/"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Registration />}
                    />


                    {/* ================= DASHBOARD ================= */}

                    <Route
                        path="/dashboard"
                        element={<RoleDashboard />}
                    />


                    {/* ================= PROFILES ================= */}

                    <Route
                        path="/donor-profile"
                        element={<DonorProfile />}
                    />

                    <Route
                        path="/patient-profile"
                        element={<PatientProfile />}
                    />

                    <Route
                        path="/hospital-profile"
                        element={<HospitalProfile />}
                    />


                    {/* ================= DONOR ================= */}

                    <Route
                        path="/donation-history"
                        element={<DonationHistory />}
                    />

                    <Route
                        path="/donor-ranking"
                        element={<DonorRanking />}
                    />

                    <Route
                        path="/eligible-donors"
                        element={<EligibleDonors />}
                    />


                    {/* ================= BLOOD REQUEST ================= */}

                    <Route
                        path="/blood-request"
                        element={<BloodRequestForm />}
                    />

                    <Route
                        path="/blood-requests"
                        element={<BloodRequestList />}
                    />

                    <Route
                        path="/blood-request/:id"
                        element={<BloodRequestDetails />}
                    />


                    {/* ================= BLOOD ALLOCATION ================= */}

                    <Route
                        path="/blood-allocation"
                        element={<BloodAllocation />}
                    />


                    {/* ================= NOTIFICATIONS ================= */}

                    <Route
                        path="/notifications"
                        element={<Notifications />}
                    />


                    {/* ================= UNKNOWN URL ================= */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </Layout>

        </Router>
    )
}

export default App