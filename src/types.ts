export type Language = 'mr' | 'hi' | 'en'

export type UserRole = 'collector' | 'recycler'

export type MaterialCategory = 
  | 'pcb'
  | 'cables'
  | 'batteries'
  | 'lcd'
  | 'crt'
  | 'motors'
  | 'magnets'
  | 'plastic'
  | 'metal'

export type MaterialCondition = 'good' | 'used' | 'damaged'

export type LotStatus = 
  | 'draft'
  | 'lot_created'
  | 'recycler_requested'
  | 'recycler_accepted'
  | 'pickup_scheduled'
  | 'weight_confirmed'
  | 'completed'
  | 'rejected'

export interface PriceBenchmark {
  category: MaterialCategory
  name: string
  currentPrice: number // ₹/kg
  minPrice: number
  maxPrice: number
  trend: number // percentage change, e.g. +4.5
  unit: string
  lastUpdated: string
}

export interface RecyclerRate {
  category: MaterialCategory
  ratePerKg: number
  minQuantityKg: number
  lastUpdated: string
  effectiveFrom: string
  accepted: boolean
}

export interface RecyclerProfile {
  id: string
  facilityName: string
  ownerName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  coordinates: [number, number] // [lat, lng]
  distanceKm: number
  authorizationNo: string
  issuingAuthority: 'MPCB' | 'CPCB' | 'KSPCB'
  verificationStatus: 'verified' | 'pending' | 'unverified'
  verificationDate: string
  validTill: string
  pickupAvailable: boolean
  serviceRadiusKm: number
  rating: number
  totalTransactions: number
  rates: Record<MaterialCategory, RecyclerRate>
  capacityTonsPerYear: number
  verifiedBadge: boolean
  description: string
}

export interface ScrapLot {
  id: string // e.g. KC-2026-000124
  collectorId: string
  collectorName: string
  collectorPhone: string
  category: MaterialCategory
  subCategory?: string
  condition: MaterialCondition
  declaredWeightKg: number
  verifiedWeightKg?: number
  estimatedMinPrice: number
  estimatedMaxPrice: number
  quotedPrice: number
  finalPrice?: number
  photoUrl: string
  aiConfidence?: number
  aiDetectedMaterial?: string
  status: LotStatus
  createdAt: string
  updatedAt: string
  location: string
  coordinates?: [number, number]
  recyclerId?: string
  recyclerName?: string
  paymentMethod?: 'CASH' | 'UPI' | 'BANK_TRANSFER'
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID'
  isOfflineDraft?: boolean
  notes?: string
}

export interface SafetyTip {
  id: string
  title: Record<Language, string>
  hazard: Record<Language, string>
  safeAlternative: Record<Language, string>
  audioText: Record<Language, string>
  icon: string
  severity: 'high' | 'critical' | 'warning'
}
