/** Original LEXID INVEST project brand covers. No external network or unverified metrics. */
export const brandPortfolio = [
  { slug:'wallpilot', name:'WallPilot Pro', sector:'FinTech', focus:'AI 기반 금융 분석과 리스크 인텔리전스' },
  { slug:'medipick', name:'MediPick', sector:'HealthTech', focus:'의료정보 탐색과 접근성' },
  { slug:'lonex', name:'Lonex AI', sector:'Enterprise AI', focus:'연결형 기업 AI 서비스' },
  { slug:'lawygo', name:'LawyGo', sector:'LegalTech', focus:'법률업무 자동화' },
  { slug:'greenbean', name:'Greenbean Ledger', sector:'AssetTech', focus:'실물자산·공급망 투명성' },
  { slug:'ambassador', name:'Ambassador AI', sector:'CreatorTech', focus:'AI 크리에이터와 브랜드 IP' },
  { slug:'linkr', name:'Linkr / LiVe', sector:'CommerceTech', focus:'라이브커머스와 셀러 네트워크' },
  { slug:'travelgaljido', name:'여행갈지도', sector:'TravelTech', focus:'여행 탐색과 로컬 커머스' },
  { slug:'garakhansang', name:'가락한상', sector:'Local Commerce', focus:'전통시장 디지털 경험' },
  { slug:'garakorder', name:'가락한상오더', sector:'Food Commerce', focus:'신선식품 주문·배송' },
] as const;
const approvedSlugs = new Set<string>(brandPortfolio.map(p=>p.slug));
export function brandImage(slug: string): string {
  return approvedSlugs.has(slug) ? `/images/brands/${slug}.webp` : '/images/lexid-ai-globe.webp';
}
