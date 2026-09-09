import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { RecyclerProfile } from '../../types'

interface RecyclerMapProps {
  recyclers: RecyclerProfile[]
  selectedRecyclerId: string | null
  onSelectRecycler: (id: string) => void
  userLocation: [number, number] // [lat, lng]
}

export const RecyclerMap: React.FC<RecyclerMapProps> = ({
  recyclers,
  selectedRecyclerId,
  onSelectRecycler,
  userLocation = [16.8524, 74.5815],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [id: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Clean up previous instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Initialize Leaflet Map centered on user location
    const map = L.map(mapContainerRef.current, {
      center: userLocation,
      zoom: 12,
      scrollWheelZoom: false,
    })

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    // User Location Pulse Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
          <div class="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-lg relative z-10"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup('<b style="font-size:12px;">📍 Your Scrap Depot / Location</b>')

    // Recycler Markers
    markersRef.current = {}
    recyclers.forEach((rec) => {
      const isSelected = rec.id === selectedRecyclerId
      const pcbRate = rec.rates.pcb?.ratePerKg || 220

      const markerHtml = `
        <div class="transition-transform duration-200 hover:scale-110 cursor-pointer">
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${
            isSelected 
              ? 'bg-emerald-600 text-white shadow-xl ring-3 ring-emerald-300' 
              : 'bg-white text-slate-800 shadow-md border border-slate-200'
          }">
            <span style="font-size: 14px;">♻️</span>
            <div class="text-left leading-none">
              <div class="font-bold text-[11px] truncate max-w-[100px]">${rec.facilityName}</div>
              <div class="text-[10px] ${isSelected ? 'text-emerald-100' : 'text-emerald-700 font-semibold'}">₹${pcbRate}/kg · ${rec.distanceKm}km</div>
            </div>
          </div>
        </div>
      `

      const recyclerIcon = L.divIcon({
        className: 'custom-recycler-marker',
        html: markerHtml,
        iconSize: [140, 40],
        iconAnchor: [70, 20],
      })

      const marker = L.marker(rec.coordinates, { icon: recyclerIcon }).addTo(map)

      // Popup content
      const popupContent = `
        <div style="font-family: inherit; min-width: 180px; padding: 2px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            ${rec.facilityName}
          </div>
          <div style="font-size: 11px; color: #059669; font-weight: 700; margin-bottom: 4px;">
            🟢 ${rec.verificationStatus === 'verified' ? 'Authorized Verified ✓' : 'Under Audit'}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 ${rec.distanceKm} km away · ${rec.pickupAvailable ? '🚚 Pickup available' : 'Drop at center'}
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
            PCB Rate: ₹${pcbRate}/kg
          </div>
          <button 
            id="popup-btn-${rec.id}" 
            style="width: 100%; background: #059669; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer;"
          >
            View Recycler →
          </button>
        </div>
      `

      marker.bindPopup(popupContent)
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${rec.id}`)
        if (btn) {
          btn.onclick = () => onSelectRecycler(rec.id)
        }
      })

      marker.on('click', () => {
        onSelectRecycler(rec.id)
      })

      markersRef.current[rec.id] = marker
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [recyclers, userLocation])

  // Center on selected recycler when changed
  useEffect(() => {
    if (selectedRecyclerId && mapInstanceRef.current) {
      const selected = recyclers.find((r) => r.id === selectedRecyclerId)
      if (selected) {
        mapInstanceRef.current.panTo(selected.coordinates, { animate: true })
        const marker = markersRef.current[selectedRecyclerId]
        if (marker) {
          marker.openPopup()
        }
      }
    }
  }, [selectedRecyclerId, recyclers])

  return (
    <div className="relative w-full h-[60vh] min-h-[380px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-sm flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Sangli Recycler Pins ({recyclers.length})</span>
      </div>
    </div>
  )
}
