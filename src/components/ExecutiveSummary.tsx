import React from 'react';
import { SourceItem } from '../types';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: string[];
  sources: SourceItem[];
  date: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  sources,
  date,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
            오늘의 오버뷰 (Executive Briefing)
          </h2>
        </div>
        <div className="text-xs text-slate-500 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>인터넷 정보 및 업로드된 정보지 종합 분석</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {summary.map((para, idx) => (
          <p key={idx} className="text-slate-700 text-sm md:text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-700">신뢰할 수 있는 출처 ({sources.length}건):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((src) => (
            <span
              key={src.id}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="font-semibold text-slate-800">[{src.publisher}]</span>
              <span>{src.title}</span>
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 ml-0.5"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
