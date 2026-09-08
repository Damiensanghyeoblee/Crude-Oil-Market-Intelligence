import React, { useState, useEffect } from 'react';
import { DailyMarketReport, ProductMarket, SourceItem } from './types';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { PriceTrendChart } from './components/PriceTrendChart';
import { ProductCard } from './components/ProductCard';
import { DetailModal } from './components/DetailModal';
import { UploadModal } from './components/UploadModal';
import { Search, SlidersHorizontal, Layers, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function App() {
  const [reportData, setReportData] = useState<DailyMarketReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductMarket | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [uploadedReports, setUploadedReports] = useState<string[]>([
    "[제목: 2026-09-07 한국석유화학협회 주간 동향] NCC 가동률 조정 및 납사 수급 안정화 추세 지속."
  ]);

  const fetchMarketData = async (reportsToInclude: string[] = uploadedReports) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/market-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadedTexts: reportsToInclude }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch market data');
      }
      const data = await res.json();
      setReportData(data);
    } catch (err: any) {
      console.error(err);
      setError('시황 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleAddReport = (text: string) => {
    setUploadedReports([...uploadedReports, text]);
  };

  const handleRemoveReport = (index: number) => {
    const updated = uploadedReports.filter((_, i) => i !== index);
    setUploadedReports(updated);
  };

  const handleApplyReports = () => {
    fetchMarketData(uploadedReports);
  };

  // Filter products
  const filteredProducts = reportData?.products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentDate={reportData?.date || new Date().toISOString().split('T')[0]}
        onOpenUpload={() => setIsUploadOpen(true)}
        onRefresh={() => fetchMarketData(uploadedReports)}
        isLoading={isLoading}
        uploadedCount={uploadedReports.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Initial State or Content */}
        {isLoading && !reportData ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-600">
              실시간 유가 및 석유화학 시황을 분석하고 취합하는 중입니다...
            </p>
          </div>
        ) : reportData ? (
          <>
            {/* Executive Summary */}
            <ExecutiveSummary
              summary={reportData.executiveSummary}
              sources={reportData.executiveSources}
              date={reportData.date}
            />

            {/* 1-Year Price Trend Chart */}
            <PriceTrendChart
              products={reportData.products}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* Controls Bar: Categories & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: '전체 보기' },
                  { id: 'energy', label: '원유 및 연료' },
                  { id: 'upstream', label: '기초유분 (NCC)' },
                  { id: 'derivative', label: '합성수지·중간재' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="제품명 또는 코드 검색 (예: 납사, 에틸렌)..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  주요 품목별 시황 요약 ({filteredProducts.length}개 제품)
                </h2>
                <span className="text-xs text-slate-500">
                  * 각 카드를 클릭하면 상방·하방 요인 및 신뢰할 수 있는 출처를 확인할 수 있습니다.
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-sm">
                  검색 조건과 일치하는 석유화학 제품이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 석유·화학 시황 데일리 인사이트 (Consulting Intelligence Platform). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platts · ICIS · Opinet · 업로드 정보지 교차 검증</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <DetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        uploadedReports={uploadedReports}
        onAddReport={handleAddReport}
        onRemoveReport={handleRemoveReport}
        onApplyReports={handleApplyReports}
        isLoading={isLoading}
      />
    </div>
  );
}
