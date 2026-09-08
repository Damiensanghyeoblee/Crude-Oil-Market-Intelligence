import React from 'react';
import { ProductMarket } from '../types';
import { TrendingUp, TrendingDown, Minus, ChevronRight, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: ProductMarket;
  onSelectProduct: (product: ProductMarket) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const isUp = product.change.startsWith('+');
  const isDown = product.change.startsWith('-');

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-slate-200/70 text-slate-700 rounded mb-1.5">
              {product.categoryName}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-slate-900">{product.price}</div>
            <div
              className={`inline-flex items-center space-x-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${
                isUp
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : isDown
                  ? 'text-rose-700 bg-rose-50 border border-rose-200'
                  : 'text-slate-700 bg-slate-100 border border-slate-200'
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : isDown ? (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              ) : (
                <Minus className="w-3 h-3 mr-0.5" />
              )}
              <span>{product.change}</span>
            </div>
          </div>
        </div>

        {/* Card Body - 1~3 sentences summary */}
        <div className="p-5 space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            주요 시황 요약 (Market Summary)
          </div>
          <div className="space-y-2">
            {product.summary.map((sentence, idx) => (
              <p key={idx} className="text-slate-700 text-sm leading-relaxed">
                {sentence}
              </p>
            ))}
          </div>

          {/* Sources preview */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1 truncate max-w-[240px]">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">
                출처: {product.summarySources.map(s => s.publisher).join(', ')}
              </span>
            </div>
            <span className="text-slate-400 text-[11px] shrink-0">{product.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Card Footer - Action trigger */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-600 font-medium">
          상방·하방 요인 상세 분석
        </span>
        <button
          onClick={() => onSelectProduct(product)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
        >
          <span>요인 및 출처 보기</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
