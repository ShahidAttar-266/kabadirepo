import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ScrapLot } from '../../types'
import confetti from 'canvas-confetti'
import { 
  Scale, 
  Banknote, 
  CheckCircle2, 
  X, 
  Calculator, 
  Building2, 
  ShieldCheck, 
  Receipt,
  QrCode
} from 'lucide-react'

interface WeighAndPayModalProps {
  lot: ScrapLot
  onClose: () => void
}

export const WeighAndPayModal: React.FC<WeighAndPayModalProps> = ({ lot, onClose }) => {
  const { t, updateLotStatus, setSelectedReceiptLotId } = useApp()

  const [verifiedWeight, setVerifiedWeight] = useState<number>(
    lot.verifiedWeightKg || lot.declaredWeightKg
  )
  const [ratePerKg, setRatePerKg] = useState<number>(
    Math.round(lot.quotedPrice / lot.declaredWeightKg) || 225
  )
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('CASH')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const finalAmount = Math.round(verifiedWeight * ratePerKg)

  const handleConfirmAndPay = () => {
    setIsProcessing(true)

    setTimeout(() => {
      updateLotStatus(lot.id, 'completed', {
        verifiedWeightKg: verifiedWeight,
        finalPrice: finalAmount,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod,
      })

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch (e) {}

      setIsProcessing(false)
      onClose()
      setSelectedReceiptLotId(lot.id)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Weighbridge & Payout Settlement</h3>
              <p className="text-xs text-slate-400">Lot Ref: {lot.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Material & Declared Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Material</span>
              <span className="font-extrabold text-slate-900 text-sm">{lot.category.toUpperCase()}</span>
            </div>
            <div className="text-center">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Collector Declared</span>
              <span className="font-bold text-slate-700">{lot.declaredWeightKg} kg</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Initial Quote</span>
              <span className="font-bold text-slate-700">₹{lot.quotedPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Calibrated Weight Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Inspected Weighbridge Weight (kg):</span>
              <span className="text-[11px] font-semibold text-emerald-600">Digital Scale Synced</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={verifiedWeight}
                onChange={(e) => setVerifiedWeight(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                kg
              </span>
            </div>
          </div>

          {/* Rate per kg */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Agreed Buying Rate (₹/kg):
            </label>
            <div className="relative">
              <input
                type="number"
                value={ratePerKg}
                onChange={(e) => setRatePerKg(parseInt(e.target.value) || 0)}
                className="w-full text-xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹/kg
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Disbursement Method:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CASH', label: 'Cash Spot' },
                { id: 'UPI', label: 'UPI Instant' },
                { id: 'BANK_TRANSFER', label: 'NEFT / RTGS' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    paymentMethod === m.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Final Calculated Amount */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800">
                Total Settlement to Collector
              </span>
              <p className="text-xs text-emerald-700">
                {verifiedWeight} kg × ₹{ratePerKg}/kg
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
              ₹{finalAmount.toLocaleString()}
            </div>
          </div>

          {/* Confirm & Issue Receipt Button */}
          <button
            onClick={handleConfirmAndPay}
            disabled={isProcessing || verifiedWeight <= 0}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            {isProcessing ? (
              <span>Recording Digital Manifest...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Weight & Issue Payout</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}
