import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Truck, MapPin, Phone, CheckCircle, Clock, Calendar, ArrowRight, User } from 'lucide-react'

export const PickupRequests: React.FC = () => {
  const { lots } = useApp()

  const [pickups, setPickups] = useState([
    {
      id: 'PK-901',
      lotId: 'KC-2026-000125',
      material: 'Copper Cables (25 kg)',
      collector: 'Ramesh Shinde',
      phone: '+91 98231 44099',
      location: 'Market Yard Depot, Sangli',
      scheduledTime: 'Today, 02:30 PM',
      driver: 'Mahesh (MH-10-AT-4412)',
      status: 'En Route',
    },
    {
      id: 'PK-902',
      lotId: 'KC-2026-000126',
      material: 'Inverter Batteries (18 kg)',
      collector: 'Santosh Powar',
      phone: '+91 94220 98112',
      location: 'Ganpati Peth, Sangli',
      scheduledTime: 'Today, 04:00 PM',
      driver: 'Vinod (MH-10-CR-1109)',
      status: 'Scheduled',
    },
    {
      id: 'PK-903',
      lotId: 'KC-2026-000124',
      material: 'PCB Motherboards (10 kg)',
      collector: 'Ramesh Shinde',
      phone: '+91 98231 44099',
      location: 'Sangli MIDC Area',
      scheduledTime: 'Yesterday, 11:00 AM',
      driver: 'Mahesh (MH-10-AT-4412)',
      status: 'Completed',
    },
  ])

  const handleDispatch = (id: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'En Route' } : p))
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Doorstep Pickup Fleet & Logistics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage collection vehicle dispatch, routes, and arrival ETAs for scrap collectors.
        </p>
      </div>

      {/* Pickups Table for Desktop / Tablet */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Pickup Ref</th>
                <th className="py-3.5 px-4">Lot & Material</th>
                <th className="py-3.5 px-4">Collector Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Scheduled Slot</th>
                <th className="py-3.5 px-4">Assigned Vehicle</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {pickups.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {p.id}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {p.material}
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Ref: {p.lotId}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{p.collector}</span>
                    </div>
                    <a href={`tel:${p.phone}`} className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {p.phone}
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[140px]">{p.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {p.scheduledTime}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      {p.driver}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'En Route'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {p.status === 'Scheduled' && (
                      <button
                        onClick={() => handleDispatch(p.id)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-all min-h-[38px]"
                      >
                        Dispatch Driver
                      </button>
                    )}
                    {p.status === 'En Route' && (
                      <span className="text-xs font-semibold text-blue-700">
                        Tracking Active
                      </span>
                    )}
                    {p.status === 'Completed' && (
                      <span className="text-xs font-semibold text-emerald-700">
                        Delivered ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Stack (md:hidden) */}
      <div className="space-y-3 md:hidden">
        {pickups.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                  {p.id}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                  Lot: {p.lotId}
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  p.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : p.status === 'En Route'
                    ? 'bg-blue-100 text-blue-800 animate-pulse'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {p.status}
              </span>
            </div>

            <div>
              <p className="font-bold text-slate-900 text-sm">{p.material}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between sm:justify-start gap-1.5">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {p.collector}
                </span>
                <a
                  href={`tel:${p.phone}`}
                  className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 active:bg-emerald-100"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  Call
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{p.location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{p.scheduledTime}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{p.driver}</span>
              </div>
            </div>

            <div className="pt-1">
              {p.status === 'Scheduled' && (
                <button
                  onClick={() => handleDispatch(p.id)}
                  className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-2xs active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Dispatch Driver
                </button>
              )}
              {p.status === 'En Route' && (
                <div className="w-full min-h-[40px] bg-blue-50 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-blue-200">
                  <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  Tracking Active (En Route)
                </div>
              )}
              {p.status === 'Completed' && (
                <div className="w-full min-h-[40px] bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Delivered Successfully
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
