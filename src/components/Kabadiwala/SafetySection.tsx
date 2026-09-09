import React from 'react'
import { useApp } from '../../context/AppContext'
import { SAFETY_TIPS } from '../../mockData'
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  FlaskConical, 
  BatteryWarning, 
  Tv,
  HeartHandshake
} from 'lucide-react'

export const SafetySection: React.FC = () => {
  const { t, language, playingTipId, playSafetyAudio, stopSafetyAudio } = useApp()

  const getTipIcon = (id: string) => {
    switch (id) {
      case 'cables_burn':
        return <Flame className="w-7 h-7 text-rose-600" />
      case 'acid_leach':
        return <FlaskConical className="w-7 h-7 text-amber-600" />
      case 'battery_puncture':
        return <BatteryWarning className="w-7 h-7 text-orange-600" />
      case 'crt_implosion':
        return <Tv className="w-7 h-7 text-blue-600" />
      default:
        return <AlertTriangle className="w-7 h-7 text-amber-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Safety Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-700/60 border border-rose-500/40 text-rose-200 text-xs font-bold mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-300" />
            <span>Hazard Prevention & Worker Health</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('safety_title')}
          </h1>

          <p className="text-sm text-rose-100/90 mt-2">
            {t('safety_subtitle')}. Hazardous informal dismantling cuts life expectancy and ruins groundwater. Learn safe practices and listen in your language.
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-rose-200">
            <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>Click "🔊 Listen" on any card for spoken Marathi, Hindi, or English instructions.</span>
          </div>
        </div>
      </div>

      {/* Safety Cards Grid (PRD Section 19) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SAFETY_TIPS.map((tip) => {
          const isPlaying = playingTipId === tip.id
          const title = tip.title[language] || tip.title.en
          const hazard = tip.hazard[language] || tip.hazard.en
          const safeAlt = tip.safeAlternative[language] || tip.safeAlternative.en

          return (
            <div
              key={tip.id}
              className={`bg-white rounded-3xl border-2 transition-all p-6 flex flex-col justify-between shadow-xs ${
                isPlaying 
                  ? 'border-rose-500 ring-4 ring-rose-100 shadow-md' 
                  : 'border-slate-200 hover:border-rose-300'
              }`}
            >
              <div>
                {/* Header: Icon + Title + Audio Listen Button */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                      {getTipIcon(tip.id)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        {tip.severity === 'critical' ? 'CRITICAL HAZARD' : 'SAFETY WARNING'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        {title}
                      </h3>
                    </div>
                  </div>

                  {/* Audio Listen / Stop Button */}
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        stopSafetyAudio()
                      } else {
                        playSafetyAudio(tip.id)
                      }
                    }}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto ${
                      isPlaying
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>{t('btn_stop_audio')}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>{t('btn_listen_audio')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Animated Speech Soundwaves Indicator when playing */}
                {isPlaying && (
                  <div className="mt-4 p-2 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-center gap-1">
                    <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.45s]" />
                    <span className="w-1 h-6 bg-rose-700 rounded-full animate-bounce" />
                    <span className="text-[11px] font-bold text-rose-800 ml-2">
                      Speaking guidance ({language.toUpperCase()})...
                    </span>
                  </div>
                )}

                {/* The Hazard Description */}
                <div className="mt-4 p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs text-rose-950 space-y-1">
                  <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wider">
                    ⚠️ The Danger:
                  </span>
                  <p className="leading-relaxed">{hazard}</p>
                </div>

                {/* Safe Alternative Solution */}
                <div className="mt-3 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe Formal Method:</span>
                  </span>
                  <p className="leading-relaxed">{safeAlt}</p>
                </div>

              </div>

              {/* Bottom Assurance */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authorized recyclers pay full fair value</span>
                </span>
                <span className="font-semibold text-emerald-700">Zero health risk</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold">Maharashtra E-Waste Health & Safety Cell</h4>
          <p className="text-xs text-slate-400">
            For free toxic scrap disposal assistance, call toll-free: 1800-220-435
          </p>
        </div>
        <a
          href="tel:1800220435"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          Call Helpline Now
        </a>
      </div>

    </div>
  )
}
