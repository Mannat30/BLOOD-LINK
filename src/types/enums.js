export const BloodGroup = {
  A_POSITIVE: 'A_POSITIVE',
  A_NEGATIVE: 'A_NEGATIVE',
  B_POSITIVE: 'B_POSITIVE',
  B_NEGATIVE: 'B_NEGATIVE',
  AB_POSITIVE: 'AB_POSITIVE',
  AB_NEGATIVE: 'AB_NEGATIVE',
  O_POSITIVE: 'O_POSITIVE',
  O_NEGATIVE: 'O_NEGATIVE'
}

export const Role = {
  ADMIN: 'ADMIN',
  DONOR: 'DONOR',
  PATIENT: 'PATIENT',
  HOSPITAL: 'HOSPITAL',
  BLOOD_BANK: 'BLOOD_BANK'
}

export const EmergencyType = {
  ACCIDENT: 'ACCIDENT',
  SURGERY: 'SURGERY',
  DELIVERY: 'DELIVERY',
  THALASSEMIA: 'THALASSEMIA',
  CANCER: 'CANCER',
  ORGAN_TRANSPLANT: 'ORGAN_TRANSPLANT',
  INTERNAL_BLEEDING: 'INTERNAL_BLEEDING',
  DENGUE: 'DENGUE',
  ANEMIA: 'ANEMIA',
  OTHER: 'OTHER'
}

export const RequestPriority = {
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
}

export const RequestStatus = {
  PENDING: 'PENDING',
  MATCHING: 'MATCHING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
}

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
}

export const AllocationStatus = {
  ALLOCATED: 'ALLOCATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  READ: 'READ',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const bloodGroupOptions = Object.values(BloodGroup)
export const roleOptions = Object.values(Role)
export const emergencyTypeOptions = Object.values(EmergencyType)
export const requestPriorityOptions = Object.values(RequestPriority)
export const requestStatusOptions = Object.values(RequestStatus)
export const genderOptions = Object.values(Gender)
export const allocationStatusOptions = Object.values(AllocationStatus)
export const notificationStatusOptions = Object.values(NotificationStatus)