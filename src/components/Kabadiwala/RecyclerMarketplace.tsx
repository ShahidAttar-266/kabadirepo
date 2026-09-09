import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { RecyclerProfile, MaterialCategory } from '../../types'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { RecyclerMap } from './RecyclerMap'
import { RecyclerDetailModal } from './RecyclerDetailModal'
import { 
  Building2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  List, 
  Map as MapIcon, 
  Filter, 
  ArrowRight, 
  Sparkles,
  Search,
  CheckCircle,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Phone,
  Mail,
  Maximize2
} from 'lucide-react'

export const RecyclerMarketplace: React.FC = () => {
  const { t, recyclers, location, setActiveCollectorTab, setIsAddScrapModalOpen } = useApp()
  
  // Filters
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50)
  const [pickupOnly, setPickupOnly] = useState<boolean>(false)
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list')

  // Modal selection & active card highlight
  const [inspectingRecycler, setInspectingRecycler] = useState<RecyclerProfile | null>(null)
  const [selectedMapRecyclerId, setSelectedMapRecyclerId] = useState<string | null>('rec-001')

  // Filter Recyclers
  const filteredRecyclers = recyclers.filter((rec) => {
    if (verifiedOnly && rec.verificationStatus !== 'verified') return false
    if (pickupOnly && !rec.pickupAvailable) return false
    if (rec.distanceKm > maxDistanceKm) return false
    if (selectedMaterial !== 'all') {
      const catRate = rec.rates[selectedMaterial as MaterialCategory]
      if (!catRate || !catRate.accepted) return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesName = rec.facilityName.toLowerCase().includes(q)
      const matchesCity = rec.city.toLowerCase().includes(q)
      const matchesAddress = rec.address.toLowerCase().includes(q)
      if (!matchesName && !matchesCity && !matchesAddress) return false
    }
    return true
  })

  const activeSelectedRecycler = filteredRecyclers.find(r => r.id === selectedMapRecyclerId) || filteredRecyclers[0]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verified Recycler Discovery
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              {filteredRecyclers.length} Active Centers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official government authorized e-waste dismantling facilities near {location}.
          </p>
        </div>

        {/* Mobile View Toggle & Filter Trigger (< lg) */}
        <div className="lg:hidden flex items-center justify-between gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters ⚙️</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center shadow-2xs">
            <button
              onClick={() => setMobileViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileViewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setMobileViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileViewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-4 h-4 text-emerald-600" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR (PRD Section 20) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facility name, Kupwad MIDC, Miraj..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium min-h-[40px]"
            />
          </div>

          {/* Distance Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-600 w-full lg:w-auto shrink-0">
            <span className="font-bold whitespace-nowrap">Distance:</span>
            <div className="flex items-center gap-1">
              {[10, 25, 50, 80].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setMaxDistanceKm(dist)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    maxDistanceKm === dist
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dist}km
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 shrink-0">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(e) => setPickupOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Doorstep Pickup
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Only
              </span>
            </label>
          </div>
        </div>

        {/* Material Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 mr-1">Material:</span>
          <button
            onClick={() => setSelectedMaterial('all')}
            className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors ${
              selectedMaterial === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Materials
          </button>
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedMaterial(cat.id)}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 flex items-center gap-1 transition-colors ${
                selectedMaterial === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t(cat.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SIGNATURE DESKTOP SPLIT-SCREEN MARKETPLACE + MAP (40% List / 60% Map) (PRD Section 7 & 27) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: 40% RECYCLER LIST (lg:col-span-5) */}
        <div className={`lg:col-span-5 space-y-4 ${mobileViewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>Verified Recycler Centers ({filteredRecyclers.length})</span>
            <span>Sorted by Distance</span>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {filteredRecyclers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No recyclers matched your filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try increasing distance or unticking "Pickup only".</p>
                <button
                  onClick={() => {
                    setSelectedMaterial('all')
                    setMaxDistanceKm(80)
                    setPickupOnly(false)
                    setSearchQuery('')
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredRecyclers.map((rec) => {
                const isSelected = rec.id === selectedMapRecyclerId
                const pcbRate = rec.rates.pcb?.ratePerKg || 225

                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedMapRecyclerId(rec.id)}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer group space-y-3 ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/20 shadow-md'
                        : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    {/* Header: Name, Verified Badge, Distance (PRD Section 8) */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {rec.verificationStatus === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>🟢 Authorization Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                              <span>🟡 Audit Pending</span>
                            </span>
                          )}

                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            📍 {rec.distanceKm} km away
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors pt-0.5">
                          {rec.facilityName}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {rec.address}
                        </p>
                      </div>

                      {/* Match Score Badge (PRD Section 8) */}
                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-2xs inline-block">
                          94% Match
                        </span>
                      </div>
                    </div>

                    {/* Materials & Logistics Chips (PRD Section 8) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1 text-xs text-slate-600">
                        <span className="text-[11px] font-bold text-slate-400">♻️ Accepts:</span>
                        {Object.entries(rec.rates)
                          .filter(([_, rate]) => rate.accepted)
                          .slice(0, 4)
                          .map(([catKey]) => {
                            const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === catKey)
                            return (
                              <span
                                key={catKey}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                              >
                                {catMeta?.icon} {t(catMeta?.labelKey || '')}
                              </span>
                            )
                          })}
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            PCB Spot Rate
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-emerald-700 font-mono">
                              ₹{pcbRate}
                            </span>
                            <span className="text-xs font-bold text-slate-500">/kg</span>
                          </div>
                        </div>

                        <div>
                          {rec.pickupAvailable ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                              <Truck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>🚚 Pickup available</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium bg-slate-200 px-2 py-0.5 rounded-md">
                              Drop-off at center
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (PRD Section 8) */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setInspectingRecycler(rec)
                        }}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors text-center"
                      >
                        View Details
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setInspectingRecycler(rec)
                        }}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span>Request Handover</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: 60% INTERACTIVE MAP (lg:col-span-7) (PRD Section 7 & 9 & 27) */}
        <div className={`lg:col-span-7 sticky top-20 ${mobileViewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-md space-y-2">
            
            <RecyclerMap
              recyclers={filteredRecyclers}
              selectedRecyclerId={selectedMapRecyclerId}
              onSelectRecycler={(id) => {
                setSelectedMapRecyclerId(id)
                const rec = recyclers.find((r) => r.id === id)
                if (rec) setInspectingRecycler(rec)
              }}
              userLocation={[16.8524, 74.5815]}
            />

            {/* Active Selected Floating Card Below Map */}
            {activeSelectedRecycler && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                      Selected Center
                    </span>
                    <span className="text-xs text-slate-300">📍 {activeSelectedRecycler.distanceKm} km away</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    {activeSelectedRecycler.facilityName}
                  </h4>
                  <p className="text-xs text-slate-300">
                    PCB Rate: ₹{activeSelectedRecycler.rates.pcb?.ratePerKg || 225}/kg • MPCB No: {activeSelectedRecycler.authorizationNo}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setInspectingRecycler(activeSelectedRecycler)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <span>Request Handover →</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Recycler Detail Modal */}
      {inspectingRecycler && (
        <RecyclerDetailModal
          recycler={inspectingRecycler}
          onClose={() => setInspectingRecycler(null)}
        />
      )}

    </div>
  )
}
