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
}

// Map old Feature interface fields for backward compat
export const mapFeature = (f: Feature) => ({
  ...f,
  longDescription: f.use_case,
  valueProp: f.description,
  image: f.image_url || "/placeholder.svg",
});

export const fetchAllFeatures = async (): Promise<Feature[]> => {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch features:", error);
    return [];
  }
  return data as Feature[];
};

// Firm type → feature group mapping
export const firmTypeFeatureGroupMapping: Record<string, string[]> = {
  "Markets": ["AI-Powered Workflow Tools", "Database Tools", "Monitoring Tools"],
  "Banks": ["AI-Powered Workflow Tools", "Covenant Tools", "Database Tools"],
  "Buyside": ["AI-Powered Workflow Tools", "CLO Tools", "Database Tools", "Monitoring Tools"],
  "Law firms": ["Covenant Tools", "Analysis & Research", "Restructuring Tools"],
  "Advisors": ["Analysis & Research", "Monitoring Tools", "Restructuring Tools"],
};

export const getFeaturesForFirmType = (firmType: string, allFeatures: Feature[]): Feature[] => {
  const groups = firmTypeFeatureGroupMapping[firmType] || firmTypeFeatureGroupMapping["Markets"];
  return allFeatures.filter(f => f.feature_group && groups.includes(f.feature_group));
};
