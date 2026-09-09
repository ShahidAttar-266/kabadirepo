import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ScrapLot } from '../../types'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { WeighAndPayModal } from './WeighAndPayModal'
import { 
  Check, 
  X, 
  Eye, 
  Scale, 
  Filter, 
  Search, 
  MapPin, 
  Clock, 
  Receipt,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export const IncomingLotsTable: React.FC = () => {
  const { 
    t, 
    lots, 
    updateLotStatus, 
    weighModalLotId, 
    setWeighModalLotId,
    setSelectedReceiptLotId 
  } = useApp()

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewingLot, setViewingLot] = useState<ScrapLot | null>(null)

  const filteredLots = lots.filter((lot) => {
    if (filterStatus === 'pending') {
      if (lot.status !== 'recycler_requested' && lot.status !== 'lot_created') return false
    } else if (filterStatus === 'accepted') {
      if (lot.status !== 'recycler_accepted' && lot.status !== 'pickup_scheduled' && lot.status !== 'weight_confirmed') return false
    } else if (filterStatus === 'completed') {
      if (lot.status !== 'completed') return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchId = lot.id.toLowerCase().includes(q)
      const matchMat = lot.category.toLowerCase().includes(q)
      const matchLoc = lot.location.toLowerCase().includes(q)
      return matchId || matchMat || matchLoc
    }
    return true
  })

  const lotForWeighModal = lots.find((l) => l.id === weighModalLotId)

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('rec_incoming_lots')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept or reject incoming scrap lots from local kabadiwalas and informal collectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            {lots.filter(l => l.status === 'recycler_requested' || l.status === 'lot_created').length} Pending Intake
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Lots' },
            { id: 'pending', label: 'Needs Action' },
            { id: 'accepted', label: 'In Transit / Weighing' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lot ID, PCB, Sangli..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* Lots Display: Mobile Stacked Cards (md:hidden) & Desktop Table (hidden md:block) (PRD Section 16) */}
      
      {/* MOBILE STACKED CARDS VIEW (< md / 768px) */}
      <div className="md:hidden space-y-3">
        {filteredLots.map((lot) => {
          const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)
          const isActionable = lot.status === 'recycler_requested' || lot.status === 'lot_created'
          const isReadyToWeigh = lot.status === 'recycler_accepted' || lot.status === 'pickup_scheduled'
          const isCompleted = lot.status === 'completed'

          return (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              {/* Header: Lot ID + Status Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={lot.photoUrl}
                    alt="scrap lot"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-mono font-black text-slate-900 text-sm">
                      Lot {lot.id}
                    </h3>
                    <span className="text-[10px] text-slate-400 block">{lot.createdAt}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    lot.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lot.status === 'recycler_accepted' || lot.status === 'pickup_scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : lot.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {lot.status === 'completed' ? '🟢 Paid' : lot.status === 'lot_created' ? '🟢 New' : lot.status.replace('_', ' ')}
                </span>
              </div>

              {/* Material & Key Specs Line */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Material</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <span>{catMeta?.icon || '🟩'}</span>
                    <span>{lot.category.toUpperCase()}</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Weight & Location</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    ⚖️ {lot.verifiedWeightKg || lot.declaredWeightKg} kg
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">📍 {lot.location}</span>
                </div>
              </div>

              {/* Price Highlight */}
              <div className="flex items-center justify-between bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900">Total Valuation / Payout:</span>
                <span className="text-base font-black text-emerald-800 font-mono">
                  💰 ₹{(lot.finalPrice || lot.quotedPrice).toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {isActionable && (
                  <>
                    <button
                      onClick={() => updateLotStatus(lot.id, 'recycler_accepted')}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs min-h-[44px]"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('btn_accept_lot')}</span>
                    </button>
                    <button
                      onClick={() => updateLotStatus(lot.id, 'rejected')}
                      className="px-3 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 min-h-[44px]"
                    >
                      Reject
                    </button>
                  </>
                )}

                {isReadyToWeigh && (
                  <button
                    onClick={() => setWeighModalLotId(lot.id)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs min-h-[44px]"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{t('btn_weigh_and_pay')}</span>
                  </button>
                )}

                {isCompleted && (
                  <button
                    onClick={() => setSelectedReceiptLotId(lot.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>View Receipt</span>
                  </button>
                )}

                <button
                  onClick={() => setViewingLot(lot)}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 min-h-[44px]"
                >
                  <Eye className="w-4 h-4" />
                  <span>View →</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* DESKTOP TABLE VIEW (hidden on mobile, >= md / 768px) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{t('col_lot_id')}</th>
                <th className="py-3.5 px-4">{t('col_material')}</th>
                <th className="py-3.5 px-4 text-right">{t('col_weight')}</th>
                <th className="py-3.5 px-4">{t('col_location')}</th>
                <th className="py-3.5 px-4 text-right">{t('col_est_value')}</th>
                <th className="py-3.5 px-4">{t('col_status')}</th>
                <th className="py-3.5 px-4 text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredLots.map((lot) => {
                const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)
                const isActionable = lot.status === 'recycler_requested' || lot.status === 'lot_created'
                const isReadyToWeigh = lot.status === 'recycler_accepted' || lot.status === 'pickup_scheduled'
                const isCompleted = lot.status === 'completed'

                return (
                  <tr key={lot.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Lot ID */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={lot.photoUrl}
                          alt="scrap lot"
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-mono font-black text-slate-900 text-xs block">
                            {lot.id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {lot.createdAt}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Material */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span>{catMeta?.icon}</span>
                        <span className="font-bold text-slate-900">
                          {lot.category.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        Condition: {lot.condition}
                      </span>
                    </td>

                    {/* Weight */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-slate-900 text-sm">
                        {lot.verifiedWeightKg || lot.declaredWeightKg} kg
                      </span>
                      {lot.verifiedWeightKg && (
                        <span className="text-[10px] text-emerald-600 block font-semibold">
                          Weighed ✓
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[120px]">{lot.location}</span>
                      </div>
                    </td>

                    {/* Estimated / Final Value */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-emerald-700 text-sm">
                        ₹{(lot.finalPrice || lot.quotedPrice).toLocaleString()}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          lot.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lot.status === 'recycler_accepted' || lot.status === 'pickup_scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : lot.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lot.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions Column (PRD Section 16: View, Accept, Reject, Weigh) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Actionable lots: Accept & Reject */}
                        {isActionable && (
                          <>
                            <button
                              onClick={() => updateLotStatus(lot.id, 'recycler_accepted')}
                              title="Accept Lot"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs min-h-[36px]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{t('btn_accept_lot')}</span>
                            </button>

                            <button
                              onClick={() => updateLotStatus(lot.id, 'rejected')}
                              title="Reject Lot"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* In Transit Lots: Weigh & Pay */}
                        {isReadyToWeigh && (
                          <button
                            onClick={() => setWeighModalLotId(lot.id)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-xs min-h-[36px]"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>{t('btn_weigh_and_pay')}</span>
                          </button>
                        )}

                        {/* Completed Lots: View Receipt */}
                        {isCompleted && (
                          <button
                            onClick={() => setSelectedReceiptLotId(lot.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                          >
                            <Receipt className="w-3 h-3 text-emerald-600" />
                            <span>Receipt</span>
                          </button>
                        )}

                        {/* Inspect Lot Modal */}
                        <button
                          onClick={() => setViewingLot(lot)}
                          title="View Details"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lot Inspection Modal */}
      {viewingLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {viewingLot.id}
              </span>
              <button
                onClick={() => setViewingLot(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={viewingLot.photoUrl}
              alt="Scrap item"
              className="w-full h-48 rounded-2xl object-cover border border-slate-200"
            />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Material:</span>
                <span className="font-bold text-slate-900">{viewingLot.category.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Declared Weight:</span>
                <span className="font-bold text-slate-900">{viewingLot.declaredWeightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">AI Confidence:</span>
                <span className="font-bold text-emerald-700">{viewingLot.aiConfidence || 87}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Collector Contact:</span>
                <span className="font-bold text-slate-900">{viewingLot.collectorPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Notes:</span>
                <span className="text-slate-700">{viewingLot.notes || 'Clean sorted lot'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setViewingLot(null)
                setWeighModalLotId(viewingLot.id)
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>Weigh and Settle Payout</span>
            </button>
          </div>
        </div>
      )}

      {/* Weigh and Pay Modal */}
      {lotForWeighModal && (
        <WeighAndPayModal
          lot={lotForWeighModal}
          onClose={() => setWeighModalLotId(null)}
        />
      )}

    </div>
  )
}
