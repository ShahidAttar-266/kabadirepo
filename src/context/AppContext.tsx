import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, UserRole, ScrapLot, RecyclerProfile, MaterialCategory, LotStatus } from '../types'
import { translations } from '../translations'
import { INITIAL_RECYCLERS, INITIAL_SCRAP_LOTS, SAFETY_TIPS } from '../mockData'

interface AppContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  location: string
  setLocation: (loc: string) => void
  availableLocations: string[]

  // Lots
  lots: ScrapLot[]
  activeLotId: string | null
  setActiveLotId: (id: string | null) => void
  activeLot: ScrapLot | undefined
  createLot: (newLot: Omit<ScrapLot, 'id' | 'createdAt' | 'updatedAt'>) => ScrapLot
  updateLotStatus: (lotId: string, status: LotStatus, extra?: Partial<ScrapLot>) => void
  deleteLot: (lotId: string) => void

  // Recyclers
  recyclers: RecyclerProfile[]
  activeRecyclerId: string | null
  setActiveRecyclerId: (id: string | null) => void
  activeRecycler: RecyclerProfile | undefined
  updateRecyclerRate: (recyclerId: string, category: MaterialCategory, ratePerKg: number, minQty: number) => void
  updateRecyclerProfile: (recyclerId: string, updates: Partial<RecyclerProfile>) => void

  // Offline Mode & Sync
  isOffline: boolean
  toggleOfflineMode: () => void
  isSyncing: boolean
  syncOfflineDrafts: () => void
  offlineDraftsCount: number

  // Audio Speech Player for Safety & Accessibility
  playingTipId: string | null
  playSafetyAudio: (tipId: string) => void
  stopSafetyAudio: () => void

  // Navigation State
  activeCollectorTab: 'home' | 'lots' | 'prices' | 'recyclers' | 'earnings' | 'safety' | 'how-it-works' | 'about'
  setActiveCollectorTab: (tab: 'home' | 'lots' | 'prices' | 'recyclers' | 'earnings' | 'safety' | 'how-it-works' | 'about') => void
  activeRecyclerTab: 'dashboard' | 'incoming' | 'pickup' | 'rates' | 'transactions' | 'profile'
  setActiveRecyclerTab: (tab: 'dashboard' | 'incoming' | 'pickup' | 'rates' | 'transactions' | 'profile') => void

  // Modals
  isAddScrapModalOpen: boolean
  setIsAddScrapModalOpen: (open: boolean) => void
  selectedReceiptLotId: string | null
  setSelectedReceiptLotId: (lotId: string | null) => void
  weighModalLotId: string | null
  setWeighModalLotId: (lotId: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const LOCATIONS = [
  'Sangli, Maharashtra',
  'Miraj, Maharashtra',
  'Kupwad Industrial Area, Sangli',
  'Kolhapur, Maharashtra',
  'Ichalkaranji, Maharashtra',
  'Pune, Maharashtra',
]

const STORAGE_KEYS = {
  LOTS: 'kabadi_lots_v1',
  RECYCLERS: 'kabadi_recyclers_v1',
  LANG: 'kabadi_lang_v1',
  ROLE: 'kabadi_role_v1',
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'collector'
  })

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'mr'
  })

  // Location
  const [location, setLocation] = useState<string>('Sangli, Maharashtra')

  // Offline Mode
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  // Lots State with Persistence
  const [lots, setLots] = useState<ScrapLot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOTS)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed parsing lots from localStorage', e)
      }
    }
    return INITIAL_SCRAP_LOTS
  })

  // Recyclers State with Persistence
  const [recyclers, setRecyclers] = useState<RecyclerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECYCLERS)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed parsing recyclers from localStorage', e)
      }
    }
    return INITIAL_RECYCLERS
  })

  const [activeLotId, setActiveLotId] = useState<string | null>('KC-2026-000124')
  const [activeRecyclerId, setActiveRecyclerId] = useState<string | null>('rec-001')

  // Modals & Navigation
  const [activeCollectorTab, setActiveCollectorTab] = useState<'home' | 'lots' | 'prices' | 'recyclers' | 'earnings' | 'safety' | 'how-it-works' | 'about'>('home')
  const [activeRecyclerTab, setActiveRecyclerTab] = useState<'dashboard' | 'incoming' | 'pickup' | 'rates' | 'transactions' | 'profile'>('dashboard')
  const [isAddScrapModalOpen, setIsAddScrapModalOpen] = useState<boolean>(false)
  const [selectedReceiptLotId, setSelectedReceiptLotId] = useState<string | null>(null)
  const [weighModalLotId, setWeighModalLotId] = useState<string | null>(null)

  // Audio state
  const [playingTipId, setPlayingTipId] = useState<string | null>(null)

  // Save lots to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots))
  }, [lots])

  // Save recyclers to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECYCLERS, JSON.stringify(recyclers))
  }, [recyclers])

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      syncOfflineDrafts()
    }
    const handleOffline = () => {
      setIsOffline(true)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [lots])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole)
  }

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    localStorage.setItem(STORAGE_KEYS.LANG, newLang)
    // Cancel any current speech when switching language
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setPlayingTipId(null)
  }

  const t = (key: string): string => {
    const currentDict = translations[language] || translations.en
    return currentDict[key] || translations.en[key] || key
  }

  const activeLot = lots.find((l) => l.id === activeLotId)
  const activeRecycler = recyclers.find((r) => r.id === activeRecyclerId)

  // Create new lot
  const createLot = (newLotData: Omit<ScrapLot, 'id' | 'createdAt' | 'updatedAt'>): ScrapLot => {
    const timestamp = new Date()
    const randomSeq = Math.floor(100 + Math.random() * 900)
    const lotId = `KC-2026-000${randomSeq}`

    const formattedDate = timestamp.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const newLot: ScrapLot = {
      ...newLotData,
      id: lotId,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      isOfflineDraft: isOffline,
    }

    setLots((prev) => [newLot, ...prev])
    setActiveLotId(lotId)
    return newLot
  }

  const updateLotStatus = (lotId: string, status: LotStatus, extra?: Partial<ScrapLot>) => {
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id === lotId) {
          return {
            ...lot,
            status,
            updatedAt: nowStr,
            ...extra,
          }
        }
        return lot
      })
    )
  }

  const deleteLot = (lotId: string) => {
    setLots((prev) => prev.filter((l) => l.id !== lotId))
    if (activeLotId === lotId) {
      setActiveLotId(null)
    }
  }

  const updateRecyclerRate = (recyclerId: string, category: MaterialCategory, ratePerKg: number, minQty: number) => {
    setRecyclers((prev) =>
      prev.map((rec) => {
        if (rec.id === recyclerId) {
          return {
            ...rec,
            rates: {
              ...rec.rates,
              [category]: {
                ...rec.rates[category],
                ratePerKg,
                minQuantityKg: minQty,
                lastUpdated: 'Just now',
              },
            },
          }
        }
        return rec
      })
    )
  }

  const updateRecyclerProfile = (recyclerId: string, updates: Partial<RecyclerProfile>) => {
    setRecyclers((prev) =>
      prev.map((rec) => {
        if (rec.id === recyclerId) {
          return { ...rec, ...updates }
        }
        return rec
      })
    )
  }

  // Offline syncing
  const offlineDraftsCount = lots.filter((l) => l.isOfflineDraft).length

  const syncOfflineDrafts = () => {
    if (offlineDraftsCount === 0) return
    setIsSyncing(true)
    setTimeout(() => {
      setLots((prev) =>
        prev.map((lot) => (lot.isOfflineDraft ? { ...lot, isOfflineDraft: false, status: 'lot_created' } : lot))
      )
      setIsSyncing(false)
    }, 1800)
  }

  const toggleOfflineMode = () => {
    if (isOffline) {
      // Switching back online
      setIsOffline(false)
      syncOfflineDrafts()
    } else {
      setIsOffline(true)
    }
  }

  // Audio guide using Web Speech API with fallback
  const playSafetyAudio = (tipId: string) => {
    const tip = SAFETY_TIPS.find((t) => t.id === tipId)
    if (!tip) return

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      if (playingTipId === tipId) {
        setPlayingTipId(null)
        return
      }

      const textToSpeak = tip.audioText[language] || tip.audioText.en
      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      if (language === 'mr') {
        utterance.lang = 'mr-IN'
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN'
      } else {
        utterance.lang = 'en-IN'
      }

      utterance.rate = 0.95
      utterance.pitch = 1.0

      utterance.onstart = () => setPlayingTipId(tipId)
      utterance.onend = () => setPlayingTipId(null)
      utterance.onerror = () => setPlayingTipId(null)

      window.speechSynthesis.speak(utterance)
    } else {
      // If browser doesn't support Web Speech API
      setPlayingTipId(tipId)
      setTimeout(() => setPlayingTipId(null), 4000)
    }
  }

  const stopSafetyAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setPlayingTipId(null)
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        location,
        setLocation,
        availableLocations: LOCATIONS,

        lots,
        activeLotId,
        setActiveLotId,
        activeLot,
        createLot,
        updateLotStatus,
        deleteLot,

        recyclers,
        activeRecyclerId,
        setActiveRecyclerId,
        activeRecycler,
        updateRecyclerRate,
        updateRecyclerProfile,

        isOffline,
        toggleOfflineMode,
        isSyncing,
        syncOfflineDrafts,
        offlineDraftsCount,

        playingTipId,
        playSafetyAudio,
        stopSafetyAudio,

        activeCollectorTab,
        setActiveCollectorTab,
        activeRecyclerTab,
        setActiveRecyclerTab,

        isAddScrapModalOpen,
        setIsAddScrapModalOpen,
        selectedReceiptLotId,
        setSelectedReceiptLotId,
        weighModalLotId,
        setWeighModalLotId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
