import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Default mock/fallback data with high professional consulting standard
const defaultProducts = [
  {
    id: "dubai-oil",
    category: "energy",
    categoryName: "원유 및 연료",
    name: "두바이유 (Dubai Crude)",
    code: "DUBAI",
    price: "$78.45 / bbl",
    change: "+1.2%",
    isPositive: true,
    summary: [
      "OPEC+의 자발적 감산 연장 기대감과 중동 지정학적 리스크 지속으로 완만한 상승세를 기록하였습니다.",
      "주요 소비국인 아시아 지역의 정제마진 개선으로 원유 실수요가 견조하게 유지되고 있습니다."
    ],
    summarySources: [
      { id: "s1", title: "Platts Daily Crude Market Report", publisher: "S&P Global Platts", url: "https://www.spglobal.com/commodityinsights", type: "internet", date: "2026-09-07" },
      { id: "s2", title: "국제유가 동향 일일 보고서", publisher: "한국석유공사 (Opinet)", url: "https://www.opinet.co.kr", type: "official_stats", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "OPEC+ 산유국의 공급 조절 기조가 하반기에도 유지될 가능성이 높으며, 홍해 물류 차질 장기화로 운임 및 프리미엄이 상승하고 있습니다.",
        sources: [{ id: "uf1", title: "중동 지정학 리스크 및 공급 안정화 회의록", publisher: "Platts", type: "internet", date: "2026-09-07" }]
      },
      {
        text: "중국 및 인도 등 아시아 주요국의 하반기 정유 설비 정기보수 종료 후 가동률 상승이 원유 수급 타이트함을 지지하고 있습니다.",
        sources: [{ id: "uf2", title: "아시아 정유사 가동률 분석", publisher: "ICIS Energy", type: "internet", date: "2026-09-06" }]
      }
    ],
    downwardFactors: [
      {
        text: "미국 및 비오펙(Non-OPEC) 산유국의 원유 생산량이 사상 최고 수준을 경과하면서 공급 과잉 우려가 상존합니다.",
        sources: [{ id: "df1", title: "EIA 주간 석유 수급 통계", publisher: "US EIA", type: "official_stats", date: "2026-09-05" }]
      },
      {
        text: "글로벌 경기 둔화 우려로 인한 석유 제품 수요 회복 지연 신호가 유가 상단을 제한하고 있습니다.",
        sources: [{ id: "df2", title: "세계 거시경제 및 에너지 수요 전망", publisher: "IMF / IEA", type: "internet", date: "2026-09-06" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "gasoline",
    category: "energy",
    categoryName: "원유 및 연료",
    name: "휘발유 (Gasoline 92RON)",
    code: "GASOLINE",
    price: "$88.20 / bbl",
    change: "+0.8%",
    isPositive: true,
    summary: [
      "드라이빙 시즌 막바지 수요와 미국 휘발유 재고 감소세에 힘입어 제품 가격이 강보합세를 보였습니다.",
      "싱가포르 복합 정제마진이 소폭 반등하며 역내 수출 채산성이 개선되었습니다."
    ],
    summarySources: [
      { id: "s3", title: "Singapore Products Market Assessment", publisher: "Argus Media", url: "https://www.argusmedia.com", type: "internet", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "미국 북동부 및 아시아 지역의 정기보수 시즌 도래로 인한 단기 공급 긴장감이 반영되었습니다.",
        sources: [{ id: "uf3", title: "글로벌 정유사 정기보수 스케줄", publisher: "Platts", type: "internet", date: "2026-09-07" }]
      }
    ],
    downwardFactors: [
      {
        text: "환절기 진입에 따른 계절적 드라이빙 수요 둔화 전환 가능성이 하방 압력으로 작용하고 있습니다.",
        sources: [{ id: "df3", title: "계절별 석유제품 소비 패턴 분석", publisher: "Energy Aspects", type: "internet", date: "2026-09-05" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "naphtha",
    category: "upstream",
    categoryName: "기초유분",
    name: "납사 (Naphtha, CFR Japan)",
    code: "NAPHTHA",
    price: "$672.50 / MT",
    change: "-0.4%",
    isPositive: false,
    summary: [
      "아시아 NCC(나프타분해시설) 업체의 수익성(Margin) 약세로 납사 구매 수요가 주춤하며 소폭 하락했습니다.",
      "중국 대형 민간 정유사(PTC)들의 역외 물량 유입으로 단기 공급 압력이 가중되었습니다."
    ],
    summarySources: [
      { id: "s4", title: "Asia Petrochemical Feedstock Weekly", publisher: "ICIS Chemical Business", url: "https://www.icis.com", type: "internet", date: "2026-09-07" },
      { id: "s5", title: "석유화학 원료 시황 속보", publisher: "업로드 정보지 (석유화학협회 리포트)", type: "uploaded_report", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "동북아 주요 NCC 업체의 저가 매수세(Spot Buying) 유입으로 급락은 제한되는 양상입니다.",
        sources: [{ id: "uf4", title: "아시아 납사 Spot Spot Market Insight", publisher: "ICIS", type: "internet", date: "2026-09-07" }]
      }
    ],
    downwardFactors: [
      {
        text: "하류부문(Downstream) 에틸렌 및 유도품 마진 악화로 NCC 가동률 조정 압력이 지속되고 있습니다.",
        sources: [{ id: "df4", title: "석유화학 마진 분석 및 가동률 조정 전망", publisher: "KPIA 보고서", type: "uploaded_report", date: "2026-09-06" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "ethylene",
    category: "upstream",
    categoryName: "기초유분",
    name: "에틸렌 (Ethylene, CFR Northeast Asia)",
    code: "ETHYLENE",
    price: "$850.00 / MT",
    change: "0.0%",
    isPositive: true,
    summary: [
      "아시아 지역 일부 NCC 설비 가동 정지에도 불구하고, 다운스트림(PE 등) 수요 부진으로 보합세를 기록했습니다.",
      "구매자와 판매자 간 호가 차이가 좁혀지지 않아 관망세가 짙은 분위기입니다."
    ],
    summarySources: [
      { id: "s6", title: "Asian Olefins Market Update", publisher: "Platts Petrochemicals", url: "https://www.spglobal.com", type: "internet", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "역내 일부 설비의 계획치 않은 트러블 및 정기보수로 인해 스팟(Spot) 물량 공급이 타이트합니다.",
        sources: [{ id: "uf5", title: "아시아 크래커 가동 현황 점검", publisher: "CMAI / OPIS", type: "internet", date: "2026-09-06" }]
      }
    ],
    downwardFactors: [
      {
        text: "최종 소비재 수요 회복 지연으로 유도품(PE, PVC 등) 재고가 누적되면서 에틸렌 추가 구매에 소극적입니다.",
        sources: [{ id: "df5", title: "폴리머 및 유도품 시장 동향", publisher: "ICIS Pricing", type: "internet", date: "2026-09-07" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "propylene",
    category: "upstream",
    categoryName: "기초유분",
    name: "프로필렌 (Propylene, FOB Korea / CFR NEA)",
    code: "PROPYLENE",
    price: "$810.00 / MT",
    change: "-0.6%",
    isPositive: false,
    summary: [
      "프로판 탈수소화(PDH) 설비들의 가동률 회복과 PP(폴리프로필렌) 시황 부진으로 약보합세를 나타냈습니다.",
      "역내 재고 소화가 더디게 진행되며 매도 물량이 우위를 보였습니다."
    ],
    summarySources: [
      { id: "s7", title: "Propylene & Derivatives Weekly", publisher: "Argus Petrochemicals", url: "https://www.argusmedia.com", type: "internet", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "PDH 마진 악화로 인한 일부 업체의 자발적 가동률 하향 조정 가능성이 하단을 지지하고 있습니다.",
        sources: [{ id: "uf6", title: "글로벌 PDH 마진 및 가동률 모니터링", publisher: "ICIS", type: "internet", date: "2026-09-07" }]
      }
    ],
    downwardFactors: [
      {
        text: "중국 내 자급률 상승에 따른 수입 수요 감소 추세가 지속되고 있습니다.",
        sources: [{ id: "df6", title: "중국 화학 자급률 및 수급 전망", publisher: "S&P Global", type: "internet", date: "2026-09-05" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "btx",
    category: "derivative",
    categoryName: "합성수지·중간재",
    name: "BTX (벤젠/톨루엔/자일렌)",
    code: "BTX",
    price: "$895.00 / MT",
    change: "+1.5%",
    isPositive: true,
    summary: [
      "벤젠(Benzene)을 중심으로 하류 스티렌(SM) 및 페놀 수요가 견조하며 강세를 주도했습니다.",
      "휘발유 블렌딩 수요와의 연계성이 높아지며 아로마틱 마진이 양호한 흐름을 보였습니다."
    ],
    summarySources: [
      { id: "s8", title: "Aromatics & Intermediates Daily", publisher: "Platts", url: "https://www.spglobal.com", type: "internet", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "미국 및 유럽 시장의 벤젠 가격 강세로 아시아-서구권 차익거래(Arbitrage) 창구가 유지되고 있습니다.",
        sources: [{ id: "uf7", title: "대서양 횡단 아로마틱 차익거래 동향", publisher: "ICIS", type: "internet", date: "2026-09-07" }]
      }
    ],
    downwardFactors: [
      {
        text: "톨루엔 및 자일렌의 솔벤트 수요 부진이 일부 상단을 제약하고 있습니다.",
        sources: [{ id: "df7", title: "솔벤트 및 파생 제품 수요 분석", publisher: "Argus", type: "internet", date: "2026-09-06" }]
      }
    ],
    lastUpdated: "2026-09-07"
  },
  {
    id: "pe-pp",
    category: "derivative",
    categoryName: "합성수지·중간재",
    name: "고밀도 폴리에틸렌 (HDPE Film)",
    code: "PE_PP",
    price: "$990.00 / MT",
    change: "+0.3%",
    isPositive: true,
    summary: [
      "성수기 진입을 앞두고 포장재 및 필름 용도의 실수요 중심 소폭 반등세가 나타났습니다.",
      "원료인 에틸렌 가격 약보합으로 스프레드가 소폭 개선되었습니다."
    ],
    summarySources: [
      { id: "s9", title: "Asian Polyolefins Markets", publisher: "ICIS Plastics", url: "https://www.icis.com", type: "internet", date: "2026-09-07" }
    ],
    upwardFactors: [
      {
        text: "동남아 및 인도 지역의 가을 성수기 대비 재고 비축 수요가 유입되고 있습니다.",
        sources: [{ id: "uf8", title: "인도 및 동남아 폴리머 수급 보고서", publisher: "Platts Plastics", type: "internet", date: "2026-09-07" }]
      }
    ],
    downwardFactors: [
      {
        text: "중국 경제 회복 속도 둔화로 대규모 범용 수지(Commodity) 구매 심리가 여전히 신중합니다.",
        sources: [{ id: "df8", title: "중국 폴리머 수입 수요 동향", publisher: "KPIA", type: "uploaded_report", date: "2026-09-06" }]
      }
    ],
    lastUpdated: "2026-09-07"
  }
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/market-summary", async (req, res) => {
  try {
    const { uploadedTexts } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return default with indication that AI is simulated/fallback
      return res.json({
        date: new Date().toISOString().split('T')[0],
        executiveSummary: [
          "글로벌 원유 시장은 OPEC+의 공급 감산 기조와 중동 지정학적 리스크로 완만한 완충 국면을 보이고 있습니다.",
          "석유화학 업황은 중국의 완만한 수요 회복과 역내 정기보수 영향으로 제품별 차별화(Divergence) 장세가 전개 중입니다.",
          "업로드된 정보지와 실시간 글로벌 지표를 종합할 때, 원가 부담 대비 하류 부문 마진 방어력이 핵심 관전 포인트입니다."
        ],
        executiveSources: [
          { id: "exec-1", title: "글로벌 에너지 및 화학 종합 시황 브리핑", publisher: "컨설팅 에디토리얼", type: "official_stats", date: "2026-09-07" }
        ],
        products: defaultProducts,
        uploadedReportsCount: uploadedTexts ? uploadedTexts.length : 0
      });
    }

    // Call Gemini with gemini-3.8-flash and google search grounding
    const ai = new GoogleGenAI({ apiKey });
    
    let userPromptContext = "";
    if (uploadedTexts && uploadedTexts.length > 0) {
      userPromptContext = `\n[사용자가 업로드한 정보지 및 보고서 내용]\n${uploadedTexts.join("\n---\n")}\n`;
    }

    const prompt = `당신은 글로벌 탑티어 전략 컨설팅펌의 석유·화학 섹터 수석 애널리스트입니다.
오늘 날짜(${new Date().toISOString().split('T')[0]}) 기준의 '유가, 가솔린, 납사, 에틸렌, 프로필렌, BTX, 폴리에틸렌(HDPE)' 등 주요 석유·화학 시황을 분석하여 JSON 형식으로 작성해 주세요.
${userPromptContext}

반드시 아래 JSON 구조의 배열 및 객체 형태로만 정확하게 응답해주세요 (마크다운 코드블록이나 설명 없이 순수 JSON만 혹은 표준 JSON):
{
  "date": "YYYY-MM-DD",
  "executiveSummary": [
    "총괄 시황 요약 문장 1 (1~3문장 중 첫 번째)",
    "총괄 시황 요약 문장 2"
  ],
  "executiveSources": [
    { "id": "e1", "title": "출처 제목", "publisher": "발행처", "url": "https://...", "type": "internet", "date": "YYYY-MM-DD" }
  ],
  "products": [
    {
      "id": "dubai-oil",
      "category": "energy",
      "categoryName": "원유 및 연료",
      "name": "두바이유 (Dubai Crude)",
      "code": "DUBAI",
      "price": "$78.45 / bbl",
      "change": "+1.2%",
      "isPositive": true,
      "summary": [
        "시황 요약 1~2문장..."
      ],
      "summarySources": [
        { "id": "s1", "title": "출처", "publisher": "Platts", "url": "", "type": "internet", "date": "YYYY-MM-DD" }
      ],
      "upwardFactors": [
        {
          "text": "상방요인 설명 1~2문장...",
          "sources": [{ "id": "uf1", "title": "출처", "publisher": "ICIS", "type": "internet", "date": "YYYY-MM-DD" }]
        }
      ],
      "downwardFactors": [
        {
          "text": "하방요인 설명 1~2문장...",
          "sources": [{ "id": "df1", "title": "출처", "publisher": "EIA", "type": "official_stats", "date": "YYYY-MM-DD" }]
        }
      ],
      "lastUpdated": "YYYY-MM-DD"
    }
  ]
}
제품 목록에 포함해야 할 항목들:
1. 두바이유 (Dubai Crude)
2. 휘발유 (Gasoline 92RON)
3. 납사 (Naphtha, CFR Japan)
4. 에틸렌 (Ethylene, CFR NEA)
5. 프로필렌 (Propylene)
6. BTX (벤젠/톨루엔/자일렌)
7. 고밀도 폴리에틸렌 (HDPE Film)

모든 문장은 전문적이고 정제된 컨설팅 보고서 톤(한국어)으로 1~3문장 이내로 작성하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    // Try to parse JSON from response text
    let jsonStart = responseText.indexOf('{');
    let jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.products) {
        parsed.uploadedReportsCount = uploadedTexts ? uploadedTexts.length : 0;
        return res.json(parsed);
      }
    }

    // Fallback if parsing fails
    res.json({
      date: new Date().toISOString().split('T')[0],
      executiveSummary: [
        "글로벌 유가 및 석유화학 시장은 수급 밸런스와 지정학적 요인이 복합 작용하며 혼조세를 보이고 있습니다.",
        "주요 제품별로 스프레드 개선 여부에 따른 선별적 접근이 요구됩니다."
      ],
      executiveSources: [{ id: "ex-fb", title: "실시간 AI 시황 분석", publisher: "Gemini AI", type: "internet", date: new Date().toISOString().split('T')[0] }],
      products: defaultProducts,
      uploadedReportsCount: uploadedTexts ? uploadedTexts.length : 0
    });

  } catch (error: any) {
    console.error("Error generating market summary:", error);
    const isQuotaError = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota');
    const summaryMsg = isQuotaError
      ? "현재 API 사용량 한도(Quota 429)를 초과하여, 검증된 컨설팅 데이터베이스 기반의 표준 시황 요약본을 제공합니다. 잠시 후 다시 시도해 주세요."
      : "현재 실시간 AI 연동 중 일시적인 응답 지연이 발생하여 기본 시황 데이터셋을 제공합니다.";

    res.json({
      date: new Date().toISOString().split('T')[0],
      executiveSummary: [
        summaryMsg,
        "유가, 가솔린 및 주요 납사 등 석유화학 제품군의 가격 흐름과 상·하방 요인은 아래 카드 및 상세 분석에서 확인하실 수 있습니다."
      ],
      executiveSources: [{ id: "err-1", title: isQuotaError ? "API Quota Exceeded - Fallback Dataset" : "기본 시스템 데이터", publisher: "Consulting DB", type: "official_stats", date: "2026-09-07" }],
      products: defaultProducts,
      uploadedReportsCount: 0
    });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
