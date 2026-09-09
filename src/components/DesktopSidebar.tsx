import React from 'react'
import { useApp } from '../context/AppContext'
import { Language } from '../types'
import { 
  Recycle, 
  Home, 
  Camera, 
  Package, 
  TrendingUp, 
  Building2, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  User, 
  Globe, 
  Percent,
  Truck,
  LayoutDashboard
} from 'lucide-react'

export const DesktopSidebar: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    activeCollectorTab, 
    setActiveCollectorTab,
    activeRecyclerTab,
    setActiveRecyclerTab,
    setIsAddScrapModalOpen,
    lots
  } = useApp()

  // Collector Nav Items (PRD Section 3)
  const collectorNavItems: {
    key: typeof activeCollectorTab
    labelKey: string
    icon: React.ReactNode
    badge?: number
  }[] = [
    { key: 'home', labelKey: 'nav_home', icon: <Home className="w-4 h-4" /> },
    { key: 'prices', labelKey: 'nav_prices', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'recyclers', labelKey: 'nav_recyclers', icon: <Building2 className="w-4 h-4" /> },
    { key: 'lots', labelKey: 'nav_my_lots', icon: <Package className="w-4 h-4" />, badge: lots.filter(l => l.status !== 'completed').length },
    { key: 'earnings', labelKey: 'nav_earnings', icon: <Wallet className="w-4 h-4" /> },
    { key: 'safety', labelKey: 'nav_safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'how-it-works', labelKey: 'nav_how_it_works', icon: <HelpCircle className="w-4 h-4" /> },
  ]

  // Recycler Nav Items (PRD Section 16)
  const recyclerNavItems: {
    key: typeof activeRecyclerTab
    labelKey: string
    icon: React.ReactNode
    badge?: number
  }[] = [
    { key: 'dashboard', labelKey: 'rec_dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'incoming', labelKey: 'rec_incoming_lots', icon: <Package className="w-4 h-4" />, badge: 2 },
    { key: 'pickup', labelKey: 'rec_pickup_requests', icon: <Truck className="w-4 h-4" />, badge: 3 },
    { key: 'rates', labelKey: 'rec_rates_materials', icon: <Percent className="w-4 h-4" /> },
    { key: 'transactions', labelKey: 'rec_transactions', icon: <FileText className="w-4 h-4" /> },
    { key: 'profile', labelKey: 'rec_facility_profile', icon: <ShieldCheck className="w-4 h-4" /> },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-800 shadow-xl select-none z-30">
      
      {/* Top Brand Logo Section (PRD Section 3) */}
      <div className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Kabadiwala<span className="text-emerald-400">Connect</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MPCB Verified
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button for Collector (+ Add Scrap) */}
        {role === 'collector' && (
          <button
            onClick={() => setIsAddScrapModalOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>+ Add Scrap Lot</span>
          </button>
        )}

        {/* Recycler Facility Banner (when role === 'recycler') */}
        {role === 'recycler' && (
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center gap-3 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-emerald-900/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  MPCB Certified
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-white truncate mt-0.5">
                ABC E-Waste Recycling
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                Sangli Hub • SGL-098
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role === 'collector' ? 'Collector Portal' : 'Recycler Facility Portal'}
          </div>

          {role === 'collector'
            ? collectorNavItems.map((item) => {
                const isActive = activeCollectorTab === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveCollectorTab(item.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{t(item.labelKey)}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                )
              })
            : recyclerNavItems.map((item) => {
                const isActive = activeRecyclerTab === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveRecyclerTab(item.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{t(item.labelKey)}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                )
              })}
        </nav>
      </div>

      {/* Bottom Section: Profile, Settings & Language (PRD Section 3) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
        
        {/* Role Switcher Pill */}
        <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              {role === 'collector' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">
                {role === 'collector' ? 'Ramesh Shinde' : 'ABC Recycling'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block capitalize">
                {role === 'collector' ? 'Scrap Collector' : 'Authorized Recycler'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setRole(role === 'collector' ? 'recycler' : 'collector')}
            className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-xs"
            title="Switch Mode"
          >
            {role === 'collector' ? 'Recycler →' : 'Collector →'}
          </button>
        </div>

        {/* Language Switcher Bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            Language:
          </span>
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px]">
            {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'mr' ? 'मरा' : lang === 'hi' ? 'हिं' : 'EN'}
              </button>
            ))}
          </div>
        </div>

      </div>

    </aside>
  )
}
