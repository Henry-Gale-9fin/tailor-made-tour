export interface Feature {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  valueProp: string;
  url: string;
}

export const featureCatalog: Feature[] = [
  {
    id: "deal-tracker",
    name: "Deal Tracker",
    description: "Track live and historical deals across the market",
    longDescription: "Monitor real-time deal flow with comprehensive tracking of live transactions, historical data, and market trends. Get instant alerts on new issuances and pricing updates.",
    image: "/placeholder.svg",
    valueProp: "Never miss a deal opportunity",
    url: "https://9fin.com/deal-tracker"
  },
  {
    id: "document-search",
    name: "Document Search",
    description: "Search across thousands of financial documents instantly",
    longDescription: "Powerful AI-driven search across bond prospectuses, credit agreements, and financial filings. Find relevant clauses and terms in seconds, not hours.",
    image: "/placeholder.svg",
    valueProp: "Find the needle in the haystack",
    url: "https://9fin.com/document-search"
  },
  {
    id: "credit-analysis",
    name: "Credit Analysis",
    description: "Deep-dive credit analysis and risk assessment tools",
    longDescription: "Comprehensive credit scoring, covenant analysis, and risk metrics. Compare issuers side-by-side with standardized metrics and custom peer groups.",
    image: "/placeholder.svg",
    valueProp: "Make informed credit decisions",
    url: "https://9fin.com/credit-analysis"
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    description: "Real-time market data and intelligence feeds",
    longDescription: "Stay ahead with curated market news, pricing data, and expert commentary. Customizable alerts keep you informed on the names that matter most.",
    image: "/placeholder.svg",
    valueProp: "Stay ahead of the market",
    url: "https://9fin.com/market-intelligence"
  },
  {
    id: "portfolio-analytics",
    name: "Portfolio Analytics",
    description: "Advanced portfolio monitoring and analytics",
    longDescription: "Track your portfolio performance with real-time P&L, exposure analysis, and risk metrics. Seamlessly integrate with your existing systems.",
    image: "/placeholder.svg",
    valueProp: "Optimize your portfolio performance",
    url: "https://9fin.com/portfolio-analytics"
  },
  {
    id: "covenant-alerts",
    name: "Covenant Alerts",
    description: "Automated covenant breach monitoring and alerts",
    longDescription: "Never miss a covenant test. Automated tracking of financial covenants with customizable alerts for approaching or breached thresholds.",
    image: "/placeholder.svg",
    valueProp: "Protect your investments",
    url: "https://9fin.com/covenant-alerts"
  },
  {
    id: "legal-docs",
    name: "Legal Document Library",
    description: "Comprehensive library of legal documentation",
    longDescription: "Access thousands of credit agreements, indentures, and legal precedents. Compare terms across deals and build your own document templates.",
    image: "/placeholder.svg",
    valueProp: "Streamline your legal workflow",
    url: "https://9fin.com/legal-docs"
  },
  {
    id: "pricing-data",
    name: "Pricing Data",
    description: "Institutional-grade pricing and valuation data",
    longDescription: "Access bid/ask spreads, historical pricing, and fair value estimates. Integration with major data providers ensures comprehensive coverage.",
    image: "/placeholder.svg",
    valueProp: "Price with confidence",
    url: "https://9fin.com/pricing-data"
  },
  {
    id: "issuer-profiles",
    name: "Issuer Profiles",
    description: "Detailed issuer profiles and financial data",
    longDescription: "Comprehensive issuer information including financials, capital structure, management, and news. One-stop shop for issuer intelligence.",
    image: "/placeholder.svg",
    valueProp: "Know your issuers inside out",
    url: "https://9fin.com/issuer-profiles"
  },
  {
    id: "deal-comps",
    name: "Deal Comparables",
    description: "Compare deal terms across similar transactions",
    longDescription: "Build custom peer groups and compare pricing, terms, and structures across similar deals. Essential for pricing new issues and secondary trading.",
    image: "/placeholder.svg",
    valueProp: "Benchmark with precision",
    url: "https://9fin.com/deal-comps"
  },
  {
    id: "workflow-tools",
    name: "Workflow Tools",
    description: "Streamline your daily workflow with automation",
    longDescription: "Automate repetitive tasks, set up custom watchlists, and create personalized dashboards. Save hours every week on manual processes.",
    image: "/placeholder.svg",
    valueProp: "Work smarter, not harder",
    url: "https://9fin.com/workflow-tools"
  },
  {
    id: "data-export",
    name: "Data Export",
    description: "Export data to Excel, PDF, and other formats",
    longDescription: "Seamlessly export any data to your preferred format. Build custom reports and integrate with your existing tools and workflows.",
    image: "/placeholder.svg",
    valueProp: "Your data, your way",
    url: "https://9fin.com/data-export"
  },
  {
    id: "collaboration",
    name: "Team Collaboration",
    description: "Share insights and collaborate with your team",
    longDescription: "Share watchlists, annotations, and custom views with colleagues. Built-in commenting and notification system keeps everyone aligned.",
    image: "/placeholder.svg",
    valueProp: "Work better together",
    url: "https://9fin.com/collaboration"
  },
  {
    id: "api-access",
    name: "API Access",
    description: "Programmatic access to all platform data",
    longDescription: "RESTful API access to all platform data and functionality. Build custom integrations and automate your workflows.",
    image: "/placeholder.svg",
    valueProp: "Build your own solutions",
    url: "https://9fin.com/api-access"
  },
  {
    id: "advisory-tools",
    name: "Advisory Tools",
    description: "Specialized tools for financial advisors",
    longDescription: "Client-ready reports, pitch materials, and market updates. Everything you need to advise clients on credit markets.",
    image: "/placeholder.svg",
    valueProp: "Advise with authority",
    url: "https://9fin.com/advisory-tools"
  }
];

export const firmTypeFeatureMapping: Record<string, string[]> = {
  "Markets": ["deal-tracker", "pricing-data", "market-intelligence", "deal-comps", "workflow-tools"],
  "Banks": ["deal-tracker", "document-search", "credit-analysis", "issuer-profiles", "deal-comps"],
  "Buyside": ["portfolio-analytics", "credit-analysis", "covenant-alerts", "pricing-data", "market-intelligence"],
  "Law firms": ["legal-docs", "document-search", "deal-comps", "covenant-alerts", "data-export"],
  "Advisors": ["advisory-tools", "market-intelligence", "issuer-profiles", "deal-comps", "collaboration"]
};

export const getFeaturesForFirmType = (firmType: string): Feature[] => {
  const featureIds = firmTypeFeatureMapping[firmType] || firmTypeFeatureMapping["Markets"];
  return featureIds.map(id => featureCatalog.find(f => f.id === id)!).filter(Boolean);
};
