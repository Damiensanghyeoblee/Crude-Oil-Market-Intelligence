import React from 'react';
import { TrendingUp, FileText, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  currentDate: string;
  onOpenUpload: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  uploadedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onOpenUpload,
  onRefresh,
  isLoading,
  uploadedCount,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Daily Petrochemical & Energy Intelligence
              </span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] rounded font-medium">
                Consulting Edition
              </span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              석유·화학 시황 데일리 인사이트
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <span>기준일자:</span>
            <span className="font-medium text-slate-200">{currentDate}</span>
          </div>

          <button
            onClick={onOpenUpload}
            className="relative inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">정보지/보고서 관리</span>
            <span className="sm:hidden">보고서</span>
            {uploadedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {uploadedCount}
              </span>
            )}
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">시황 갱신</span>
          </button>
        </div>
      </div>
    </header>
  );
};
