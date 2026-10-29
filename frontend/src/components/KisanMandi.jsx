import React from 'react';
import { TrendingUp, TrendingDown, Minus, Warehouse, Phone, ShieldCheck, Sprout } from 'lucide-react';

export default function KisanMandi({ mandiRates, fertilizers }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider mb-2 inline-block">
            Krishi Setu · Agricultural Advisory
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Daily APMC Mandi Rates & Cooperative Fertilizer Inventory
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
            Eliminate middleman price exploitation with real-time modal rates vs Government Minimum Support Price (MSP) benchmarks, and check PACS warehouse fertilizer availability before transit.
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center shrink-0">
          <span className="text-[11px] text-slate-400 font-medium block">
            Nodal APMC Market
          </span>
          <span className="text-base font-extrabold text-white">
            Krishi Upaj Mandi Samiti Pipariya
          </span>
          <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
            e-NAM Synchronized Daily
          </span>
        </div>
      </div>

      {/* PACS Fertilizer Inventory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-emerald-700" />
              <span>Village Cooperative Society (PACS) Fertilizer Stock</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live stock buffer at village PACS godown — check availability before traveling
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>Store Incharge: +91 9425012345</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fertilizers.map((f, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 uppercase tracking-wide font-mono">
                    {f.category}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    f.bags_available > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {f.bags_available > 50 ? 'In Stock' : 'Low Buffer'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {f.fertilizer_name}
                </h4>
                <p className="text-xs text-slate-500">
                  {f.center_name}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Govt Controlled Rate</span>
                  <span className="text-lg font-black text-slate-900 font-mono">₹{f.price_per_bag}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block font-mono">
                    {f.bags_available} Bags
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Warehouse Balance
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APMC Mandi Rates Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Daily Mandi Prices & Minimum Support Price (MSP) Comparison
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Wholesale prices per Quintal (100 kg) recorded from official Mandi Samiti trade logs
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Commodity / Variety</th>
                <th className="py-3 px-4">Modal Price (Average)</th>
                <th className="py-3 px-4">Min - Max Price Range</th>
                <th className="py-3 px-4">Official MSP</th>
                <th className="py-3 px-4">Trade Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandiRates.map((crop, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {crop.crop_name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {crop.market_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 font-mono text-base">
                    ₹{crop.modal_price}
                    <span className="text-xs font-normal text-slate-500 ml-1">/Qtl</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                    ₹{crop.min_price} - ₹{crop.max_price}
                  </td>
                  <td className="py-3.5 px-4">
                    {crop.msp_price > 0 ? (
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200 font-mono">
                        ₹{crop.msp_price}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Market Driven</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                      crop.trend === 'UP' ? 'bg-emerald-100 text-emerald-800' :
                      crop.trend === 'DOWN' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {crop.trend === 'UP' && <TrendingUp className="w-3.5 h-3.5" />}
                      {crop.trend === 'DOWN' && <TrendingDown className="w-3.5 h-3.5" />}
                      {crop.trend === 'STABLE' && <Minus className="w-3.5 h-3.5" />}
                      <span>{crop.trend}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
