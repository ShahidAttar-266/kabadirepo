import React from 'react'
import { useApp } from '../../context/AppContext'
import { MATERIAL_CATEGORIES } from '../../mockData'
import { 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  Printer, 
  X, 
  Recycle, 
  MapPin, 
  Building2, 
  QrCode, 
  Leaf, 
  Award,
  Download
} from 'lucide-react'

interface DigitalReceiptProps {
  lotId: string
  onClose: () => void
}

export const DigitalReceipt: React.FC<DigitalReceiptProps> = ({ lotId, onClose }) => {
  const { t, lots } = useApp()
  const lot = lots.find((l) => l.id === lotId) || lots[0]

  if (!lot) return null

  const catMeta = MATERIAL_CATEGORIES.find((c) => c.id === lot.category)

  const handlePrint = () => {
    window.print()
  }

  const handleShareWhatsApp = () => {
    const text = `♻️ Kabadiwala Connect - Official Digital Handover Receipt\nLot ID: ${lot.id}\nMaterial: ${lot.category.toUpperCase()} (${lot.verifiedWeightKg || lot.declaredWeightKg} kg)\nFinal Payout: ₹${(lot.finalPrice || lot.quotedPrice).toLocaleString()}\nRecycler: ${lot.recyclerName || 'ABC E-Waste Recycling'}\nStatus: PAID & TRACEABLE`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:w-full">
        
        {/* Receipt Header Actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Handover Manifest</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top Brand & Certification */}
          <div className="text-center pb-5 border-b border-dashed border-slate-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-700/20">
              <Recycle className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              Kabadiwala<span className="text-emerald-600">Connect</span>
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
              E-Waste Transfer Manifest & Payout Voucher
            </p>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>HANDOVER COMPLETED ✓</span>
            </div>
          </div>

          {/* Reference & QR Code Section */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                {t('reference_no')}
              </span>
              <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                {lot.id}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Timestamp: {lot.updatedAt || lot.createdAt}
              </span>
            </div>

            <div className="w-16 h-16 bg-white border border-slate-300 rounded-xl p-1 flex items-center justify-center shadow-2xs">
              <div className="text-center font-mono text-[9px] text-slate-400 leading-tight">
                <QrCode className="w-10 h-10 text-slate-800 mx-auto" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Detailed Ledger Rows */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Material Category:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <span>{catMeta?.icon}</span>
                <span>{t(catMeta?.labelKey || '')}</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Declared Weight:</span>
              <span className="font-bold text-slate-700">{lot.declaredWeightKg} kg</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Inspected Weighbridge Weight:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {lot.verifiedWeightKg || lot.declaredWeightKg} kg
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Initial Quoted Value:</span>
              <span className="text-slate-600 font-mono">₹{lot.quotedPrice.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b-2 border-slate-900">
              <span className="text-sm font-extrabold text-slate-900">Final Settled Price:</span>
              <span className="text-xl font-black text-emerald-700 font-mono">
                ₹{(lot.finalPrice || lot.quotedPrice).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Mode & Status:</span>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {lot.paymentMethod || 'CASH'} — {lot.paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Authorized Recycler:</span>
              <span className="font-bold text-slate-800 text-right">
                {lot.recyclerName || 'ABC E-Waste Recycling Pvt Ltd'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 font-medium">Handover Location:</span>
              <span className="font-medium text-slate-700 text-right">{lot.location}</span>
            </div>
          </div>

          {/* Environmental Impact Green Stamp */}
          <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-emerald-950">
              <p className="font-bold">E-Waste Rule 2024 Compliant Transfer</p>
              <p className="text-emerald-800">
                Safely diverted from hazardous informal burning. Saved approx. 1.8 kg CO₂ equivalent and prevented toxic lead runoff.
              </p>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing, PRD Section 15) */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 pt-2 print:hidden">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-transform active:scale-95 min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Receipt</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
