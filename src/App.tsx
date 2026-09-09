import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { DesktopSidebar } from './components/DesktopSidebar'
import { DesktopTopHeader } from './components/DesktopTopHeader'
import { CollectorHome } from './components/Kabadiwala/CollectorHome'
import { PriceBoard } from './components/Kabadiwala/PriceBoard'
import { RecyclerMarketplace } from './components/Kabadiwala/RecyclerMarketplace'
import { HandoverTracking } from './components/Kabadiwala/HandoverTracking'
import { EarningsView } from './components/Kabadiwala/EarningsView'
import { SafetySection } from './components/Kabadiwala/SafetySection'
import { BottomNav } from './components/Kabadiwala/BottomNav'
import { AddScrapWizard } from './components/Kabadiwala/AddScrapWizard'
import { DigitalReceipt } from './components/Kabadiwala/DigitalReceipt'
import { RecyclerDashboard } from './components/Recycler/RecyclerDashboard'
import { HowItWorks } from './components/Public/HowItWorks'

const AppContent: React.FC = () => {
  const { 
    role, 
    activeCollectorTab, 
    isAddScrapModalOpen, 
    setIsAddScrapModalOpen,
    selectedReceiptLotId,
    setSelectedReceiptLotId
  } = useApp()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col lg:flex-row">
      
      {/* DESKTOP SIDEBAR (lg:flex, hidden on mobile/tablet) */}
      <div className="hidden lg:block shrink-0">
        <DesktopSidebar />
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOP HEADER (lg:block, hidden on mobile) */}
        <div className="hidden lg:block sticky top-0 z-30">
          <DesktopTopHeader />
        </div>

        {/* MOBILE HEADER (lg:hidden) */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* MAIN VIEW CONTENT AREA */}
        <main className="flex-1 pb-24 lg:pb-8 w-full max-w-[1600px] mx-auto">
          {role === 'collector' ? (
            <>
              {activeCollectorTab === 'home' && <CollectorHome />}
              {activeCollectorTab === 'prices' && <PriceBoard />}
              {activeCollectorTab === 'recyclers' && <RecyclerMarketplace />}
              {activeCollectorTab === 'lots' && <HandoverTracking />}
              {activeCollectorTab === 'earnings' && <EarningsView />}
              {activeCollectorTab === 'safety' && <SafetySection />}
              {activeCollectorTab === 'how-it-works' && <HowItWorks />}
            </>
          ) : (
            <RecyclerDashboard />
          )}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>

      {/* Mobile Sticky Bottom Navigation (< lg) */}
      <BottomNav />

      {/* Add Scrap Wizard Modal */}
      {isAddScrapModalOpen && (
        <AddScrapWizard onClose={() => setIsAddScrapModalOpen(false)} />
      )}

      {/* Digital Handover Receipt Modal */}
      {selectedReceiptLotId && (
        <DigitalReceipt
          lotId={selectedReceiptLotId}
          onClose={() => setSelectedReceiptLotId(null)}
        />
      )}
    </div>
  )
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
