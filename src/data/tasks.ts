import type { RecommendationProfile } from '../types';

export interface TaskScenario {
  id:
    | 'quick-fixes'
    | 'feature-shipping'
    | 'deep-refactors'
    | 'tool-orchestration'
    | 'visual-ui'
    | 'docs-and-decks'
    | 'budget-swarms';
  name: string;
  shortName: string;
  note: string;
  description: string;
  accent: string;
  profile: RecommendationProfile;
}

export type TaskScenarioId = TaskScenario['id'];
export type TaskMix = Record<TaskScenarioId, number>;

export interface TaskPreset {
  id: 'balanced' | 'ship-fast' | 'refactor-week' | 'research-ops' | 'swarm-mode';
  name: string;
  note: string;
  weights: TaskMix;
}

export const TASK_SCENARIOS: TaskScenario[] = [
  {
    id: 'quick-fixes',
    name: 'Quick fixes',
    shortName: 'Quick fixes',
    note: 'Fast edits, tight loops, low-latency debugging.',
    description: 'Rewards strong coding at a lower cost, without over-indexing on extreme long-horizon work.',
    accent: '#8ef1ff',
    profile: {
      budget: 84,
      coding: 78,
      toolUse: 40,
      multimodality: 16,
      longContext: 12,
      stability: 34,
      preferStableReleases: true,
    },
  },
  {
    id: 'feature-shipping',
    name: 'Feature shipping',
    shortName: 'Ship feature',
    note: 'Balanced coding, tools, and enough context to carry a task home.',
    description: 'Models that can plan, implement, debug, and finish a feature without constant supervision rise here.',
    accent: '#71f7bf',
    profile: {
      budget: 34,
      coding: 90,
      toolUse: 76,
      multimodality: 36,
      longContext: 54,
      stability: 48,
      preferStableReleases: true,
    },
  },
  {
    id: 'deep-refactors',
    name: 'Deep refactors',
    shortName: 'Refactors',
    note: 'Repo-scale changes, migrations, and persistence over long sessions.',
    description: 'Favors models with the strongest long-horizon coding signals, big-context support, and steady execution.',
    accent: '#d3a7ff',
    profile: {
      budget: 12,
      coding: 92,
      toolUse: 80,
      multimodality: 14,
      longContext: 98,
      stability: 54,
      preferStableReleases: true,
    },
  },
  {
    id: 'tool-orchestration',
    name: 'Tool orchestration',
    shortName: 'Tooling',
    note: 'Agentic flows with search, screenshots, shells, and multi-step execution.',
    description: 'This task emphasizes tool use, coordination across environments, and staying effective as workflows branch.',
    accent: '#f9b36c',
    profile: {
      budget: 22,
      coding: 58,
      toolUse: 98,
      multimodality: 34,
      longContext: 74,
      stability: 52,
      preferStableReleases: true,
    },
  },
  {
    id: 'visual-ui',
    name: 'Visual / UI build',
    shortName: 'UI build',
    note: 'Screenshots, frontend polish, and design-into-code work.',
    description: 'Rewards models that pair coding with vision and computer-use fluency for interface-heavy tasks.',
    accent: '#ff9bbf',
    profile: {
      budget: 28,
      coding: 76,
      toolUse: 56,
      multimodality: 92,
      longContext: 42,
      stability: 42,
      preferStableReleases: true,
    },
  },
  {
    id: 'docs-and-decks',
    name: 'Docs & decks',
    shortName: 'Docs',
    note: 'Specs, spreadsheets, presentations, and structured knowledge work.',
    description: 'Highlights models that stay strong beyond code when the task becomes documents, analysis, or polished deliverables.',
    accent: '#ffe082',
    profile: {
      budget: 20,
      coding: 42,
      toolUse: 70,
      multimodality: 54,
      longContext: 66,
      stability: 56,
      preferStableReleases: true,
    },
  },
  {
    id: 'budget-swarms',
    name: 'Budget swarms',
    shortName: 'Swarms',
    note: 'Parallel subagents, file review, and cheap delegated work.',
    description: 'Rewards throughput and price efficiency while still asking for enough coding and tool reliability to be useful.',
    accent: '#7ec8ff',
    profile: {
      budget: 100,
      coding: 54,
      toolUse: 62,
      multimodality: 18,
      longContext: 28,
      stability: 30,
      preferStableReleases: true,
    },
  },
];

