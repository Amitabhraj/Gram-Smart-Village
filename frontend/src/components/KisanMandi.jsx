import React from 'react';
import { 
  TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, 
  Phone, Warehouse, ShieldAlert, Sparkles, Sprout 
} from 'lucide-react';

export default function KisanMandi({ mandiRates, fertilizers, lang }) {
  const isHi = lang === 'hi';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold mb-2">
            <span>🌾 🚜 📈</span>
            <span>{isHi ? 'कृषि सेतु एवं मंडी भाव' : 'Krishi Setu: Kisan Advisory'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'मंडी के ताजा भाव एवं सहकारी खाद का लाइव स्टॉक' : 'Today Mandi Prices & Cooperative Fertilizer Stock'}
          </h2>
          <p className="text-amber-100 text-sm max-w-xl mt-1">
            {isHi 
              ? 'बिचौलियों और मुनाफाखोरों से बचें। समर्थन मूल्य (MSP) की तुलना में अपनी उपज का सही दाम जानें और खाद उपलब्धता घर बैठे देखें।' 
              : 'Direct APMC Mandi modal rates vs MSP comparison. Check PACS warehouse Urea & DAP bag availability live before travelling.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-center">
          <span className="text-[11px] text-amber-200 font-medium block">
            {isHi ? 'नोडल मंडी' : 'APMC Mandi'}
          </span>
          <span className="text-base font-extrabold text-white">
            {isHi ? 'कृषि उपज मंडी सोहागपुर' : 'Krishi Mandi Sohagpur'}
          </span>
          <span className="text-[10px] text-amber-300 block mt-1">
            {isHi ? 'दैनिक ई-नाम पोर्टल से सिंक' : 'Daily e-NAM Synced'}
          </span>
        </div>
      </div>

      {/* PACS Cooperative Fertilizer Stock Section (Vital Indian Village Problem Solved) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/20 shadow-md">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-amber-600" />
              <span>{isHi ? 'ग्राम सेवा सहकारी समिति (PACS) खाद उपलब्धता' : 'Local Cooperative Society Fertilizer Inventory'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isHi 
                ? 'किसान बंधु घर से निकलने से पहले यूरिया, डीएपी का उपलब्ध स्टॉक जांच लें' 
                : 'Live stock at village PACS warehouse — check before lining up'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
            <Phone className="w-3.5 h-3.5" />
            <span>{isHi ? 'सोसायटी प्रभारी' : 'PACS Incharge'}: 9425012345</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fertilizers.map((f, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 hover:border-amber-400 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                    {f.category}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    f.bags_available > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {f.bags_available > 50 ? (isHi ? 'उपलब्ध' : 'In Stock') : (isHi ? 'सीमित' : 'Low Stock')}
                  </span>
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm mb-1 leading-snug">
                  {f.fertilizer_name}
                </h4>
                <p className="text-xs text-stone-500">
                  {f.center_name}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block">{isHi ? 'शासकीय नियंत्रित मूल्य' : 'Govt Subsidized Rate'}</span>
                  <span className="text-lg font-black text-emerald-800">₹{f.price_per_bag}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-stone-900 block">
                    {f.bags_available} {isHi ? 'बोरी' : 'Bags'}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {isHi ? 'शेष स्टॉक' : 'Remaining'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APMC Mandi Rates Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{isHi ? 'आज के मंडी भाव एवं समर्थन मूल्य (MSP) तुलना' : "Today's Mandi Prices & MSP Benchmark"}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isHi ? 'क्विंटल (100 kg) के आधार पर ताजा थोक भाव' : 'Rates per Quintal (100 kg) verified from APMC register'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border-y border-stone-200 text-stone-600 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-4">{isHi ? 'फसल का नाम' : 'Crop / Commodity'}</th>
                <th className="py-3 px-4">{isHi ? 'मॉडल भाव (औसत)' : 'Modal Price'}</th>
                <th className="py-3 px-4">{isHi ? 'न्यूनतम - अधिकतम' : 'Min - Max Range'}</th>
                <th className="py-3 px-4">{isHi ? 'सरकारी MSP' : 'Govt MSP'}</th>
                <th className="py-3 px-4">{isHi ? 'बाजार रुझान' : 'Trend'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mandiRates.map((crop, idx) => (
                <tr key={idx} className="hover:bg-amber-50/30 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 block">
                      {isHi ? crop.crop_name_hindi : crop.crop_name}
                    </span>
                    <span className="text-xs text-stone-400 font-normal">
                      {crop.market_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-stone-900 text-base">
                    ₹{crop.modal_price}
                    <span className="text-[11px] font-normal text-stone-500 ml-1">/Qtl</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-stone-600">
                    ₹{crop.min_price} - ₹{crop.max_price}
                  </td>
                  <td className="py-3.5 px-4">
                    {crop.msp_price > 0 ? (
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                        ₹{crop.msp_price}
                      </span>
                    ) : (
                      <span className="text-stone-400 text-xs italic">NA</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      crop.trend === 'UP' ? 'bg-emerald-100 text-emerald-800' :
                      crop.trend === 'DOWN' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {crop.trend === 'UP' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                      {crop.trend === 'DOWN' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                      {crop.trend === 'STABLE' && <Minus className="w-3.5 h-3.5 text-stone-500" />}
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
