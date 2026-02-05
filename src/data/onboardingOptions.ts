import { Building2, Landmark, TrendingUp, Scale, Users } from "lucide-react";

export const firmTypes = [
  { id: "Markets", label: "Markets", icon: TrendingUp },
  { id: "Banks", label: "Banks", icon: Landmark },
  { id: "Buyside", label: "Buyside", icon: Building2 },
  { id: "Law firms", label: "Law firms", icon: Scale },
  { id: "Advisors", label: "Advisors", icon: Users },
];

export const seniorityOptions: Record<string, { id: string; label: string }[]> = {
  "Markets": [
    { id: "analyst", label: "Analyst" },
    { id: "associate", label: "Associate" },
    { id: "vp", label: "Vice President" },
    { id: "director", label: "Director" },
    { id: "md", label: "Managing Director" },
  ],
  "Banks": [
    { id: "analyst", label: "Analyst" },
    { id: "associate", label: "Associate" },
    { id: "vp", label: "Vice President" },
    { id: "director", label: "Director" },
    { id: "md", label: "Managing Director" },
  ],
  "Buyside": [
    { id: "analyst", label: "Analyst" },
    { id: "associate", label: "Associate" },
    { id: "vp-principal", label: "Vice President / Principal" },
    { id: "director", label: "Director" },
    { id: "partner-pm", label: "Partner / Portfolio Manager" },
  ],
  "Law firms": [
    { id: "trainee", label: "Trainee / Junior Associate" },
    { id: "associate", label: "Associate" },
    { id: "senior-associate", label: "Senior Associate" },
    { id: "counsel", label: "Counsel" },
    { id: "partner", label: "Partner" },
  ],
  "Advisors": [
    { id: "analyst", label: "Analyst" },
    { id: "associate", label: "Associate" },
    { id: "vp", label: "Vice President" },
    { id: "director", label: "Director" },
    { id: "partner", label: "Partner" },
  ],
};

export const usageOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "never", label: "Never" },
];
