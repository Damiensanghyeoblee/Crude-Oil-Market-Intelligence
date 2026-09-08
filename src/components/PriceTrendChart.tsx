import React, { useState } from 'react';
import { ProductMarket } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info, RotateCcw } from 'lucide-react';

interface PriceTrendChartProps {
  products: ProductMarket[];
  onSelectProduct: (product: ProductMarket) => void;
}

// 1-year monthly mock historical price dataset for the key products
const historicalData = [
  { month: '25.10', 두바이유: 76.2, 휘발유: 85.0, 납사: 640, 에틸렌: 830, 프로필렌: 790, BTX: 860, HDPE: 960 },
  { month: '25.11', 두바이유: 74.5, 휘발유: 83.5, 납사: 635, 에틸렌: 820, 프로필렌: 785, BTX: 850, HDPE: 955 },
  { month: '25.12', 두바이유: 73.0, 휘발유: 82.0, 납사: 625, 에틸렌: 810, 프로필렌: 775, BTX: 840, HDPE: 945 },
  { month: '26.01', 두바이유: 75.8, 휘발유: 84.2, 납사: 645, 에틸렌: 825, 프로필렌: 790, BTX: 855, HDPE: 965 },
  { month: '26.02', 두바이유: 77.2, 휘발유: 86.0, 납사: 660, 에틸렌: 840, 프로필렌: 805, BTX: 870, HDPE: 980 },
  { month: '26.03', 두바이유: 81.5, 휘발유: 90.5, 납사: 690, 에틸렌: 870, 프로필렌: 830, BTX: 910, HDPE: 1010 },
  { month: '26.04', 두바이유: 83.0, 휘발유: 92.0, 납사: 705, 에틸렌: 885, 프로필렌: 845, BTX: 925, HDPE: 1025 },
  { month: '26.05', 두바이유: 80.4, 휘발유: 89.8, 납사: 685, 에틸렌: 865, 프로필렌: 825, BTX: 900, HDPE: 1005 },
  { month: '26.06', 두바이유: 78.9, 휘발유: 88.5, 납사: 675, 에틸렌: 855, 프로필렌: 815, BTX: 890, HDPE: 995 },
  { month: '26.07', 두바이유: 77.5, 휘발유: 87.2, 납사: 665, 에틸렌: 845, 프로필렌: 805, BTX: 880, HDPE: 985 },
  { month: '26.08', 두바이유: 77.8, 휘발유: 87.5, 납사: 670, 에틸렌: 848, 프로필렌: 808, BTX: 885, HDPE: 988 },
  { month: '26.09', 두바이유: 78.45, 휘발유: 88.2, 납사: 672.5, 에틸렌: 850, 프로필렌: 810, BTX: 895, HDPE: 990 },
];

const productKeyMap: Record<string, string> = {
  'dubai-oil': '두바이유',
  'gasoline': '휘발유',
  'naphtha': '납사',
  'ethylene': '에틸렌',
  'propylene': '프로필렌',
  'btx': 'BTX',
  'pe-pp': 'HDPE'
};

const productColors: Record<string, string> = {
  '두바이유': '#2563eb', // blue-600
  '휘발유': '#0ea5e9', // sky-500
  '납사': '#f59e0b', // amber-500
  '에틸렌': '#10b981', // emerald-500
  '프로필렌': '#8b5cf6', // violet-500
  'BTX': '#ec4899', // pink-500
  'HDPE': '#64748b' // slate-500
};

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ products, onSelectProduct }) => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const handleLineClick = (dataKey: string) => {
    const found = products.find(p => productKeyMap[p.id] === dataKey);
    if (found) {
      setActiveProductId(found.id === activeProductId ? null : found.id);
    }
  };

  const activeKeyName = activeProductId ? productKeyMap[activeProductId] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              최근 1년 주요 석유·화학 품목 가격 추이 (1-Year Price Trend)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            범례 또는 그래프 선을 클릭하면 해당 품목이 강조되고 다른 품목은 흐리게 표시됩니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeProductId && (
            <button
              onClick={() => setActiveProductId(null)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 보기 (초기화)</span>
            </button>
          )}
          <span className="text-xs font-medium text-slate-600 bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded border border-indigo-100">
            {activeKeyName ? `선택됨: ${activeKeyName}` : '전체 품목 동시 비교 중'}
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              onClick={(e: any) => {
                const clickedName = e.value;
                const matchProd = products.find(p => productKeyMap[p.id] === clickedName);
                if (matchProd) {
                  setActiveProductId(matchProd.id === activeProductId ? null : matchProd.id);
                }
              }}
              formatter={(value) => {
                const isDimmed = activeKeyName && activeKeyName !== value;
                return (
                  <span
                    className={`cursor-pointer font-medium text-xs transition-opacity inline-block py-1 px-1.5 ${
                      isDimmed ? 'opacity-30' : 'opacity-100 font-bold text-slate-900 bg-slate-100 rounded'
                    }`}
                  >
                    {value}
                  </span>
                );
              }}
            />
            {Object.keys(productColors).map((keyName) => {
              const isDimmed = activeKeyName && activeKeyName !== keyName;
              const isHighlighted = activeKeyName === keyName;

              return (
                <Line
                  key={keyName}
                  type="monotone"
                  dataKey={keyName}
                  stroke={productColors[keyName]}
                  strokeWidth={isHighlighted ? 3 : isDimmed ? 1 : 2}
                  strokeOpacity={isDimmed ? 0.2 : 1}
                  dot={{ r: isHighlighted ? 5 : 3, fill: productColors[keyName] }}
                  activeDot={{ r: 7 }}
                  onClick={() => handleLineClick(keyName)}
                  cursor="pointer"
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activeProductId && (
        <div className="mt-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              현재 <b>{activeKeyName}</b> 품목이 집중 조명되어 있습니다. 아래 카드 목록에서도 해당 품목을 자세히 확인하세요.
            </span>
          </div>
          <button
            onClick={() => {
              const prod = products.find(p => p.id === activeProductId);
              if (prod) onSelectProduct(prod);
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
          >
            상세 요인 보기 →
          </button>
        </div>
      )}
    </div>
  );
};
