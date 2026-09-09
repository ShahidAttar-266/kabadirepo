import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Receipt, 
  ArrowUpRight, 
  Filter, 
  PlusCircle, 
  TrendingUp, 
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  Search
} from 'lucide-react'

export const EarningsView: React.FC = () => {
  const { t, lots, setSelectedReceiptLotId, setIsAddScrapModalOpen, setActiveCollectorTab } = useApp()
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const totalCompletedEarnings = 18450 // PRD Section 15
  const thisMonthEarnings = 8200 // PRD Section 15
  const pendingDues = 2500 // PRD Section 15
  const completedCount = 32 // PRD Section 15

  const filteredLots = lots.filter((l) => {
    if (filterCategory !== 'all' && l.category !== filterCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchId = l.id.toLowerCase().includes(q)
      const matchMat = l.category.toLowerCase().includes(q)
      return matchId || matchMat
    }
    return true
  })

  // Simulated 6-month earnings history chart data
  const monthlyHistory = [
    { month: 'Apr', amount: 3200 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 5600 },
    { month: 'Jul', amount: 6900 },
    { month: 'Aug', amount: 7400 },
    { month: 'Sep (Current)', amount: 8200 },
  ]

  const maxMonthAmount = 10000

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Earnings & Digital Payout Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent payout records directly deposited to your bank / cash vouchers.
          </p>
        </div>

        <button
          onClick={() => setIsAddScrapModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Scrap Lot</span>
        </button>
      </div>

      {/* 4 TOP KPI CARDS FOR DESKTOP (PRD Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-700/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Earnings</span>
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-3xl lg:text-4xl font-black tracking-tight">
            ₹{totalCompletedEarnings.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-emerald-100 font-medium">
            100% EPR manifest verified
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>This Month</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            ₹{thisMonthEarnings.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% growth rate</span>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Payouts</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-amber-600 tracking-tight">
            ₹{pendingDues.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Under weighbridge / intake</span>
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Completed Txns</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {completedCount} lots
          </div>
          <div className="mt-3 text-xs text-emerald-700 font-semibold">
            Avg ₹576 per transaction
          </div>
        </div>

      </div>

      {/* EARNINGS OVER TIME CHART VISUALIZATION (PRD Section 15) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold text-white">Earnings Over Time</h3>
              <p className="text-xs text-slate-400">Monthly payout accumulation in INR (₹)</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            6-Month Trend Curve
          </span>
        </div>

        {/* Bar Graph */}
        <div className="h-52 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-800">
          {monthlyHistory.map((m, idx) => {
            const heightPct = Math.round((m.amount / maxMonthAmount) * 100)
            const isCurrent = idx === monthlyHistory.length - 1

            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className={`text-xs font-bold transition-opacity ${
                  isCurrent ? 'text-emerald-300 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                }`}>
                  ₹{m.amount.toLocaleString()}
                </span>

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full max-w-[60px] rounded-t-xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />

                <span className="text-xs font-bold text-slate-400 mt-2">{m.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* TRANSACTION HISTORY DESKTOP TABLE (PRD Section 13 & 15) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Transaction History</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Table view for desktop */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Txn ID</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4 text-right">Weight</th>
                <th className="py-3.5 px-4">Recycler</th>
                <th className="py-3.5 px-4 text-right">Quoted Price</th>
                <th className="py-3.5 px-4 text-right">Final Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredLots.map((lot) => {
                const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)
                const isPaid = lot.status === 'completed' || lot.paymentStatus === 'PAID'
                const payoutAmount = lot.finalPrice || lot.quotedPrice

                return (
                  <tr key={lot.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-black text-slate-900">
                      {lot.id}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span>{catMeta?.icon}</span>
                        <span className="font-extrabold text-slate-900">{t(catMeta?.labelKey || '')}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-slate-800">
                      {lot.verifiedWeightKg || lot.declaredWeightKg} kg
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      {lot.recyclerName || 'ABC Recycler'}
                    </td>

                    <td className="py-4 px-4 text-right text-slate-500 font-mono">
                      ₹{lot.quotedPrice.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right font-black text-emerald-700 font-mono text-sm">
                      ₹{payoutAmount.toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isPaid ? '🟢 Paid' : '🟡 Pending'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {isPaid ? (
                        <button
                          onClick={() => setSelectedReceiptLotId(lot.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveCollectorTab('lots')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                        >
                          Track →
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}
