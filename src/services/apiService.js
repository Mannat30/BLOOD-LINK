import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

// =========================
// AUTH
// =========================

export const authService = {
  register: (data) => api.post('/api/auth/register', data),

  login: (data) => api.post('/api/auth/login', data),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// =========================
// BLOOD REQUEST
// =========================

export const bloodRequestService = {
  createRequest: (data) =>
      api.post('/api/blood-request', data),

  getRequest: (id) =>
      api.get(`/api/blood-request/${id}`),

  getPendingRequests: () =>
      api.get('/api/blood-request/pending'),

  cancelRequest: (id) =>
      api.delete(`/api/blood-request/${id}`)
}

// =========================
// BLOOD ALLOCATION
// =========================

export const bloodAllocationService = {

  createAllocation: (donationId, data) =>
      api.post(`/blood-allocation/${donationId}`, data),

  getAllAllocations: () =>
      api.get('/blood-allocation'),

  getAllocation: (id) =>
      api.get(`/blood-allocation/${id}`)
}

// =========================
// DONOR
// =========================

export const donorService = {

  createProfile: (userId, data) =>
      api.post(`/api/donors/${userId}`, data),

  getProfile: (userId) =>
      api.get(`/api/donors/${userId}`),

  updateProfile: (userId, data) =>
      api.put(`/api/donors/${userId}`, data)
}

// =========================
// PATIENT
// =========================

export const patientService = {

  createProfile: (userId, data) =>
      api.post(`/api/patient/${userId}`, data),

  getProfile: (userId) =>
      api.get(`/api/patient/${userId}`),

  updateProfile: (userId, data) =>
      api.put(`/api/patient/${userId}`, data)
}

// =========================
// HOSPITAL
// =========================

export const hospitalService = {

  createProfile: (userId, data) =>
      api.post(`/api/hospital/${userId}`, data),

  getProfile: (userId) =>
      api.get(`/api/hospital/${userId}`),

  updateProfile: (userId, data) =>
      api.put(`/api/hospital/${userId}`, data)
}

// =========================
// MATCHING
// =========================

export const matchingService = {

  findEligibleDonors: (requestId) =>
      api.get(`/api/matching/eligible/${requestId}`),

  rankDonors: (requestId) =>
      api.post(`/api/matching/rank/${requestId}`)
}

// =========================
// NOTIFICATION
// =========================

export const notificationService = {

  sendNotification: (donorMatchId) =>
      api.post(`/api/notifications/send/${donorMatchId}`),

  getAllNotifications: () =>
      api.get('/api/notifications'),

  getNotification: (id) =>
      api.get(`/api/notifications/${id}`),

  markAsRead: (id) =>
      api.put(`/api/notifications/${id}/read`),

  acceptRequest: (id) =>
      api.put(`/api/notifications/${id}/accept`),

  rejectRequest: (id) =>
      api.put(`/api/notifications/${id}/reject`)
}

// =========================
// DONATION HISTORY
// =========================

export const donationHistoryService = {

  donate: (notificationId, data) =>
      api.post(`/donations/${notificationId}`, data),

  getAllDonations: () =>
      api.get('/donations'),

  getDonation: (id) =>
      api.get(`/donations/${id}`)
}

export default api