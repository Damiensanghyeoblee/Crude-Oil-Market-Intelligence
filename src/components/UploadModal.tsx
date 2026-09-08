import React, { useState } from 'react';
import { X, Upload, FileText, Trash2, Plus, CheckCircle2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedReports: string[];
  onAddReport: (text: string) => void;
  onRemoveReport: (index: number) => void;
  onApplyReports: () => void;
  isLoading: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  uploadedReports,
  onAddReport,
  onRemoveReport,
  onApplyReports,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [inputTitle, setInputTitle] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const title = inputTitle.trim() || `업로드 정보지_${new Date().toLocaleDateString()}`;
    const formatted = `[제목: ${title}] \n${inputText.trim()}`;
    onAddReport(formatted);
    setInputText('');
    setInputTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold tracking-tight">정보지 및 보고서 관리 (Data Room)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <p className="font-semibold text-slate-800 mb-1">💡 정보지 활용 안내</p>
            업로드하거나 붙여넣은 일일 석유화학 정보지, 시황 리포트(PDF/텍스트) 내용은 AI 분석 엔진에 실시간 반영되어 유가 및 화학 제품 상·하방 요인에 즉시 취합됩니다.
          </div>

          {/* Add Form */}
          <form onSubmit={handleAdd} className="space-y-4 border border-slate-200 p-4 rounded-lg bg-white">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              새로운 정보지 내용 입력 또는 붙여넣기
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">정보지 제목 / 발행처</label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="예: 2026-09-07 플래츠 아시아 석유화학 일일 브리핑"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">본문 내용 (텍스트 또는 요약 발췌)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                placeholder="보고서의 핵심 내용이나 시황 코멘트를 붙여넣어 주세요..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>정보지 추가하기</span>
              </button>
            </div>
          </form>

          {/* Uploaded List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              현재 등록된 정보지 리스트 ({uploadedReports.length}건)
            </h3>
            {uploadedReports.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                등록된 정보지가 없습니다. 위의 입력창에 리포트 내용을 추가해 보세요.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadedReports.map((rep, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between bg-slate-50 border border-slate-200 p-3 rounded text-xs"
                  >
                    <div className="space-y-1 pr-4">
                      <span className="font-semibold text-slate-800 block">정보지 #{idx + 1}</span>
                      <p className="text-slate-600 line-clamp-2">{rep}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveReport(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {uploadedReports.length > 0 ? '반영 버튼을 누르면 AI 분석에 즉시 반영됩니다.' : '기본 인터넷 정보만 반영됩니다.'}
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyReports();
                onClose();
              }}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>정보지 반영 및 시황 재정리</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
