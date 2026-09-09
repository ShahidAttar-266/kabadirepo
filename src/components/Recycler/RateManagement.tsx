import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { MaterialCategory } from '../../types'
import { 
  Percent, 
  Truck, 
  Calendar, 
  Clock, 
  Check, 
  Edit3, 
  Save, 
  Sparkles,
  Sliders,
  DollarSign,
  PlusCircle,
  Plus,
  X
} from 'lucide-react'

export const RateManagement: React.FC = () => {
  const { t, recyclers, updateRecyclerRate, updateRecyclerProfile } = useApp()
  const currentRecycler = recyclers[0] // ABC E-Waste Recycling Pvt Ltd

  const [editingCategory, setEditingCategory] = useState<MaterialCategory | null>(null)
  const [tempRate, setTempRate] = useState<number>(225)
  const [tempMinQty, setTempMinQty] = useState<number>(10)
  const [serviceRadius, setServiceRadius] = useState<number>(currentRecycler?.serviceRadiusKm || 50)
  const [pickupEnabled, setPickupEnabled] = useState<boolean>(currentRecycler?.pickupAvailable ?? true)
  const [savedToast, setSavedToast] = useState<string | null>(null)
  const [isAddRateModalOpen, setIsAddRateModalOpen] = useState<boolean>(false)

  // New rate modal state
  const [newCat, setNewCat] = useState<MaterialCategory>('pcb')
  const [newRate, setNewRate] = useState<number>(240)
  const [newMin, setNewMin] = useState<number>(10)

  const handleStartEdit = (cat: MaterialCategory, currentRate: number, currentMin: number) => {
    setEditingCategory(cat)
    setTempRate(currentRate)
    setTempMinQty(currentMin)
  }

  const handleSaveRate = (cat: MaterialCategory) => {
    if (!currentRecycler) return
    updateRecyclerRate(currentRecycler.id, cat, tempRate, tempMinQty)
    setEditingCategory(null)
    setSavedToast(`Updated ${cat.toUpperCase()} buying rate to ₹${tempRate}/kg`)
    setTimeout(() => setSavedToast(null), 3000)
  }

  const handleAddRateSubmit = () => {
    if (!currentRecycler) return
    updateRecyclerRate(currentRecycler.id, newCat, newRate, newMin)
    setIsAddRateModalOpen(false)
    setSavedToast(`Added spot rate for ${newCat.toUpperCase()} at ₹${newRate}/kg`)
    setTimeout(() => setSavedToast(null), 3000)
  }

  const handleUpdateLogistics = () => {
    if (!currentRecycler) return
    updateRecyclerProfile(currentRecycler.id, {
      serviceRadiusKm: serviceRadius,
      pickupAvailable: pickupEnabled,
    })
    setSavedToast('Logistics and service radius updated successfully')
    setTimeout(() => setSavedToast(null), 3000)
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Action: + Add Material Rate (PRD Section 18) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('rec_rates_materials')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure spot buying prices per kilogram and minimum lot intake thresholds for local collectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <div className="px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl animate-in fade-in flex items-center gap-1.5 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{savedToast}</span>
            </div>
          )}

          <button
            onClick={() => setIsAddRateModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Material Rate</span>
          </button>
        </div>
      </div>

      {/* Global Logistics Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Facility Pickup Logistics & Coverage</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Doorstep Pickup</span>
              <span className="text-slate-500 text-[11px]">Accept collection requests</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pickupEnabled}
                onChange={(e) => setPickupEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Service Radius</span>
              <span className="text-slate-500 text-[11px]">Coverage around Sangli</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max="150"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(parseInt(e.target.value) || 0)}
                className="w-16 text-right font-bold text-slate-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
              />
              <span className="font-bold text-slate-500">km</span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleUpdateLogistics}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Logistics Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP RATES TABLE (PRD Section 18) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Material</th>
                <th className="py-3.5 px-4">Current Rate (₹/kg)</th>
                <th className="py-3.5 px-4">Min. Quantity</th>
                <th className="py-3.5 px-4">Pickup</th>
                <th className="py-3.5 px-4">Service Radius</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {MATERIAL_CATEGORIES.map((cat) => {
                const rateObj = currentRecycler?.rates[cat.id]
                const isEditing = editingCategory === cat.id
                const currentRate = rateObj?.ratePerKg || cat.avgPrice
                const currentMin = rateObj?.minQuantityKg || 10
                const lastUpdated = rateObj?.lastUpdated || 'Today'

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Material Name */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1.5 rounded-xl bg-slate-100 border border-slate-200">
                          {cat.icon}
                        </span>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {t(cat.labelKey)}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            Category: {cat.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Rate per kg */}
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            value={tempRate}
                            onChange={(e) => setTempRate(parseInt(e.target.value) || 0)}
                            className="w-24 bg-emerald-50 border-2 border-emerald-500 rounded-lg px-2 py-1 font-bold text-emerald-800 text-sm"
                          />
                          <span className="text-slate-400">/kg</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-base font-black text-emerald-700 font-mono">
                            ₹{currentRate}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">/kg</span>
                        </div>
                      )}
                    </td>

                    {/* Min Quantity */}
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempMinQty}
                            onChange={(e) => setTempMinQty(parseInt(e.target.value) || 0)}
                            className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800 text-xs"
                          />
                          <span className="text-slate-400">kg</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-700">
                          {currentMin} kg
                        </span>
                      )}
                    </td>

                    {/* Pickup */}
                    <td className="py-4 px-4">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        ✓ Available
                      </span>
                    </td>

                    {/* Service Radius */}
                    <td className="py-4 px-4 font-semibold text-slate-600">
                      {serviceRadius} km
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {lastUpdated}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRate(cat.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(cat.id, currentRate, currentMin)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Rate</span>
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

      {/* ADD MATERIAL RATE MODAL (PRD Section 18) */}
      {isAddRateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">+ Add Material Buying Rate</h3>
              <button onClick={() => setIsAddRateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Material Category:</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as MaterialCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {t(cat.labelKey)} ({cat.id.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Buying Rate (₹ / kg):</label>
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-emerald-50 border-2 border-emerald-500 rounded-xl px-3 py-2 font-mono font-black text-emerald-800 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Minimum Intake Quantity (kg):</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setIsAddRateModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRateSubmit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Publish Rate →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
