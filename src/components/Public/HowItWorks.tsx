import React from 'react'
import { useApp } from '../../context/AppContext'
import { 
  Camera, 
  Sparkles, 
  Scale, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Banknote, 
  Receipt, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const { t, setIsAddScrapModalOpen, setActiveCollectorTab } = useApp()

  const STEPS = [
    {
      num: '01',
      icon: <Camera className="w-6 h-6 text-emerald-600" />,
      title: 'Snap a Photo of Scrap',
      desc: 'Take a picture of circuit boards, cables, batteries, or mixed e-waste directly with your mobile camera.',
    },
    {
      num: '02',
      icon: <Sparkles className="w-6 h-6 text-teal-600" />,
      title: 'Instant AI Material Recognition',
      desc: 'KabadiVision AI detects material purity grade and estimates fair market valuation based on daily MPCB rates.',
    },
    {
      num: '03',
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: 'Find Verified Local Recyclers',
      desc: 'Compare transparent prices from authorized recycling plants on an interactive map with free doorstep pickup options.',
    },
    {
      num: '04',
      icon: <Scale className="w-6 h-6 text-amber-600" />,
      title: 'Official Digital Weighing',
      desc: 'Recycler inspects and weighs the scrap on a calibrated digital scale, eliminating middleman cheating.',
    },
    {
      num: '05',
      icon: <Banknote className="w-6 h-6 text-emerald-600" />,
      title: 'Instant Payment & Digital Receipt',
      desc: 'Receive immediate UPI or spot cash payment with a verifiable legal digital transfer manifest (Form 6 compliant).',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>The Formal Recycling Advantage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How Kabadiwala Connect Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Making the formal e-waste route simpler, safer, and 30% more profitable than hazardous back-alley dismantling.
        </p>
      </div>

      {/* 5 Steps Grid (PRD Section 26) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between relative group hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-mono font-black text-emerald-600/30 group-hover:text-emerald-600 transition-colors">
                  {s.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                {s.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {s.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[10px] font-bold text-emerald-700">
              <span>Step {s.num}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Core Journey Comparison Table (Desktop md:block) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 hidden md:block">
        <h3 className="text-lg font-extrabold text-slate-900">
          Formal Recycling vs Informal Scrap Processing
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-emerald-800">Kabadiwala Connect (Formal)</th>
                <th className="py-3 px-4 text-rose-800">Informal Back-Alley Burning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700">Price Transparency</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Daily MPCB benchmark market rates</td>
                <td className="py-3 px-4 text-slate-500">Arbitrary middleman price cut (often 30-40% lower)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700">Health & Family Safety</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Zero toxic exposure, mechanized handling</td>
                <td className="py-3 px-4 text-rose-600 font-semibold">Carcinogenic dioxin smoke, acid lung burns</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700">Weighing Accuracy</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Computerized calibrated weighbridge</td>
                <td className="py-3 px-4 text-slate-500">Manual rigged scales</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700">Legal Documentation</td>
                <td className="py-3 px-4 font-bold text-emerald-700">E-Waste Form 6 digital transfer manifest</td>
                <td className="py-3 px-4 text-rose-600 font-semibold">Illegal scrap trade risk & police harassment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Comparison Cards (md:hidden) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 md:hidden">
        <h3 className="text-base font-extrabold text-slate-900">
          Formal vs Informal Recycling
        </h3>

        <div className="space-y-3">
          {[
            {
              feature: 'Price Transparency',
              formal: 'Daily MPCB benchmark market rates',
              informal: 'Arbitrary middleman cut (30-40% lower)',
            },
            {
              feature: 'Health & Safety',
              formal: 'Zero toxic exposure, mechanized handling',
              informal: 'Carcinogenic dioxin smoke, acid burns',
            },
            {
              feature: 'Weighing Accuracy',
              formal: 'Computerized calibrated weighbridge',
              informal: 'Manual rigged scales',
            },
            {
              feature: 'Legal Security',
              formal: 'E-Waste Form 6 digital transfer manifest',
              informal: 'Illegal trade risk & police harassment',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
              <span className="font-extrabold text-slate-900 text-xs block">{item.feature}</span>
              <div className="space-y-1.5 text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 text-emerald-900">
                  <span className="font-bold text-[11px] block text-emerald-700">✓ Kabadiwala Connect (Formal)</span>
                  <span className="font-semibold">{item.formal}</span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 text-rose-900">
                  <span className="font-bold text-[11px] block text-rose-700">✕ Informal Burning</span>
                  <span className="text-slate-600">{item.informal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl shadow-emerald-700/20">
        <h2 className="text-2xl sm:text-3xl font-black">
          Ready to sell your scrap lot at fair market price?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Start right now with our 5-step interactive wizard. No paperwork required for informal collectors.
        </p>
        <button
          onClick={() => setIsAddScrapModalOpen(true)}
          className="px-6 py-3 bg-white hover:bg-slate-100 text-emerald-900 rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95"
        >
          {t('action_add_scrap')} Now →
        </button>
      </div>

    </div>
  )
}
