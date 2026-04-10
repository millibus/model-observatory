import { describe, expect, it } from 'vitest';
import { MODELS } from '../data/models';
import { computePlannerScores, DEFAULT_PROFILE } from './scoring';

describe('computePlannerScores', () => {
  it('prefers cheaper models when budget dominates and preview tolerance is allowed', () => {
    const profile = {
      ...DEFAULT_PROFILE,
      budget: 100,
      coding: 0,
      toolUse: 0,
      multimodality: 0,
      longContext: 0,
      stability: 0,
      preferStableReleases: false,
    };

    const scores = computePlannerScores(MODELS, profile);
    const miniScore = scores.find((entry) => entry.modelId === 'gpt-5.4-mini');
    const gpt54Score = scores.find((entry) => entry.modelId === 'gpt-5.4');

    expect(scores[0].modelId).toBe('gpt-5.1-codex-mini');
    expect(miniScore).toBeTruthy();
    expect(gpt54Score).toBeTruthy();
    expect((miniScore?.totalScore ?? 0) > (gpt54Score?.totalScore ?? 0)).toBe(true);
  });

  it('favors the most current flagship when stability dominates', () => {
    const profile = {
      ...DEFAULT_PROFILE,
      budget: 0,
      coding: 0,
      toolUse: 0,
      multimodality: 0,
      longContext: 0,
      stability: 100,
      preferStableReleases: true,
    };

    const scores = computePlannerScores(MODELS, profile);
    const flagshipScore = scores.find((entry) => entry.modelId === 'gpt-5.4');
    const olderMiniScore = scores.find((entry) => entry.modelId === 'gpt-5.1-codex-mini');

    expect(flagshipScore).toBeTruthy();
    expect(olderMiniScore).toBeTruthy();
    expect(scores[0].modelId).toBe('gpt-5.4');
    expect((flagshipScore?.totalScore ?? 0) > (olderMiniScore?.totalScore ?? 0)).toBe(true);
  });

  it('produces finite scores for every current model', () => {
    const scores = computePlannerScores(MODELS, DEFAULT_PROFILE);

    for (const score of scores) {
      expect(Number.isNaN(score.totalScore)).toBe(false);
      expect(Number.isNaN(score.breakdown.toolUse.rawScore)).toBe(false);
      expect(Number.isNaN(score.breakdown.longContext.rawScore)).toBe(false);
    }
  });
});
