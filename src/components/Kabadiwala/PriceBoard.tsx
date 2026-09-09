import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { BENCHMARK_PRICES, MATERIAL_CATEGORIES } from '../../mockData'
import { MaterialCategory, PriceBenchmark } from '../../types'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  MapPin, 
  Sparkles,
  X,
  LineChart,
  BarChart3,
  Search
} from 'lucide-react'

export const PriceBoard: React.FC = () => {
  const { t, location, setIsAddScrapModalOpen } = useApp()
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price_desc' | 'trend_desc' | 'name'>('price_desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [historyModalItem, setHistoryModalItem] = useState<PriceBenchmark | null>(null)

  const filteredPrices = BENCHMARK_PRICES.filter((item) => {
    if (selectedCategoryFilter === 'all') return true
    return item.category === selectedCategoryFilter
  }).sort((a, b) => {
    if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice
    if (sortBy === 'trend_desc') return b.trend - a.trend
    return a.name.localeCompare(b.name)
  })

  // Simulated 30-day historical chart data
  const getHistoricalPoints = (basePrice: number) => {
    return [
      { day: 'Aug 10', price: Math.round(basePrice * 0.92) },
      { day: 'Aug 15', price: Math.round(basePrice * 0.94) },
      { day: 'Aug 20', price: Math.round(basePrice * 0.93) },
      { day: 'Aug 25', price: Math.round(basePrice * 0.96) },
      { day: 'Sep 01', price: Math.round(basePrice * 0.98) },
      { day: 'Sep 05', price: Math.round(basePrice * 0.99) },
      { day: 'Today', price: basePrice },
    ]
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>MPCB Verified Market Benchmark Rates</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Certified E-Waste Price Board
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Real-time certified prices directly reported by authorized recyclers in {location}. Sell formally for maximum fair value without middleman cuts.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-emerald-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {t('updated_today')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              selectedCategoryFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filter_all')}
          </button>
          
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 min-h-[40px] ${
                selectedCategoryFilter === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t(cat.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* View mode toggle & Sort dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-semibold text-slate-500">
          
          {/* Toggle View Mode: Table vs Grid */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Grid Cards
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold text-xs min-h-[40px]"
          >
            <option value="price_desc">Highest Rate</option>
            <option value="trend_desc">Highest Trend ↑</option>
            <option value="name">Material Name</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (PRD Section 6) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Material</th>
                  <th className="py-4 px-6 text-right">Current Rate</th>
                  <th className="py-4 px-6 text-right">Market Range</th>
                  <th className="py-4 px-6 text-center">Trend</th>
                  <th className="py-4 px-6 text-center">Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredPrices.map((item) => {
                  const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === item.category)
                  const isUp = item.trend >= 0

                  return (
                    <tr key={item.category} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Material */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                            {catMeta?.icon || '♻️'}
                          </span>
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm block group-hover:text-emerald-700 transition-colors">
                              {t(catMeta?.labelKey || '')}
                            </span>
                            <span className="text-slate-400 text-[11px] block">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Current Rate */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-black text-slate-900 tracking-tight font-mono">
                          ₹{item.currentPrice}
                        </span>
                        <span className="text-xs font-bold text-slate-500"> /{item.unit}</span>
                      </td>

                      {/* Market Range */}
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          ₹{item.minPrice} – ₹{item.maxPrice}/{item.unit}
                        </span>
                      </td>

                      {/* Trend */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            isUp
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isUp ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>{isUp ? `↑ +${item.trend}%` : `↓ ${item.trend}%`}</span>
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="py-4 px-6 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Today
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setHistoryModalItem(item)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                            <span>History →</span>
                          </button>

                          <button
                            onClick={() => setIsAddScrapModalOpen(true)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                          >
                            <span>+ Add Scrap</span>
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
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPrices.map((item) => {
            const categoryMeta = MATERIAL_CATEGORIES.find((c) => c.id === item.category)
            const isUp = item.trend >= 0

            return (
              <div
                key={item.category}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {categoryMeta?.icon || '♻️'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{isUp ? `+${item.trend}%` : `${item.trend}%`}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
                    {t(categoryMeta?.labelKey || '')}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.name}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                        ₹{item.currentPrice}
                      </span>
                      <span className="text-xs font-bold text-slate-500">/{item.unit}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Market Range</span>
                      <span className="font-semibold text-slate-700">
                        ₹{item.minPrice} – ₹{item.maxPrice}/{item.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHistoryModalItem(item)}
                    className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                    <span>History</span>
                  </button>

                  <button
                    onClick={() => setIsAddScrapModalOpen(true)}
                    className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>+ Add Lot</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Fair Pricing Guidance Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 text-emerald-950">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-700/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-extrabold">Why formal recycling pays higher rates?</h4>
          <p className="text-xs text-emerald-800 mt-0.5 max-w-3xl">
            Authorized recyclers use mechanized shredders and automated recovery plants yielding 98%+ metal extraction, allowing them to legally pay upfront market benchmark rates with digital weighbridge transparency.
          </p>
        </div>
        <button
          onClick={() => setIsAddScrapModalOpen(true)}
          className="sm:ml-auto shrink-0 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          {t('action_add_scrap')}
        </button>
      </div>

      {/* PRICE HISTORY CHART MODAL (PRD Section 6) */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {historyModalItem.name} — Price History
                  </h3>
                  <p className="text-xs text-slate-500">30-Day Market Trend in Sangli District</p>
                </div>
              </div>

              <button
                onClick={() => setHistoryModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Metrics Highlight */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Current Rate</span>
                <span className="text-lg font-black text-emerald-700 font-mono">₹{historyModalItem.currentPrice}/kg</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Monthly Low</span>
                <span className="text-sm font-bold text-slate-700">₹{historyModalItem.minPrice}/kg</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Monthly High</span>
                <span className="text-sm font-bold text-slate-700">₹{historyModalItem.maxPrice}/kg</span>
              </div>
            </div>

            {/* Visual SVG Chart */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>30-Day Historical Curve</span>
                <span className="text-emerald-400 font-bold">↑ +{historyModalItem.trend}% Growth</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-800">
                {getHistoricalPoints(historyModalItem.currentPrice).map((pt, idx) => {
                  const maxVal = historyModalItem.currentPrice * 1.05
                  const heightPct = Math.round((pt.price / maxVal) * 100)

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[9px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{pt.price}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md group-hover:brightness-125 transition-all"
                      />
                      <span className="text-[9px] text-slate-400 mt-1">{pt.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setHistoryModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setHistoryModalItem(null)
                  setIsAddScrapModalOpen(true)
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Create Scrap Lot at ₹{historyModalItem.currentPrice}/kg →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
