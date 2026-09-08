export interface SourceItem {
  id: string;
  title: string;
  publisher: string; // e.g., 'Platts', 'ICIS', '한국석유공사(opinet)', '업로드 정보지: 2026-09-07_석유화학일보.pdf'
  url?: string;
  type: 'internet' | 'uploaded_report' | 'official_stats';
  date: string;
}

export interface FactorItem {
  text: string; // 1-3 sentences
  sources: SourceItem[];
}

export interface ProductMarket {
  id: string;
  category: 'energy' | 'upstream' | 'derivative';
  categoryName: string; // e.g., '원유 및 연료', '기초유분', '합성수지·중간재'
  name: string; // e.g., '두바이유 (Dubai Crude)', '휘발유 (Gasoline 92RON)', '납사 (Naphtha)'
  code: string; // e.g., 'DUBAI', 'GASOLINE', 'NAPHTHA'
  price: string; // e.g., '$78.45 / bbl' or '$680 / MT'
  change: string; // e.g., '+1.2%' or '-0.5%'
  isPositive: boolean;
  summary: string[]; // 1-3 sentences
  summarySources: SourceItem[];
  upwardFactors: FactorItem[]; // 1-3 sentences each
  downwardFactors: FactorItem[]; // 1-3 sentences each
  lastUpdated: string;
}

export interface DailyMarketReport {
  date: string;
  executiveSummary: string[]; // 1-3 sentences
  executiveSources: SourceItem[];
  products: ProductMarket[];
  uploadedReportsCount: number;
}
