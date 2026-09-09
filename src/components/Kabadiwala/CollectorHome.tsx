import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { MATERIAL_CATEGORIES, BENCHMARK_PRICES } from '../../mockData'
import { MaterialCategory } from '../../types'
import { 
  Camera, 
  TrendingUp, 
  Building2, 
  Wallet, 
  Search, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  PlusCircle,
  Clock,
  Package,
  ArrowUpRight
} from 'lucide-react'

export const CollectorHome: React.FC = () => {
  const { 
    t, 
    location, 
    lots, 
    activeLotId,
    setActiveLotId,
    setActiveCollectorTab, 
    setIsAddScrapModalOpen,
    setSelectedReceiptLotId
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const activeLot = lots.find((l) => l.id === activeLotId) || lots[0]

  // Filter categories by search
  const filteredCategories = MATERIAL_CATEGORIES.filter((cat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const catName = t(cat.labelKey).toLowerCase()
    const rawId = cat.id.toLowerCase()
    return catName.includes(q) || rawId.includes(q)
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
      
      {/* DESKTOP DASHBOARD TOP GREETING & HERO CTA (PRD Section 5) */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>📍 {location} District</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Good morning 👋
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 font-normal">
              Manage your scrap, prices and recyclers from one place.
            </p>

            {/* Desktop Quick Search Input (PRD Section 4) */}
            <div className="pt-3 max-w-2xl">
              <div className="relative w-full bg-white/95 rounded-2xl p-1.5 shadow-xl flex items-center border border-emerald-400/40 focus-within:border-emerald-400 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scrap materials (PCB, Cable, Battery, CRT)..."
                  className="w-full px-2.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-2 text-xs text-slate-400 hover:text-slate-600 font-bold shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Large Primary Action Button: + Add Scrap */}
          <div className="shrink-0 self-stretch md:self-auto flex flex-col items-end justify-center">
            <button
              onClick={() => setIsAddScrapModalOpen(true)}
              className="w-full md:w-auto px-6 py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <PlusCircle className="w-6 h-6 text-slate-950" />
              <span>+ Add Scrap</span>
            </button>
            <span className="text-[11px] text-emerald-200/80 mt-2 font-medium self-center md:self-end">
              Instant AI Recognition & Market Valuation
            </span>
          </div>
        </div>
      </div>

      {/* DESKTOP KPI CARDS: 4-COLUMN GRID ON LARGE SCREENS (PRD Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Earnings</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            ₹18,450
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs last month</span>
            </span>
            <button 
              onClick={() => setActiveCollectorTab('earnings')} 
              className="text-slate-400 hover:text-emerald-600 font-semibold"
            >
              View →
            </button>
          </div>
        </div>

        {/* Card 2: Pending Payments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Payments</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-black text-amber-600 tracking-tight">
            ₹2,500
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>2 lots under weighbridge</span>
            </span>
            <button 
              onClick={() => setActiveCollectorTab('lots')} 
              className="text-slate-400 hover:text-amber-600 font-semibold"
            >
              Track →
            </button>
          </div>
        </div>

        {/* Card 3: Active Lots */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Lots</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            12
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-blue-700 font-semibold">
              4 scheduled for intake
            </span>
            <button 
              onClick={() => setActiveCollectorTab('lots')} 
              className="text-slate-400 hover:text-blue-600 font-semibold"
            >
              Manage →
            </button>
          </div>
        </div>

        {/* Card 4: Completed Sales */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Completed Sales</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            32
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-teal-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% MPCB EPR verified</span>
            </span>
            <button 
              onClick={() => setActiveCollectorTab('earnings')} 
              className="text-slate-400 hover:text-teal-600 font-semibold"
            >
              Receipts →
            </button>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Check Live Prices */}
        <button
          onClick={() => setActiveCollectorTab('prices')}
          className="group text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                💰 Price Board
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Check market benchmark rates & trends
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* Find Recycler */}
        <button
          onClick={() => setActiveCollectorTab('recyclers')}
          className="group text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                🏭 Find Recycler
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Split-screen marketplace & live map
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* My Earnings */}
        <button
          onClick={() => setActiveCollectorTab('earnings')}
          className="group text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                💵 My Earnings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review payouts & digital manifests
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

      </div>

      {/* CATEGORY GRID: DESKTOP RESPONSIVE GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Scrap Material Benchmarks & Instant Valuation
            </h2>
            <p className="text-xs text-slate-500">Tap any material category to create a lot</p>
          </div>
          <button
            onClick={() => setActiveCollectorTab('prices')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 min-h-[40px] px-2"
          >
            <span>View All Rates →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setIsAddScrapModalOpen(true)}
              className="group text-left p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all active:scale-95 flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ₹{cat.avgPrice}/kg
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {t(cat.labelKey)}
                </h3>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-emerald-600">
                <span>Add Lot</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE LOT TRACEABILITY SNIPPET */}
      {activeLot && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-2xl shrink-0">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {activeLot.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  {activeLot.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                {activeLot.category.toUpperCase()} — {activeLot.declaredWeightKg} kg
              </h4>
              <p className="text-xs text-slate-500">
                Assigned: {activeLot.recyclerName || 'ABC E-Waste Recycling'} • Est. ₹{activeLot.quotedPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-0 border-slate-100">
            <button
              onClick={() => setActiveCollectorTab('lots')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Handover Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {activeLot.status === 'completed' && (
              <button
                onClick={() => setSelectedReceiptLotId(activeLot.id)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-4 h-4" />
                <span>View Receipt</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SAFETY TEASER */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-600/20 font-bold text-2xl">
            🔥
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-amber-950">
              Never Burn Copper Cables or Use Acid on Motherboards!
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Burning releases cancer-causing dioxins. Authorized recyclers buy insulated wire directly for maximum fair rate.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveCollectorTab('safety')}
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Listen Audio Guide 🔊</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}
