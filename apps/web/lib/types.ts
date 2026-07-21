export type Scores = {
  ats: number;
  skill_match: number;
  semantic_similarity: number;
  experience_relevance: number;
  formatting_quality: number;
  recruiter_impression: number;
  readability: number;
};

export type Analysis = {
  analysis_id: string;
  file_name: string;
  scores: Scores;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  matched_keywords: string[];
  suggested_skills: string[];
  recommendations: string[];
  improved_bullets: string[];
  section_analysis: { section: string; score: number; summary: string }[];
  radar: { metric: string; score: number }[];
  skill_gap: { name: string; matched: boolean; value: number }[];
  heatmap: { line: number; text: string; score: number }[];
};

export type AnalysisSummary = {
  analysis_id: string;
  file_name: string;
  created_at: string;
  ats_score: number;
  skill_match: number;
  semantic_similarity: number;
  missing_keyword_count: number;
  top_missing_keywords: string[];
};

export type AnalysisComparison = {
  first: AnalysisSummary;
  second: AnalysisSummary;
  score_deltas: { metric: string; first: number; second: number; delta: number }[];
  gained_keywords: string[];
  lost_keywords: string[];
  shared_keywords: string[];
  recommendation: string;
};
