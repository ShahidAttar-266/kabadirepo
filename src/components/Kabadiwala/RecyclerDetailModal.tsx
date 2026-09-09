import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { RecyclerProfile, MaterialCategory } from '../../types'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { 
  Building2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react'

interface RecyclerDetailModalProps {
  recycler: RecyclerProfile
  onClose: () => void
}

export const RecyclerDetailModal: React.FC<RecyclerDetailModalProps> = ({
  recycler,
  onClose,
}) => {
  const { t, lots, updateLotStatus, setActiveLotId, setActiveCollectorTab } = useApp()
  
  // Available lots created by collector that can be requested
  const pendingLots = lots.filter(
    (l) => l.status === 'lot_created' || l.status === 'draft' || !l.recyclerId
  )
  const [selectedLotId, setSelectedLotId] = useState<string>(
    pendingLots[0]?.id || lots[0]?.id || ''
  )
  const [requestSent, setRequestSent] = useState(false)
  const [handoverType, setHandoverType] = useState<'pickup' | 'dropoff'>('pickup')

  const handleRequestHandover = () => {
    if (!selectedLotId) return
    const chosenLot = lots.find((l) => l.id === selectedLotId)
    if (!chosenLot) return

    // Find rate for that lot's material from this recycler
    const offerRate = recycler.rates[chosenLot.category]?.ratePerKg || chosenLot.quotedPrice / chosenLot.declaredWeightKg
    const newQuotedPrice = Math.round(offerRate * chosenLot.declaredWeightKg)

    updateLotStatus(selectedLotId, 'recycler_requested', {
      recyclerId: recycler.id,
      recyclerName: recycler.facilityName,
      quotedPrice: newQuotedPrice,
    })

    setActiveLotId(selectedLotId)
    setRequestSent(true)

    setTimeout(() => {
      onClose()
      setActiveCollectorTab('lots')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{recycler.verificationStatus === 'verified' ? t('badge_verified') : t('badge_pending')}</span>
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              📍 {recycler.distanceKm} km {t('away')}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">{recycler.facilityName}</h2>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">{recycler.description}</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Pickup Radius</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{recycler.serviceRadiusKm} km</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Annual Capacity</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{recycler.capacityTonsPerYear} MT</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Completed Lots</p>
              <p className="text-base font-extrabold text-emerald-700 mt-0.5">{recycler.totalTransactions}+</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
              <p className="text-base font-extrabold text-amber-600 mt-0.5">★ {recycler.rating} / 5</p>
            </div>
          </div>

          {/* Environmental Authorization Section (PRD Section 11 & 18) */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{t('authorization_details')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium">{t('auth_number')}</span>
                <span className="font-mono font-bold text-slate-800 ml-1">{recycler.authorizationNo}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{t('auth_authority')}</span>
                <span className="font-bold text-slate-800 ml-1">{recycler.issuingAuthority} (Govt of Maharashtra)</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{t('auth_validity')}</span>
                <span className="font-bold text-slate-800 ml-1">{recycler.validTill}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Last Audited:</span>
                <span className="font-bold text-slate-800 ml-1">{recycler.verificationDate}</span>
              </div>
            </div>
          </div>

          {/* Current Material Offers Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Materials Accepted & Guaranteed Rates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(recycler.rates).map(([catKey, rateData]) => {
                const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === catKey)
                if (!rateData.accepted) return null
                return (
                  <div
                    key={catKey}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{catMeta?.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{t(catMeta?.labelKey || '')}</p>
                        <p className="text-[10px] text-slate-500">Min. {rateData.minQuantityKg} kg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-700">₹{rateData.ratePerKg}</span>
                      <span className="text-[10px] font-bold text-slate-500">/kg</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Facility Address: </span>
                <span className="text-slate-600">{recycler.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {recycler.phone}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                08:00 AM – 07:00 PM (Mon-Sat)
              </span>
            </div>
          </div>

          {/* Handover Request Form */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-4">
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('btn_request_handover')}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Lock in this recycler's guaranteed rate and schedule your material transfer.
              </p>
            </div>

            {/* Select Lot to Handover */}
            {lots.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Select Scrap Lot to Sell:
                  </label>
                  <select
                    value={selectedLotId}
                    onChange={(e) => setSelectedLotId(e.target.value)}
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {lots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.id} — {lot.category.toUpperCase()} ({lot.declaredWeightKg} kg) — Est. ₹{lot.quotedPrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Handover Mode */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHandoverType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      handoverType === 'pickup'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Free Doorstep Pickup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHandoverType('dropoff')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      handoverType === 'dropoff'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Self Drop at Center</span>
                  </button>
                </div>

                {/* Submit Request CTA */}
                <button
                  onClick={handleRequestHandover}
                  disabled={requestSent}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {requestSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                      <span>Request Sent to {recycler.facilityName}!</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Handover Request →</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-slate-400">
                You have no active lots. Click "+ Add Scrap" first to photograph and create a lot.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
