export type ModelStatus = 'stable' | 'preview' | 'beta';
export type Provider = 'OpenAI' | 'Anthropic' | 'Google';
export type PlannerAxis =
  | 'budget'
  | 'coding'
  | 'toolUse'
  | 'multimodality'
  | 'longContext'
  | 'stability';

export interface Citation {
  id: string;
  title: string;
  publisher: string;
  url: string;
  checkedOn: string;
  publishedOn?: string;
  detail: string;
}

export interface CitedMetric<T> {
  value: T | null;
  display: string;
  citations: Citation[];
  note?: string;
}

export interface ModalitySupport {
  textInput: boolean;
  textOutput: boolean;
  imageInput: boolean;
  imageOutput: boolean;
  audioInput: boolean;
  audioOutput: boolean;
  videoInput: boolean;
  videoOutput: boolean;
  display: string;
  citations: Citation[];
  note?: string;
}

export interface EvidencePoint {
  title: string;
  detail: string;
  citations: Citation[];
  result?: string;
}

export interface ProviderSignal {
  strength: number;
  rationale: string;
  citations: Citation[];
}

export interface ModelRecord {
  id: string;
  name: string;
  shortName: string;
  provider: Provider;
  status: ModelStatus;
  statusNote: string;
  snapshotDate: string;
  releaseDate: CitedMetric<string>;
  tagline: string;
  description: string;
  accent: string;
  glow: string;
  orbit: number;
  contextWindow: CitedMetric<number>;
  maxOutputTokens: CitedMetric<number>;
  knowledgeCutoff: CitedMetric<string>;
  inputPriceUsdPer1M: CitedMetric<number>;
  outputPriceUsdPer1M: CitedMetric<number>;
  cachedInputPriceUsdPer1M: CitedMetric<number>;
  reasoningControls: CitedMetric<string>;
  modalities: ModalitySupport;
  toolSurfaceCount: CitedMetric<number>;
  toolSummary: CitedMetric<string>;
  strengths: EvidencePoint[];
  benchmarks: EvidencePoint[];
  cautions: EvidencePoint[];
  fitSignals: Record<PlannerAxis, ProviderSignal>;
}

export interface RecommendationProfile {
  budget: number;
  coding: number;
  toolUse: number;
  multimodality: number;
  longContext: number;
  stability: number;
  preferStableReleases: boolean;
}

export interface ScoreDetail {
  axis: PlannerAxis;
  label: string;
  rawScore: number;
  weight: number;
  contribution: number;
  formula: string;
}

export interface ScoredModel {
  modelId: string;
  totalScore: number;
  explanation: string;
  breakdown: Record<PlannerAxis, ScoreDetail>;
}
