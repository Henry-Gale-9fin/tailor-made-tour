import { supabase } from "@/integrations/supabase/client";

export interface Feature {
  id: string;
  name: string;
  description: string;
  use_case: string;
  category: string;
  media_type: string;
  status: string;
  image_url: string | null;
  url: string | null;
  feature_group: string | null;
  sort_order: number;
  videoSrc?: string;
  posterSrc?: string;
}

const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/videos`;

const featureVideoMap: Record<string, string> = {
  "advisor-fees": "advisor_fees_with_opening.mp4",
  "ai-earnings-transcripts": "ai_earning_calls_video_total.mp4",
  "bdc-holdings": "bdc_holdings_with_opening.mp4",
  "bond-loan-covenant-databases": "bonds_and_loans_screener_with_opening.mp4",
  "clo-databases": "clo_database_with_opening.mp4",
  "clo-in-market-pipeline": "clo_in_market_with_opening.mp4",
  "clo-manager-profiles": "clo_manager_with_opening.mp4",
  "clo-transactions-holdings": "clo_transactions_holdings_with_opening.mp4",
  "company-profiles": "company_page_quick_with_opening.mp4",
  "covenant-data": "covenant_data_with_opening.mp4",
  "covenant-explorer": "covenant_explorer_with_opening.mp4",
  "covenant-pushback": "covenant_pushback_with_opening.mp4",
  "deal-predictions": "deal_predictions_with_opening.mp4",
  "dockets": "dockets_with_opening.mp4",
  "document-search": "document_search_with_opening.mp4",
  "ai-database-filters": "filters_no_opening_with_intro.mp4",
  "lme-data": "lme_data_with_opening.mp4",
  "market-trends": "market_trends_with_opening.mp4",
  "new-deal-alerts": "new_deal_alerts_with_opening.mp4",
  "private-credit-databases": "private_credit_databases_with_opening.mp4",
  "proprietary-analysis": "proprietary_analysis_with_opening.mp4",
  "legal-quicktakes": "quick_take_with_opening.mp4",
  "restructuring-tracker": "restructuring_tracking_with_opening.mp4",
  "sponsor-profiles": "sponsor_page_with_opening.mp4",
  "ai-company-tear-sheets": "tear_sheets_with_opening.mp4",
  "third-party-news": "third_party_news_with_opening.mp4",
};

export const fetchAllFeatures = async (): Promise<Feature[]> => {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch features:", error);
    return [];
  }

  const HIDDEN_FEATURES = ["ai-matrix"];

  return (data as Feature[]).filter(f => !HIDDEN_FEATURES.includes(f.id)).map(f => {
    const videoFile = featureVideoMap[f.id];
    return {
      ...f,
      videoSrc: videoFile ? `${STORAGE_BASE}/${videoFile}` : undefined,
      posterSrc: f.image_url || undefined,
    };
  });
};

// Matrix: feature_id (with underscores) → firm_type_key → teams[]
const featureRelevanceMatrix: Record<string, Record<string, string[]>> = {
  "ai-matrix": { markets: ["Distressed","CLO"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","Private credit investing","CLO management","Distressed"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "ai-earnings-transcripts": { markets: ["Levfin","Private Credit"], banks: ["Origination","Sales & trading"], buyside: ["Performing credit","Private credit investing"], law_firms: [], advisors: [] },
  "ai-company-tear-sheets": { markets: ["Distressed","CLO"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","Private credit investing","CLO management","Distressed"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "ai-database-filters": { markets: [], banks: [], buyside: [], law_firms: [], advisors: [] },
  "covenant-data": { markets: ["Levfin","Distressed"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","CLO management"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "covenant-explorer": { markets: ["Levfin","Distressed"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","CLO management"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "covenant-pushback": { markets: ["Levfin","Distressed"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","CLO management"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "bond-loan-covenant-databases": { markets: [], banks: [], buyside: [], law_firms: [], advisors: [] },
  "legal-quicktakes": { markets: [], banks: [], buyside: [], law_firms: [], advisors: [] },
  "sponsor-profiles": { markets: [], banks: [], buyside: ["Distressed"], law_firms: [], advisors: [] },
  "dockets": { markets: [], banks: [], buyside: [], law_firms: ["Restructuring"], advisors: ["Restructuring"] },
  "clo-manager-profiles": { markets: ["CLO"], banks: ["Sales & trading"], buyside: ["CLO management"], law_firms: [], advisors: ["Origination & pitching"] },
  "private-credit-databases": { markets: ["Private Credit"], banks: [], buyside: ["Private credit investing"], law_firms: [], advisors: [] },
  "document-search": { markets: ["CLO"], banks: ["Sales & trading"], buyside: ["Performing credit","Private credit investing","CLO management","Distressed"], law_firms: ["Banking & Capital Markets","Restructuring","Structured finance"], advisors: ["Restructuring"] },
  "restructuring-tracker": { markets: [], banks: ["Restructuring"], buyside: [], law_firms: ["Restructuring"], advisors: ["Restructuring"] },
  "clo-transactions-holdings": { markets: ["CLO"], banks: ["Sales & trading","Securitisation"], buyside: ["CLO management"], law_firms: [], advisors: ["Origination & pitching"] },
  "bdc-holdings": { markets: ["Private Credit"], banks: [], buyside: ["Private credit investing"], law_firms: [], advisors: [] },
  "clo-in-market-pipeline": { markets: ["CLO"], banks: ["Sales & trading","Securitisation"], buyside: ["CLO management"], law_firms: [], advisors: ["Origination & pitching"] },
  "instrument-databases": { markets: ["Levfin","Distressed"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","Private credit investing","CLO management"], law_firms: ["Banking & Capital Markets"], advisors: ["Origination & pitching","Restructuring"] },
  "advisor-fees": { markets: ["Distressed"], banks: ["Restructuring"], buyside: [], law_firms: ["Restructuring"], advisors: ["Restructuring"] },
  "clo-databases": { markets: ["CLO"], banks: ["Sales & trading","Securitisation"], buyside: ["CLO management"], law_firms: [], advisors: ["Origination & pitching"] },
  "market-trends": { markets: ["Levfin"], banks: ["Origination","Sales & trading","Securitisation"], buyside: [], law_firms: [], advisors: [] },
  "company-profiles": { markets: ["Levfin","Distressed","Private Credit","CLO"], banks: ["Origination","Sales & trading","Restructuring"], buyside: ["Performing credit","Private credit investing","CLO management"], law_firms: ["Banking & Capital Markets","Restructuring"], advisors: ["Restructuring"] },
  "lme-data": { markets: [], banks: ["Restructuring"], buyside: [], law_firms: [], advisors: [] },
  "deal-predictions": { markets: ["Levfin"], banks: ["Origination","Sales & trading"], buyside: ["Private credit investing","Distressed"], law_firms: [], advisors: ["Origination & pitching"] },
  "proprietary-analysis": { markets: ["Levfin","Distressed","Private Credit","CLO","ABF"], banks: ["Origination","Sales & trading","Restructuring","Securitisation"], buyside: ["Performing credit","Private credit investing","CLO management","Distressed"], law_firms: ["Banking & Capital Markets","BD","Restructuring","Structured finance"], advisors: ["Origination & pitching","Restructuring"] },
  "new-deal-alerts": { markets: ["ABF"], banks: [], buyside: [], law_firms: [], advisors: [] },
  "third-party-news": { markets: ["Levfin","Distressed","Private Credit","ABF"], banks: ["Origination","Sales & trading","Restructuring","Securitisation"], buyside: ["Performing credit","Private credit investing"], law_firms: [], advisors: ["Origination & pitching","Restructuring"] },
};

const firmTypeKeyMap: Record<string, string> = {
  "Markets": "markets",
  "Banks": "banks",
  "Buyside": "buyside",
  "Law firms": "law_firms",
  "Advisors": "advisors",
};

export const getFeaturesForFirmType = (firmType: string, allFeatures: Feature[]): Feature[] => {
  const key = firmTypeKeyMap[firmType] || "markets";

  const scored = allFeatures.map(f => {
    const relevance = featureRelevanceMatrix[f.id];
    const teamCount = relevance?.[key]?.length || 0;
    return { feature: f, teamCount };
  });

  return scored
    .filter(s => s.teamCount > 0)
    .sort((a, b) => b.teamCount - a.teamCount)
    .slice(0, 5)
    .map(s => s.feature);
};