export const DEFAULT_TASK_MIX: TaskMix = {
  'quick-fixes': 62,
  'feature-shipping': 86,
  'deep-refactors': 64,
  'tool-orchestration': 70,
  'visual-ui': 42,
  'docs-and-decks': 36,
  'budget-swarms': 48,
};

export const TASK_PRESETS: TaskPreset[] = [
  {
    id: 'balanced',
    name: 'Balanced launch',
    note: 'A healthy mix of shipping, tools, and cost awareness.',
    weights: DEFAULT_TASK_MIX,
  },
  {
    id: 'ship-fast',
    name: 'Ship fast',
    note: 'Pushes toward fast coding and UI output without forgetting tools.',
    weights: {
      'quick-fixes': 78,
      'feature-shipping': 96,
      'deep-refactors': 38,
      'tool-orchestration': 68,
      'visual-ui': 72,
      'docs-and-decks': 18,
      'budget-swarms': 34,
    },
  },
  {
    id: 'refactor-week',
    name: 'Refactor week',
    note: 'Turn the dial toward long-horizon repo work.',
    weights: {
      'quick-fixes': 16,
      'feature-shipping': 60,
      'deep-refactors': 100,
      'tool-orchestration': 82,
      'visual-ui': 10,
      'docs-and-decks': 28,
      'budget-swarms': 8,
    },
  },
  {
    id: 'research-ops',
    name: 'Research ops',
    note: 'Documents, analysis, and tool-rich professional tasks.',
    weights: {
      'quick-fixes': 8,
      'feature-shipping': 36,
      'deep-refactors': 24,
      'tool-orchestration': 76,
      'visual-ui': 30,
      'docs-and-decks': 100,
      'budget-swarms': 12,
    },
  },
  {
    id: 'swarm-mode',
    name: 'Swarm mode',
    note: 'Designed for lots of smaller delegated tasks.',
    weights: {
      'quick-fixes': 74,
      'feature-shipping': 24,
      'deep-refactors': 10,
      'tool-orchestration': 52,
      'visual-ui': 12,
      'docs-and-decks': 10,
      'budget-swarms': 100,
    },
  },
];

export function buildProfileFromTaskMix(taskMix: TaskMix): RecommendationProfile {
  const totalIntensity = Object.values(taskMix).reduce((sum, value) => sum + value, 0);
  const zeroProfile: RecommendationProfile = {
    budget: 0,
    coding: 0,
    toolUse: 0,
    multimodality: 0,
    longContext: 0,
    stability: 0,
    preferStableReleases: true,
  };

  if (totalIntensity === 0) {
    return zeroProfile;
  }

  const blended = TASK_SCENARIOS.reduce(
    (profile, scenario) => {
      const intensity = taskMix[scenario.id];
      return {
        budget: profile.budget + scenario.profile.budget * intensity,
        coding: profile.coding + scenario.profile.coding * intensity,
        toolUse: profile.toolUse + scenario.profile.toolUse * intensity,
        multimodality: profile.multimodality + scenario.profile.multimodality * intensity,
        longContext: profile.longContext + scenario.profile.longContext * intensity,
        stability: profile.stability + scenario.profile.stability * intensity,
      };
    },
    {
      budget: 0,
      coding: 0,
      toolUse: 0,
      multimodality: 0,
      longContext: 0,
      stability: 0,
    }
  );

  return {
    budget: Math.round(blended.budget / totalIntensity),
    coding: Math.round(blended.coding / totalIntensity),
    toolUse: Math.round(blended.toolUse / totalIntensity),
    multimodality: Math.round(blended.multimodality / totalIntensity),
    longContext: Math.round(blended.longContext / totalIntensity),
    stability: Math.round(blended.stability / totalIntensity),
    preferStableReleases: true,
  };
}
