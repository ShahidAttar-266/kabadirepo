import React from 'react'
import { useApp } from '../../context/AppContext'
import { RecyclerOverview } from './RecyclerOverview'
import { IncomingLotsTable } from './IncomingLotsTable'
import { RateManagement } from './RateManagement'
import { FacilityProfile } from './FacilityProfile'
import { PickupRequests } from './PickupRequests'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Percent, 
  FileText, 
  ShieldCheck, 
  Building2
} from 'lucide-react'

export const RecyclerDashboard: React.FC = () => {
  const { 
    t, 
    activeRecyclerTab, 
    setActiveRecyclerTab,
    recyclers 
  } = useApp()

  const currentRecycler = recyclers[0] // ABC E-Waste Recycling

  const tabItems: {
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
    <div className="space-y-6">
      
      {/* Mobile/Tablet Sub-Navigation Tab Strip (lg:hidden) */}
      <div className="lg:hidden bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  MPCB Certified
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-white truncate">
                {currentRecycler?.facilityName || 'ABC E-Waste Recycling'}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700 shrink-0">
            Node: SGL-098
          </span>
        </div>

        {/* Scrollable horizontal tab strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-800/80">
          {tabItems.map((item) => {
            const isActive = activeRecyclerTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveRecyclerTab(item.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all min-h-[36px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
                {item.badge ? (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black flex items-center justify-center ${
                    isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Recycler Active View Container */}
      <div className="w-full">
        {activeRecyclerTab === 'dashboard' && <RecyclerOverview />}
        {activeRecyclerTab === 'incoming' && <IncomingLotsTable />}
        {activeRecyclerTab === 'pickup' && <PickupRequests />}
        {activeRecyclerTab === 'rates' && <RateManagement />}
        {activeRecyclerTab === 'transactions' && <IncomingLotsTable />}
        {activeRecyclerTab === 'profile' && <FacilityProfile />}
      </div>

    </div>
  )
}

export default RecyclerDashboard
