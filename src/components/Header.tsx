import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Language } from '../types'
import { 
  Recycle, 
  MapPin, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  UserCheck, 
  Building2, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle,
  FileText,
  Wallet,
  User,
  LayoutDashboard,
  Package,
  Truck,
  Percent
} from 'lucide-react'

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    location, 
    setLocation, 
    availableLocations,
    isOffline, 
    toggleOfflineMode, 
    isSyncing, 
    offlineDraftsCount,
    activeCollectorTab, 
    setActiveCollectorTab,
    activeRecyclerTab,
    setActiveRecyclerTab,
    setIsAddScrapModalOpen
  } = useApp()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)

  const navItems: { key: typeof activeCollectorTab; labelKey: string; icon: React.ReactNode }[] = [
    { key: 'home', labelKey: 'nav_home', icon: <Recycle className="w-4 h-4" /> },
    { key: 'prices', labelKey: 'nav_prices', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'recyclers', labelKey: 'nav_recyclers', icon: <Building2 className="w-4 h-4" /> },
    { key: 'lots', labelKey: 'nav_my_lots', icon: <FileText className="w-4 h-4" /> },
    { key: 'earnings', labelKey: 'nav_earnings', icon: <Wallet className="w-4 h-4" /> },
    { key: 'safety', labelKey: 'nav_safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'how-it-works', labelKey: 'nav_how_it_works', icon: <HelpCircle className="w-4 h-4" /> },
  ]

  const recyclerNavItems: { key: typeof activeRecyclerTab; labelKey: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', labelKey: 'rec_dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'incoming', labelKey: 'rec_incoming_lots', icon: <Package className="w-4 h-4" /> },
    { key: 'pickup', labelKey: 'rec_pickup_requests', icon: <Truck className="w-4 h-4" /> },
    { key: 'rates', labelKey: 'rec_rates_materials', icon: <Percent className="w-4 h-4" /> },
    { key: 'transactions', labelKey: 'rec_transactions', icon: <FileText className="w-4 h-4" /> },
    { key: 'profile', labelKey: 'rec_facility_profile', icon: <ShieldCheck className="w-4 h-4" /> },
  ]

  const handleNavClick = (tabKey: typeof activeCollectorTab) => {
    setActiveCollectorTab(tabKey)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner for Offline Mode / Sync status */}
      {isOffline ? (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-3 flex items-center justify-between font-medium">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <WifiOff className="w-4 h-4 animate-pulse text-amber-200 shrink-0" />
              <span className="truncate">{t('offline_badge')} {offlineDraftsCount > 0 && `(${offlineDraftsCount} drafts)`}</span>
            </div>
            <button 
              onClick={toggleOfflineMode}
              className="shrink-0 underline hover:text-amber-200 text-xs font-semibold px-2 py-0.5 rounded bg-amber-700/60"
            >
              Simulate Online
            </button>
          </div>
        </div>
      ) : isSyncing ? (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-3 flex items-center justify-center gap-2 font-medium">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-200 shrink-0" />
          <span>{t('syncing_badge')}</span>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        
        {/* MOBILE HEADER: ☰ / Logo / Location / Profile (PRD Section 3) */}
        <div className="flex sm:hidden flex-col py-2 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* Hamburger Button ☰ */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 active:bg-slate-200 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Compact Mobile Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none block">
                  Kabadiwala<span className="text-emerald-600">Connect</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-700">
                  MPCB Verified
                </span>
              </div>
            </button>

            {/* Profile / Role Switcher 👤 */}
            <button
              onClick={() => setRole(role === 'collector' ? 'recycler' : 'collector')}
              className="p-2 rounded-xl text-xs font-bold bg-slate-900 text-white min-h-[44px] min-w-[44px] flex items-center justify-center gap-1 shadow-xs"
              title={role === 'collector' ? 'Switch to Recycler' : 'Switch to Collector'}
            >
              {role === 'collector' ? (
                <>
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">Recycler</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">Collector</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Sub-Header: Location & Language selector */}
          <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="w-full flex items-center justify-between gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate text-[11px] font-bold">📍 {location}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">▼</span>
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  {availableLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc)
                        setIsLocationDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                        location === loc ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] shrink-0">
              {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded font-medium transition-all ${
                    language === lang
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {lang === 'mr' ? 'मरा' : lang === 'hi' ? 'हिं' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP & TABLET HEADER (>= sm / 640px) */}
        <div className="hidden sm:flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Kabadiwala<span className="text-emerald-600">Connect</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    MPCB Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">
                  {t('app_tagline')}
                </p>
              </div>
            </button>

            {/* Location Selector */}
            <div className="relative ml-2 hidden md:block">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
                title="Change Location"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[140px]">{location}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('location_label')}
                  </div>
                  {availableLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc)
                        setIsLocationDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                        location === loc ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation (Collector View) */}
          {role === 'collector' && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeCollectorTab === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span>{t(item.labelKey)}</span>
                  </button>
                )
              })}
            </nav>
          )}

          {/* Right Controls: Role Switcher, Language & Add Scrap CTA */}
          <div className="flex items-center gap-2">
            
            {/* Primary Action Button (+ Add Scrap) */}
            {role === 'collector' && (
              <button
                onClick={() => setIsAddScrapModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('action_add_scrap')}</span>
              </button>
            )}

            {/* Offline toggle simulator tool */}
            <button
              onClick={toggleOfflineMode}
              title={isOffline ? 'Go Online' : 'Simulate Offline Mode'}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                isOffline 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-slate-500" />}
              <span className="text-[11px] hidden xl:inline">
                {isOffline ? 'Offline' : 'Online'}
              </span>
            </button>

            {/* Language Selector: Marathi | Hindi | English */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {(['mr', 'hi', 'en'] as Language[]).map((lang) => {
                const isSelected = language === lang
                const labels: Record<Language, string> = {
                  mr: 'मराठी',
                  hi: 'हिंदी',
                  en: 'EN'
                }
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-white text-emerald-800 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {labels[lang]}
                  </button>
                )
              })}
            </div>

            {/* Role Switcher Button: Collector <-> Recycler */}
            <button
              onClick={() => {
                if (role === 'collector') {
                  setRole('recycler')
                } else {
                  setRole('collector')
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs min-h-[44px] ${
                role === 'collector'
                  ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
              }`}
            >
              {role === 'collector' ? (
                <>
                  <Building2 className="w-4 h-4" />
                  <span>{t('switch_to_recycler')}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{t('switch_to_collector')}</span>
                </>
              )}
            </button>

            {/* Hamburger Menu Toggle (for tablet view < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          {/* Nav Links */}
          <div className="grid grid-cols-2 gap-2">
            {role === 'collector'
              ? navItems.map((item) => {
                  const isActive = activeCollectorTab === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold text-left min-h-[48px] ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{t(item.labelKey)}</span>
                    </button>
                  )
                })
              : recyclerNavItems.map((item) => {
                  const isActive = activeRecyclerTab === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveRecyclerTab(item.key)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold text-left min-h-[48px] ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{t(item.labelKey)}</span>
                    </button>
                  )
                })}
          </div>

          {/* Mobile Add Scrap CTA */}
          {role === 'collector' && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsAddScrapModalOpen(true)
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-sm shadow-md shadow-emerald-700/20 min-h-[48px]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>📷 {t('action_add_scrap')}</span>
            </button>
          )}

          {/* Role switcher inside drawer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Switch Portal Mode:</span>
            <button
              onClick={() => {
                setRole(role === 'collector' ? 'recycler' : 'collector')
                setIsMobileMenuOpen(false)
              }}
              className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              {role === 'collector' ? 'Recycler Dashboard →' : 'Collector View →'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
