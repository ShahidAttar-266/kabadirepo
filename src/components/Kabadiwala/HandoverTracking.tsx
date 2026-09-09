import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LotStatus, ScrapLot } from '../../types'
import { MATERIAL_CATEGORIES } from '../../mockData'
import confetti from 'canvas-confetti'
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Scale, 
  Banknote, 
  Receipt, 
  Building2, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  Play,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Trash2,
  X
} from 'lucide-react'

export const HandoverTracking: React.FC = () => {
  const { 
    t, 
    lots, 
    activeLotId, 
    setActiveLotId, 
    updateLotStatus, 
    deleteLot,
    setSelectedReceiptLotId,
    setIsAddScrapModalOpen,
    role,
    setRole,
    setWeighModalLotId
  } = useApp()

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMaterial, setFilterMaterial] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inspectDrawerLot, setInspectDrawerLot] = useState<ScrapLot | null>(null)

  const currentLot = lots.find((l) => l.id === activeLotId) || lots[0]

  // Sequence of stages according to PRD Section 14:
  const STAGES: { key: LotStatus; labelKey: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'lot_created', labelKey: 'step_created', icon: <CheckCircle2 className="w-4 h-4" />, desc: 'Collector created scrap lot with AI estimate' },
    { key: 'recycler_requested', labelKey: 'step_requested', icon: <Clock className="w-4 h-4" />, desc: 'Requested handover to verified recycler' },
    { key: 'recycler_accepted', labelKey: 'step_accepted', icon: <Building2 className="w-4 h-4" />, desc: 'Recycler accepted lot & scheduled intake' },
    { key: 'pickup_scheduled', labelKey: 'step_pickup', icon: <Truck className="w-4 h-4" />, desc: 'Driver dispatched or scrap brought to facility' },
    { key: 'weight_confirmed', labelKey: 'step_weight', icon: <Scale className="w-4 h-4" />, desc: 'Official weighbridge weight inspected & calibrated' },
    { key: 'completed', labelKey: 'step_completed', icon: <Receipt className="w-4 h-4" />, desc: 'Payment settled & digital manifest issued' },
  ]

  const getStageIndex = (status: LotStatus) => {
    switch (status) {
      case 'draft': return -1
      case 'lot_created': return 0
      case 'recycler_requested': return 1
      case 'recycler_accepted': return 2
      case 'pickup_scheduled': return 3
      case 'weight_confirmed': return 4
      case 'completed': return 5
      case 'rejected': return -1
      default: return 0
    }
  }

  const currentStageIndex = currentLot ? getStageIndex(currentLot.status) : 0

  // Simulation handler
  const handleSimulateNext = () => {
    if (!currentLot) return
    const order: LotStatus[] = [
      'lot_created',
      'recycler_requested',
      'recycler_accepted',
      'pickup_scheduled',
      'weight_confirmed',
      'completed',
    ]

    const nextIdx = Math.min(order.length - 1, currentStageIndex + 1)
    const nextStatus = order[nextIdx]

    let extraUpdates = {}
    if (nextStatus === 'weight_confirmed') {
      const verifiedWeight = Number((currentLot.declaredWeightKg + 0.2).toFixed(1))
      extraUpdates = {
        verifiedWeightKg: verifiedWeight,
        finalPrice: Math.round(verifiedWeight * 225),
      }
    } else if (nextStatus === 'completed') {
      const verifiedWeight = currentLot.verifiedWeightKg || currentLot.declaredWeightKg
      extraUpdates = {
        paymentStatus: 'PAID' as const,
        paymentMethod: 'CASH' as const,
        finalPrice: currentLot.finalPrice || Math.round(verifiedWeight * 225),
      }
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      } catch (e) {}
    }

    updateLotStatus(currentLot.id, nextStatus, extraUpdates)
  }

  const handleResetStage = () => {
    if (!currentLot) return
    updateLotStatus(currentLot.id, 'lot_created', {
      paymentStatus: 'UNPAID',
      finalPrice: undefined,
      verifiedWeightKg: undefined,
    })
  }

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    if (filterStatus !== 'all' && lot.status !== filterStatus) return false
    if (filterMaterial !== 'all' && lot.category !== filterMaterial) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchId = lot.id.toLowerCase().includes(q)
      const matchMat = lot.category.toLowerCase().includes(q)
      const matchRec = (lot.recyclerName || '').toLowerCase().includes(q)
      return matchId || matchMat || matchRec
    }
    return true
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Scrap Lots & Handover Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time digital traceability manifest for e-waste compliance and payouts.
          </p>
        </div>

        <button
          onClick={() => setIsAddScrapModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm self-start sm:self-auto"
        >
          + Add New Scrap Lot
        </button>
      </div>

      {/* FILTER TOOLBAR FOR DESKTOP (PRD Section 12) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Lot ID, material..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="lot_created">Lot Created</option>
            <option value="recycler_requested">Requested</option>
            <option value="recycler_accepted">Accepted</option>
            <option value="completed">Completed / Paid</option>
          </select>

          {/* Material Filter */}
          <select
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
          >
            <option value="all">All Materials</option>
            {MATERIAL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{t(c.labelKey)}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-400">
          Showing {filteredLots.length} of {lots.length} lots
        </div>
      </div>

      {/* DESKTOP LOTS TABLE (PRD Section 12) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Lot ID</th>
                <th className="py-4 px-6">Material</th>
                <th className="py-4 px-6 text-right">Weight</th>
                <th className="py-4 px-6 text-right">Estimated Value</th>
                <th className="py-4 px-6">Recycler</th>
                <th className="py-4 px-6">Created Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredLots.map((lot) => {
                const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)
                const isSelected = lot.id === currentLot.id

                return (
                  <tr
                    key={lot.id}
                    onClick={() => setActiveLotId(lot.id)}
                    className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/40 font-semibold' : ''
                    }`}
                  >
                    {/* Lot ID & Image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={lot.photoUrl}
                          alt="lot"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-mono font-black text-slate-900 text-xs block">
                            {lot.id}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Condition: {lot.condition}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Material */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span>{catMeta?.icon}</span>
                        <span className="font-extrabold text-slate-900">
                          {t(catMeta?.labelKey || '')}
                        </span>
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-4 px-6 text-right font-black text-slate-900">
                      {lot.verifiedWeightKg || lot.declaredWeightKg} kg
                    </td>

                    {/* Estimated / Final Value */}
                    <td className="py-4 px-6 text-right font-black text-emerald-700 font-mono">
                      ₹{(lot.finalPrice || lot.quotedPrice).toLocaleString()}
                    </td>

                    {/* Recycler */}
                    <td className="py-4 px-6 text-slate-700 font-semibold">
                      {lot.recyclerName || 'ABC E-Waste Recycling'}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 text-[11px]">
                      {lot.createdAt}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          lot.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : lot.status === 'recycler_accepted' || lot.status === 'pickup_scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {lot.status === 'completed' ? '🟢 Paid' : lot.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setInspectDrawerLot(lot)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View</span>
                        </button>

                        {lot.status === 'completed' && (
                          <button
                            onClick={() => setSelectedReceiptLotId(lot.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVE SELECTED LOT TRACEABILITY TIMELINE CARD (PRD Section 14) */}
      {currentLot && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                  Active Lot: {currentLot.id}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {currentLot.category.toUpperCase()} ({currentLot.declaredWeightKg} kg)
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Handover Lifecycle & Traceability Audit Progress
              </h3>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetStage}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {currentStageIndex < STAGES.length - 1 ? (
                <button
                  onClick={handleSimulateNext}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Simulate Next Stage →</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedReceiptLotId(currentLot.id)}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 animate-pulse"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Digital Receipt</span>
                </button>
              )}
            </div>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {STAGES.map((stage, idx) => {
              const isPassed = idx < currentStageIndex
              const isCurrent = idx === currentStageIndex

              return (
                <div
                  key={stage.key}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 shadow-xs'
                      : isPassed
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold mb-2 ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    {t(stage.labelKey)}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{stage.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* INSPECT LOT DETAIL DRAWER / MODAL (PRD Section 14) */}
      {inspectDrawerLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-end p-0">
          <div className="bg-white h-full w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {inspectDrawerLot.id}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Transaction Details</h3>
                </div>

                <button
                  onClick={() => setInspectDrawerLot(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Photo & Material Header */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={inspectDrawerLot.photoUrl}
                  alt="material"
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-300 shrink-0"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 uppercase block">
                    {inspectDrawerLot.category}
                  </span>
                  <span className="text-2xl font-black text-emerald-700 font-mono block">
                    {inspectDrawerLot.declaredWeightKg} kg
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Condition: {inspectDrawerLot.condition}
                  </span>
                </div>
              </div>

              {/* Financial Breakdown (PRD Section 14) */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Financial Summary</h4>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Quoted Valuation:</span>
                  <span className="font-mono font-bold">₹{inspectDrawerLot.quotedPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-300">Final Settled Price:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">
                    ₹{(inspectDrawerLot.finalPrice || inspectDrawerLot.quotedPrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-300">Payment Status:</span>
                  <span className="font-bold text-emerald-300">
                    🟢 {inspectDrawerLot.paymentStatus} ({inspectDrawerLot.paymentMethod || 'CASH'})
                  </span>
                </div>
              </div>

              {/* Traceability Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900">Traceability Timeline & Locations</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">📍 Collection Location:</span>
                    <span className="font-bold text-slate-800">{inspectDrawerLot.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">🏭 Handover Recycler:</span>
                    <span className="font-bold text-slate-800">{inspectDrawerLot.recyclerName || 'ABC Recycler'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">🕐 Creation Timestamp:</span>
                    <span className="text-slate-700">{inspectDrawerLot.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setInspectDrawerLot(null)
                  setSelectedReceiptLotId(inspectDrawerLot.id)
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                View Digital Manifest Receipt →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
