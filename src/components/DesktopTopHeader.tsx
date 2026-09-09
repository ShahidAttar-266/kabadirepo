import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Language } from '../types'
import { 
  Search, 
  MapPin, 
  Bell, 
  Globe, 
  User, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  PlusCircle,
  Building2,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react'

export const DesktopTopHeader: React.FC = () => {
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
    activeCollectorTab,
    activeRecyclerTab,
    setIsAddScrapModalOpen,
    setSelectedReceiptLotId
  } = useApp()

  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')

  // Notifications Mock Data
  const notifications = [
    { id: 1, title: 'Lot Accepted', desc: 'ABC E-Waste Recycling accepted Lot KC-124', time: '10m ago', unread: true },
    { id: 2, title: 'Price Increase ↑', desc: 'PCB rate increased to ₹225/kg in Sangli', time: '1h ago', unread: true },
    { id: 3, title: 'Payout Received', desc: '₹2,250 transferred via UPI for Lot KC-120', time: 'Yesterday', unread: false },
  ]

  // Page titles map
  const getPageTitle = () => {
    if (role === 'collector') {
      switch (activeCollectorTab) {
        case 'home': return { title: 'Dashboard', sub: 'Manage your scrap, prices and recyclers from one place.' }
        case 'prices': return { title: 'Price Board', sub: 'Real-time benchmark rates for e-waste materials.' }
        case 'recyclers': return { title: 'Find Recycler', sub: 'Discover MPCB authorized recyclers near you.' }
        case 'lots': return { title: 'My Scrap Lots & Handover', sub: 'Track digital traceability and intake manifests.' }
        case 'earnings': return { title: 'Earnings & Payouts', sub: 'Transparent record of digital bank/cash payouts.' }
        case 'safety': return { title: 'Safety & EPR Guidelines', sub: 'Safe handling protocols & voice audio instructions.' }
        case 'how-it-works': return { title: 'How It Works', sub: 'Step-by-step guidance for informal collectors.' }
        default: return { title: 'Dashboard', sub: 'Kabadiwala Connect Platform' }
      }
    } else {
      switch (activeRecyclerTab) {
        case 'dashboard': return { title: 'Recycler Overview', sub: 'Daily scrap intake and facility metrics.' }
        case 'incoming': return { title: 'Incoming Scrap Lots', sub: 'Review and accept lots created by local collectors.' }
        case 'pickup': return { title: 'Pickup Requests', sub: 'Manage doorstep logistics and collection drivers.' }
        case 'rates': return { title: 'Materials & Spot Rates', sub: 'Configure spot buying prices per kilogram.' }
        case 'transactions': return { title: 'Transactions Ledger', sub: 'EPR compliance receipts & weighbridge logs.' }
        case 'profile': return { title: 'Facility Profile & EPR License', sub: 'MPCB / CPCB regulatory authorization credentials.' }
        default: return { title: 'Recycler Dashboard', sub: 'Authorized Dismantler Portal' }
      }
    }
  }

  const pageMeta = getPageTitle()

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
      
      {/* Left: Page Title (PRD Section 4) */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{pageMeta.title}</span>
          {isOffline && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
              Offline Mode
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-500">{pageMeta.sub}</p>
      </div>

      {/* Center/Right Controls (PRD Section 4) */}
      <div className="flex items-center gap-3">
        
        {/* Global Search Input */}
        <div className="relative hidden xl:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search materials, recyclers, lots..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Location Dropdown 📍 */}
        <div className="relative">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[130px]">📍 {location}</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {isLocationOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Service District
              </div>
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc)
                    setIsLocationOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 transition-colors ${
                    location === loc ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 font-medium'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell 🔔 */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  2 New
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.unread ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Offline simulator toggle */}
        <button
          onClick={toggleOfflineMode}
          title={isOffline ? 'Go Online' : 'Simulate Offline'}
          className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
            isOffline
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
        </button>

        {/* User Profile Badge (Shahid / Ramesh Shinde) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
            {role === 'collector' ? 'RS' : 'ABC'}
          </div>
          <div className="text-left hidden md:block">
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">
              {role === 'collector' ? 'Ramesh Shinde' : 'ABC E-Waste Recycler'}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block leading-none">
              {role === 'collector' ? 'Collector (Sangli)' : 'Verified Dismantler'}
            </span>
          </div>
        </div>

      </div>

    </header>
  )
}
