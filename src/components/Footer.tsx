import React from 'react'
import { useApp } from '../context/AppContext'
import { Recycle, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  const { t, role, setRole, setActiveCollectorTab } = useApp()

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pb-20 sm:pb-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Kabadiwala<span className="text-emerald-500">Connect</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Empowering informal e-waste collectors across Maharashtra with transparent price discovery, safety guidance, and direct access to CPCB/MPCB authorized recyclers.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Compliant with E-Waste (Management) Rules, 2024</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              Marketplace
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveCollectorTab('prices')}
                  className="hover:text-white transition-colors"
                >
                  Live Scrap Prices (₹/kg)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCollectorTab('recyclers')}
                  className="hover:text-white transition-colors"
                >
                  Verified Recyclers Near Sangli
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCollectorTab('safety')}
                  className="hover:text-white transition-colors"
                >
                  Health & Toxic Safety Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCollectorTab('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Recycler Portal & Help */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              Portals & Helplines
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setRole(role === 'collector' ? 'recycler' : 'collector')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {role === 'collector' ? 'Join as Authorized Recycler →' : 'Switch to Collector View →'}
                </button>
              </li>
              <li className="flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Helpline: 1800-220-435</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>support@kabadiwalaconnect.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 Kabadiwala Connect. An open public digital e-waste infrastructure initiative.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for Sangli & Maharashtra scrap collectors</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
