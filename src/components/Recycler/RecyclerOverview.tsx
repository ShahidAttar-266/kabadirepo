import React from 'react'
import { useApp } from '../../context/AppContext'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { 
  Package, 
  Clock, 
  Scale, 
  Banknote, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Truck,
  Plus
} from 'lucide-react'

export const RecyclerOverview: React.FC = () => {
  const { t, lots, setActiveRecyclerTab, setWeighModalLotId } = useApp()

  const pendingLots = lots.filter(
    (l) => l.status === 'recycler_requested' || l.status === 'lot_created'
  )

  return (
    <div className="space-y-6">
      
      {/* 4 Dashboard Summary KPI Cards (PRD Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: New Lots */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('rec_kpi_new_lots')}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">12</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              +3 in last 2 hours
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('rec_kpi_pending')}
            </span>
            <div className="text-3xl font-black text-amber-600 mt-1">5</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Awaiting pickup confirmation
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Today's Material */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('rec_kpi_today_weight')}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">180 kg</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ↑ 18% vs yesterday
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Today's Purchases */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('rec_kpi_today_purchases')}
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-1">₹32,500</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Direct UPI / Cash vouchers
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content Split: Quick Intake Queue & Material Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Pending Intake Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Action Required: Incoming Lots
              </h3>
              <p className="text-xs text-slate-500">
                Lots submitted by informal collectors ready for inspection and weight check
              </p>
            </div>
            <button
              onClick={() => setActiveRecyclerTab('incoming')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingLots.slice(0, 3).map((lot) => {
              const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)
              return (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lot.photoUrl}
                      alt={lot.category}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {lot.id}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {lot.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {t(catMeta?.labelKey || '')} — {lot.declaredWeightKg} kg
                      </h4>
                      <p className="text-xs text-slate-500">
                        {lot.location} • Est. ₹{lot.quotedPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setWeighModalLotId(lot.id)}
                      className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Weigh & Settle</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Intake Material Composition & Environmental Shield (1 col) */}
        <div className="space-y-4">
          
          {/* Daily Intake Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Today's Scrap Intake by Weight
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">PCB Boards</span>
                  <span className="text-slate-900">82 kg (45%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Copper Cables</span>
                  <span className="text-slate-900">54 kg (30%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Lead Acid Batteries</span>
                  <span className="text-slate-900">28 kg (15%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">LCD & Mixed E-Scrap</span>
                  <span className="text-slate-900">16 kg (10%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Regulatory Status Mini-Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">MPCB EPR Compliant</span>
            </div>
            <p className="text-xs text-slate-300">
              All intake recorded through digital manifests is automatically uploaded to the Central Pollution Control Board (CPCB) EPR Portal.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}
