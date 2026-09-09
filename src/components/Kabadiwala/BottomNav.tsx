import React from 'react'
import { useApp } from '../../context/AppContext'
import { 
  Home, 
  Package, 
  Plus, 
  Building2, 
  Wallet
} from 'lucide-react'

export const BottomNav: React.FC = () => {
  const { 
    t, 
    role, 
    activeCollectorTab, 
    setActiveCollectorTab,
    setIsAddScrapModalOpen,
    lots 
  } = useApp()

  if (role !== 'collector') return null

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl pt-1 pb-2.5 px-2 pb-safe"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto items-center">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveCollectorTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[48px] ${
            activeCollectorTab === 'home'
              ? 'text-emerald-700 font-extrabold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
            {t('nav_home')}
          </span>
        </button>

        {/* Tab 2: Lots */}
        <button
          onClick={() => setActiveCollectorTab('lots')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative min-h-[48px] ${
            activeCollectorTab === 'lots'
              ? 'text-emerald-700 font-extrabold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {lots.length > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {lots.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
            {t('nav_my_lots')}
          </span>
        </button>

        {/* Center Prominent FAB: ＋ Add Scrap */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => setIsAddScrapModalOpen(true)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-700/30 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 border-4 border-white"
            aria-label="Add Scrap"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
          <span className="text-[9px] font-extrabold text-emerald-800 tracking-tight mt-0.5">
            + Scrap
          </span>
        </div>

        {/* Tab 4: Recycler */}
        <button
          onClick={() => setActiveCollectorTab('recyclers')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[48px] ${
            activeCollectorTab === 'recyclers'
              ? 'text-emerald-700 font-extrabold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
            {t('nav_recyclers')}
          </span>
        </button>

        {/* Tab 5: Earnings */}
        <button
          onClick={() => setActiveCollectorTab('earnings')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[48px] ${
            activeCollectorTab === 'earnings'
              ? 'text-emerald-700 font-extrabold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
            {t('nav_earnings')}
          </span>
        </button>

      </div>
    </nav>
  )
}
