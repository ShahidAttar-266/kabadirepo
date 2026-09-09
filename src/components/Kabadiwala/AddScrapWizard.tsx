import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { MaterialCategory, MaterialCondition } from '../../types'
import { MATERIAL_CATEGORIES, BENCHMARK_PRICES } from '../../mockData'
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Minus, 
  Plus, 
  ArrowRight, 
  X, 
  Layers, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Check
} from 'lucide-react'

interface AddScrapWizardProps {
  initialCategory?: MaterialCategory
  onClose: () => void
}

export const AddScrapWizard: React.FC<AddScrapWizardProps> = ({ 
  initialCategory = 'pcb', 
  onClose 
}) => {
  const { t, createLot, setActiveCollectorTab, isOffline } = useApp()

  // Desktop workflow state: Step 1 = Photo + AI, Step 2 = Material + Weight + Condition, Step 3 = Valuation & Submit
  const [step, setStep] = useState<number>(1)

  // Form State
  const [selectedImage, setSelectedImage] = useState<string>(
    MATERIAL_CATEGORIES.find(c => c.id === initialCategory)?.sampleImage || MATERIAL_CATEGORIES[0].sampleImage
  )
  const [isScanningAI, setIsScanningAI] = useState<boolean>(false)
  const [aiDetectedCategory, setAiDetectedCategory] = useState<MaterialCategory>(initialCategory)
  const [aiConfidence, setAiConfidence] = useState<number>(87)
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>(initialCategory)
  const [isManualCategory, setIsManualCategory] = useState<boolean>(false)
  const [weightKg, setWeightKg] = useState<number>(10)
  const [condition, setCondition] = useState<MaterialCondition>('good')
  const [createdLotId, setCreatedLotId] = useState<string | null>(null)

  // Trigger AI simulation when an image is chosen
  const handleSelectSample = (catId: MaterialCategory, imgUrl: string) => {
    setSelectedImage(imgUrl)
    setIsScanningAI(true)
    setTimeout(() => {
      setIsScanningAI(false)
      setAiDetectedCategory(catId)
      setSelectedCategory(catId)
      const conf = Math.floor(85 + Math.random() * 11)
      setAiConfidence(conf)
    }, 800)
  }

  // Handle manual file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string)
          setIsScanningAI(true)
          setTimeout(() => {
            setIsScanningAI(false)
            setAiDetectedCategory('pcb')
            setSelectedCategory('pcb')
            setAiConfidence(89)
          }, 900)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Calculate estimated price range
  const benchmark = BENCHMARK_PRICES.find((b) => b.category === selectedCategory) || BENCHMARK_PRICES[0]
  
  // Condition multiplier: good = 1.0, used = 0.88, damaged = 0.72
  const conditionFactor = condition === 'good' ? 1.0 : condition === 'used' ? 0.88 : 0.72
  const minEstimated = Math.round(benchmark.minPrice * weightKg * conditionFactor)
  const maxEstimated = Math.round(benchmark.maxPrice * weightKg * conditionFactor)
  const quotedPrice = Math.round(((minEstimated + maxEstimated) / 2))

  // Finish and create lot
  const handleCreateLot = () => {
    const newLot = createLot({
      collectorId: 'usr-kaba-01',
      collectorName: 'Ramesh Shinde',
      collectorPhone: '+91 98231 44099',
      category: selectedCategory,
      subCategory: `${benchmark.name} (${condition.toUpperCase()})`,
      condition: condition,
      declaredWeightKg: weightKg,
      estimatedMinPrice: minEstimated,
      estimatedMaxPrice: maxEstimated,
      quotedPrice: quotedPrice,
      photoUrl: selectedImage,
      aiConfidence: aiConfidence,
      aiDetectedMaterial: `AI: ${selectedCategory.toUpperCase()} (${aiConfidence}%)`,
      status: 'lot_created',
      location: 'Sangli, Maharashtra',
      coordinates: [16.8524, 74.5815],
      paymentStatus: 'UNPAID',
    })

    setCreatedLotId(newLot.id)
    setActiveCollectorTab('recyclers')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      {/* CENTERED MULTI-COLUMN DESKTOP WORKFLOW (PRD Section 10 & 11) */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span>Add New Scrap Lot</span>
            </h2>
            <p className="text-xs text-slate-500">
              AI material classification and real-time weighbridge valuation
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop 2-Column Workflow Body (PRD Section 10 & 11) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          
          {/* LEFT COLUMN: PHOTO UPLOAD & AI DETECTION RESULT (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4 border-r-0 md:border-r border-slate-100 md:pr-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Step 1: Scrap Lot Photograph & AI Detection
            </h3>

            {/* Main Image Shutter / Preview */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 group h-56 flex items-center justify-center shadow-md">
              <img
                src={selectedImage}
                alt="Uploaded scrap"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />

              {isScanningAI && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 text-white">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="text-xs font-bold text-emerald-300 animate-pulse">Running AI Vision Detection...</span>
                </div>
              )}

              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {/* AI CLASSIFICATION RESULT PANEL (PRD Section 11) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-extrabold text-slate-900">AI Material Detection</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                  {aiConfidence}% Confidence
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xl font-black text-slate-900 block">
                    {selectedCategory.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Suggested category: {benchmark.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsManualCategory(!isManualCategory)}
                    className="px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    Change Material
                  </button>
                </div>
              </div>

              {isManualCategory && (
                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-3 gap-1.5 animate-in fade-in">
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setIsManualCategory(false)
                      }}
                      className={`p-1.5 rounded-lg text-[10px] font-bold text-center border transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {cat.icon} {t(cat.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Sample Selector Row */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Or Choose Sample:</span>
              <div className="grid grid-cols-4 gap-2">
                {MATERIAL_CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectSample(cat.id, cat.sampleImage)}
                    className="p-1 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 text-center text-[10px] font-bold truncate"
                  >
                    {cat.icon} {cat.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: MATERIAL DETAILS, WEIGHT & CONDITION (md:col-span-7) */}
          <div className="md:col-span-7 space-y-5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Step 2: Lot Weight & Material Condition
            </h3>

            {/* Material Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 block">
                Selected Material Category
              </label>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1 bg-white rounded-lg border border-slate-200">
                    {MATERIAL_CATEGORIES.find(c => c.id === selectedCategory)?.icon || '♻️'}
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {benchmark.name}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      Base Rate: ₹{benchmark.currentPrice}/kg
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {selectedCategory.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Declared Weight Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">
                Declared Weight (kg)
              </label>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWeightKg(Math.max(1, weightKg - 1))}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-800 font-black text-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 font-black text-3xl text-slate-900 bg-transparent text-center focus:outline-none font-mono"
                    />
                    <span className="text-sm font-bold text-slate-500">kg</span>
                  </div>

                  <button
                    onClick={() => setWeightKg(weightKg + 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-800 font-black text-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {[5, 10, 25, 50].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeightKg(w)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        weightKg === w ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {w}k
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Condition Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">
                Component Condition
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'good' as MaterialCondition, label: '🟢 Good', desc: 'Full components' },
                  { id: 'used' as MaterialCondition, label: '🟡 Used', desc: 'Normal wear' },
                  { id: 'damaged' as MaterialCondition, label: '🔴 Damaged', desc: 'Broken parts' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCondition(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      condition === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Desktop Bottom Action Footer (PRD Section 10 & 11) */}
        <div className="px-6 py-4 bg-slate-900 text-white rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estimated Instant Valuation Range
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ₹{minEstimated.toLocaleString()} – ₹{maxEstimated.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateLot}
              className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Find Recycler & Request Handover →</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}
