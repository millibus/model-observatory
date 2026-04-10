import type { ModelRecord, PlannerAxis, RecommendationProfile, ScoredModel, ScoreDetail } from '../types';

const axisLabels: Record<PlannerAxis, string> = {
  budget: 'Budget',
  coding: 'Coding fit',
  toolUse: 'Tool use',
  multimodality: 'Multimodality',
  longContext: 'Long context',
  stability: 'Stability',
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function normalize(value: number | null, values: Array<number | null>, invert = false): number | null {
  if (value === null) return null;
  const populated = values.filter((entry): entry is number => entry !== null);
  if (populated.length === 0) return null;

  const min = Math.min(...populated);
  const max = Math.max(...populated);

  if (min === max) {
    return 100;
  }

  const ratio = (value - min) / (max - min);
  const score = invert ? (1 - ratio) * 100 : ratio * 100;
  return clamp(score);
}

function weightedAverage(parts: Array<{ value: number | null; weight: number }>): number {
  const valid = parts.filter((part) => part.value !== null && part.weight > 0);
  if (valid.length === 0) return 0;

  const totalWeight = valid.reduce((sum, part) => sum + part.weight, 0);
  const weightedTotal = valid.reduce((sum, part) => sum + (part.value ?? 0) * part.weight, 0);
  return weightedTotal / totalWeight;
}

function modalityRichness(model: ModelRecord): number {
  const flags = [
    model.modalities.textInput,
    model.modalities.textOutput,
    model.modalities.imageInput,
    model.modalities.imageOutput,
    model.modalities.audioInput,
    model.modalities.audioOutput,
    model.modalities.videoInput,
    model.modalities.videoOutput,
  ];

  return flags.filter(Boolean).length;
}

function statusBase(model: ModelRecord, preferStableReleases: boolean): number {
  const base =
    model.status === 'stable' ? 96 : model.status === 'beta' ? 72 : 56;

  if (!preferStableReleases) {
    return clamp(base + (model.status === 'preview' ? 18 : model.status === 'beta' ? 10 : 0));
  }

  return base;
}

function signalPercent(model: ModelRecord, axis: PlannerAxis): number {
  return clamp(model.fitSignals[axis].strength * 20);
}

function buildDetail(
  axis: PlannerAxis,
  rawScore: number,
  weight: number,
  totalWeight: number,
  formula: string
): ScoreDetail {
  const normalizedWeight = totalWeight > 0 ? weight / totalWeight : 0;

  return {
    axis,
    label: axisLabels[axis],
    rawScore: Number(rawScore.toFixed(1)),
    weight,
    contribution: Number((rawScore * normalizedWeight).toFixed(1)),
    formula,
  };
}

export function computePlannerScores(models: ModelRecord[], profile: RecommendationProfile): ScoredModel[] {
  const combinedCosts = models.map((model) =>
    model.inputPriceUsdPer1M.value !== null && model.outputPriceUsdPer1M.value !== null
      ? model.inputPriceUsdPer1M.value + model.outputPriceUsdPer1M.value
      : null
  );
  const contextValues = models.map((model) => model.contextWindow.value);
  const outputValues = models.map((model) => model.maxOutputTokens.value);
  const modalityValues = models.map((model) => modalityRichness(model));
  const toolValues = models.map((model) => model.toolSurfaceCount.value);

  const totalWeight =
    profile.budget +
    profile.coding +
    profile.toolUse +
    profile.multimodality +
    profile.longContext +
    profile.stability;

  const scored = models.map((model) => {
    const priceScore = normalize(
      model.inputPriceUsdPer1M.value !== null && model.outputPriceUsdPer1M.value !== null
        ? model.inputPriceUsdPer1M.value + model.outputPriceUsdPer1M.value
        : null,
      combinedCosts,
      true
    );
    const contextScore = normalize(model.contextWindow.value, contextValues);
    const outputScore = normalize(model.maxOutputTokens.value, outputValues);
    const modalityScore = normalize(modalityRichness(model), modalityValues);
    const documentedToolScore = normalize(model.toolSurfaceCount.value, toolValues);

    const budget = weightedAverage([
      { value: priceScore, weight: 0.85 },
      { value: model.cachedInputPriceUsdPer1M.value !== null ? priceScore : null, weight: 0.15 },
    ]);
    const coding = weightedAverage([
      { value: signalPercent(model, 'coding'), weight: 0.55 },
      { value: contextScore, weight: 0.25 },
      { value: outputScore, weight: 0.2 },
    ]);
    const toolUse = weightedAverage([
      { value: signalPercent(model, 'toolUse'), weight: 0.6 },
      { value: documentedToolScore, weight: 0.25 },
      { value: contextScore, weight: 0.15 },
    ]);
    const multimodality = weightedAverage([
      { value: modalityScore, weight: 0.45 },
      { value: signalPercent(model, 'multimodality'), weight: 0.55 },
    ]);
    const longContext = weightedAverage([
      { value: contextScore, weight: 0.5 },
      { value: outputScore, weight: 0.15 },
      { value: signalPercent(model, 'longContext'), weight: 0.35 },
    ]);
    const stability = weightedAverage([
      { value: statusBase(model, profile.preferStableReleases), weight: 0.55 },
      { value: signalPercent(model, 'stability'), weight: 0.45 },
    ]);

    const rawBreakdown: Record<PlannerAxis, number> = {
      budget,
      coding,
      toolUse,
      multimodality,
      longContext,
      stability,
    };

    const totalScore =
      totalWeight === 0
        ? 0
        : Number(
            (
              (rawBreakdown.budget * profile.budget +
                rawBreakdown.coding * profile.coding +
                rawBreakdown.toolUse * profile.toolUse +
                rawBreakdown.multimodality * profile.multimodality +
                rawBreakdown.longContext * profile.longContext +
                rawBreakdown.stability * profile.stability) /
              totalWeight
            ).toFixed(1)
          );

    const breakdown: Record<PlannerAxis, ScoreDetail> = {
      budget: buildDetail(
        'budget',
        rawBreakdown.budget,
        profile.budget,
        totalWeight,
        'Inverse-normalized published input + output price. Missing cache detail never becomes a penalty.'
      ),
      coding: buildDetail(
        'coding',
        rawBreakdown.coding,
        profile.coding,
        totalWeight,
        '55% release positioning for coding, 25% context window, 20% max output.'
      ),
      toolUse: buildDetail(
        'toolUse',
        rawBreakdown.toolUse,
        profile.toolUse,
        totalWeight,
        '60% tool or agent positioning, 25% documented workflow surface, 15% context support.'
      ),
      multimodality: buildDetail(
        'multimodality',
        rawBreakdown.multimodality,
        profile.multimodality,
        totalWeight,
        '45% native modality richness, 55% visual and multimodal workflow positioning.'
      ),
      longContext: buildDetail(
        'longContext',
        rawBreakdown.longContext,
        profile.longContext,
        totalWeight,
        '50% published context window, 15% max output, 35% long-horizon positioning.'
      ),
      stability: buildDetail(
        'stability',
        rawBreakdown.stability,
        profile.stability,
        totalWeight,
        '55% release status and 45% how current the model feels in official guidance.'
      ),
    };

    const topAxes = Object.values(breakdown)
      .filter((entry) => entry.weight > 0)
      .sort((left, right) => right.contribution - left.contribution)
      .slice(0, 2)
      .map((entry) => entry.label.toLowerCase());

    return {
      modelId: model.id,
      totalScore,
      breakdown,
      explanation:
        topAxes.length > 1
          ? `Best aligned with your emphasis on ${topAxes.join(' and ')}.`
          : 'Best aligned with your current priorities.',
    };
  });

  return scored.sort((left, right) => right.totalScore - left.totalScore);
}

export const DEFAULT_PROFILE: RecommendationProfile = {
  budget: 60,
  coding: 78,
  toolUse: 72,
  multimodality: 48,
  longContext: 55,
  stability: 82,
  preferStableReleases: true,
};
