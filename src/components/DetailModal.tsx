import React from 'react';
import { ProductMarket, SourceItem } from '../types';
import { X, TrendingUp, TrendingDown, ShieldCheck, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface DetailModalProps {
  product: ProductMarket | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-slate-800 text-indigo-300 rounded border border-slate-700">
                {product.categoryName}
              </span>
              <span className="text-xs text-slate-400">코드: {product.code}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{product.name} 상세 시황 및 요인 분석</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">현재 시세:</span>
            <span className="text-lg font-bold text-slate-900">{product.price}</span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                product.change.startsWith('+')
                  ? 'bg-emerald-100 text-emerald-800'
                  : product.change.startsWith('-')
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {product.change}
            </span>
          </div>
          <div className="text-xs text-slate-500">기준일: {product.lastUpdated}</div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              주요 시황 요약 (Market Overview)
            </h3>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2">
              {product.summary.map((s, i) => (
                <p key={i} className="text-slate-700 text-sm md:text-base leading-relaxed">
                  {s}
                </p>
              ))}
            </div>
          </div>

          {/* Upward & Downward Factors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upward Factors */}
            <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                    상방 요인 (Upward Factors)
                  </h4>
                </div>
                <div className="space-y-4">
                  {product.upwardFactors.map((factor, idx) => (
                    <div key={idx} className="space-y-1.5 text-sm">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        • {factor.text}
                      </p>
                      <div className="pl-3 space-y-1">
                        {factor.sources.map((src) => (
                          <div key={src.id} className="text-xs text-slate-500 flex items-center space-x-1">
                            <span className="font-semibold text-emerald-800">[{src.publisher}]</span>
                            <span className="truncate">{src.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Downward Factors */}
            <div className="bg-rose-50/40 border border-rose-200/70 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-7 h-7 rounded bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wide">
                    하방 요인 (Downward Factors)
                  </h4>
                </div>
                <div className="space-y-4">
                  {product.downwardFactors.map((factor, idx) => (
                    <div key={idx} className="space-y-1.5 text-sm">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        • {factor.text}
                      </p>
                      <div className="pl-3 space-y-1">
                        {factor.sources.map((src) => (
                          <div key={src.id} className="text-xs text-slate-500 flex items-center space-x-1">
                            <span className="font-semibold text-rose-800">[{src.publisher}]</span>
                            <span className="truncate">{src.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* All Verified Sources List */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>신뢰할 수 있는 출처 및 정보지 목록 (Verified Sources)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.summarySources.concat(
                product.upwardFactors.flatMap(f => f.sources),
                product.downwardFactors.flatMap(f => f.sources)
              ).map((src, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center space-x-1">
                      <span>[{src.publisher}]</span>
                      {src.type === 'uploaded_report' && (
                        <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[9px] rounded font-medium">
                          업로드 정보지
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 truncate max-w-[280px]">{src.title}</div>
                  </div>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 p-1 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
