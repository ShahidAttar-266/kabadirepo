import React from 'react'
import { useApp } from '../../context/AppContext'
import { 
  Building2, 
  ShieldCheck, 
  FileCheck, 
  Award, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Download,
  AlertTriangle
} from 'lucide-react'

export const FacilityProfile: React.FC = () => {
  const { t, recyclers } = useApp()
  const facility = recyclers[0] // ABC E-Waste Recycling Pvt Ltd

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t('rec_facility_profile')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Government regulatory compliance, MPCB/CPCB license audit trail, and facility credentials.
        </p>
      </div>

      {/* Verification Status Banner (PRD Section 18) */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>AUTHORIZATION VERIFIED (GRADE A DISMANTLER)</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">{facility.facilityName}</h3>
          <p className="text-xs text-emerald-100/90 max-w-xl">
            Fully certified by the Maharashtra Pollution Control Board under E-Waste (Management) Rules, 2024.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[180px] self-stretch md:self-auto">
          <span className="text-[10px] uppercase font-bold text-emerald-200 block">Registration Code</span>
          <span className="text-sm font-mono font-black text-white mt-1 block tracking-wider">
            {facility.authorizationNo}
          </span>
          <span className="text-[11px] text-emerald-300 font-semibold block mt-1">
            Valid until {facility.validTill}
          </span>
        </div>
      </div>

      {/* Grid of Legal & Operational Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Environmental Authorization Details (PRD Section 18) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pollution Control Board Credentials</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{t('auth_number')}</span>
              <span className="font-mono font-bold text-slate-900">{facility.authorizationNo}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{t('auth_authority')}</span>
              <span className="font-bold text-slate-800">{facility.issuingAuthority} (Govt of Maharashtra)</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Compliance Verification Date:</span>
              <span className="font-bold text-slate-800">{facility.verificationDate}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{t('auth_validity')}</span>
              <span className="font-bold text-emerald-700">{facility.validTill}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Approved Annual Intake:</span>
              <span className="font-black text-slate-900">{facility.capacityTonsPerYear} Metric Tons / Year</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium">CPCB EPR Registration:</span>
              <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                EPR-EW-2024-MH-904
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>MPCB_Authorization_Certificate_2024.pdf</span>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800"
            >
              View Document
            </button>
          </div>
        </div>

        {/* Facility Contact & Location Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Facility Location & Management</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Authorized Manager:</span>
              <span className="font-bold text-slate-900">{facility.ownerName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Phone Helpline:</span>
              <span className="font-bold text-slate-900">{facility.phone}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Official Email:</span>
              <span className="font-bold text-slate-900">{facility.email}</span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Plant Address:</span>
              <span className="font-bold text-slate-800 text-right max-w-[220px]">
                {facility.address}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium">Operating Hours:</span>
              <span className="font-bold text-slate-700">08:00 AM - 07:00 PM (Monday - Saturday)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-0.5">Heavy Vehicle Weighbridge</p>
            <p>Digital computerized 40-ton weighbridge available with automatic MPCB-linked printout.</p>
          </div>
        </div>

      </div>

    </div>
  )
}
