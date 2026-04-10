import type { Citation, CitedMetric, EvidencePoint, ModelRecord, PlannerAxis, ProviderSignal } from '../types';

const checkedOn = '2026-04-02';

function citation(
  id: string,
  title: string,
  publisher: string,
  url: string,
  detail: string,
  publishedOn?: string
): Citation {
  return { id, title, publisher, url, detail, publishedOn, checkedOn };
}

function metric<T>(
  value: T | null,
  display: string,
  citations: Citation[],
  note?: string
): CitedMetric<T> {
  return { value, display, citations, note };
}

function signal(strength: number, rationale: string, citations: Citation[]): ProviderSignal {
  return { strength, rationale, citations };
}

function point(title: string, detail: string, citations: Citation[], result?: string): EvidencePoint {
  return { title, detail, citations, result };
}

const sources = {
  modelsOverview: citation(
    'openai-models-overview',
    'Models overview',
    'OpenAI',
    'https://developers.openai.com/api/docs/models',
    'OpenAI model guide that helps pick between GPT-5.4 and smaller variants and summarizes supported features.',
    '2026-04-01'
  ),
  modelsCompare: citation(
    'openai-models-compare',
    'Compare OpenAI models',
    'OpenAI',
    'https://developers.openai.com/api/docs/models/compare',
    'Comparison page that lists current OpenAI model families, supported tools, and capability positioning.',
    '2026-04-01'
  ),
  gpt54Model: citation(
    'openai-gpt54-model',
    'GPT-5.4 model',
    'OpenAI',
    'https://developers.openai.com/api/docs/models/gpt-5.4',
    'Lists GPT-5.4 context window, pricing, max output, knowledge cutoff, image input, and reasoning support.',
    '2026-03-05'
  ),
  gpt54Launch: citation(
    'openai-gpt54-launch',
    'Introducing GPT-5.4',
    'OpenAI',
    'https://openai.com/index/introducing-gpt-5-4/',
    'Launch post positioning GPT-5.4 as OpenAI’s most capable model for agentic, coding, and professional work.',
    '2026-03-05'
  ),
  gpt54MiniModel: citation(
    'openai-gpt54-mini-model',
    'GPT-5.4 mini model',
    'OpenAI',
    'https://developers.openai.com/api/docs/models/gpt-5.4-mini',
    'Lists GPT-5.4 mini pricing, context window, max output, image input, and reasoning-token support.',
    '2026-03-17'
  ),
  gpt54MiniLaunch: citation(
    'openai-gpt54-mini-launch',
    'Introducing GPT-5.4 mini and nano',
    'OpenAI',
    'https://openai.com/index/introducing-gpt-5-4-mini-and-nano/',
    'Launch post describing GPT-5.4 mini as OpenAI’s strongest mini model yet for coding, computer use, and subagents.',
    '2026-03-17'
  ),
  gpt53CodexModel: citation(
    'openai-gpt53-codex-model',
    'GPT-5.3-Codex model',
    'OpenAI',
    'https://platform.openai.com/docs/models/gpt-5.3-codex',
    'Model page listing GPT-5.3-Codex pricing, context window, image input, and support for structured outputs and function calling.',
    '2026-02-05'
  ),
  gpt53CodexLaunch: citation(
    'openai-gpt53-codex-launch',
    'Introducing GPT-5.3-Codex',
    'OpenAI',
    'https://openai.com/index/introducing-gpt-5-3-codex/',
    'Launch post describing GPT-5.3-Codex as OpenAI’s most capable agentic coding model and publishing benchmark comparisons versus GPT-5.2-Codex.',
    '2026-02-05'
  ),
  gpt52CodexModel: citation(
    'openai-gpt52-codex-model',
    'GPT-5.2-Codex model',
    'OpenAI',
    'https://platform.openai.com/docs/models/gpt-5.2-codex',
    'Model page listing GPT-5.2-Codex pricing, context window, max output, image input, and function-calling support.',
    '2025-12-18'
  ),
  gpt52CodexLaunch: citation(
    'openai-gpt52-codex-launch',
    'Introducing GPT-5.2-Codex',
    'OpenAI',
    'https://openai.com/index/introducing-gpt-5-2-codex/',
    'Launch post describing GPT-5.2-Codex as optimized for long-horizon, agentic coding tasks with reliable tool use and native compaction.',
    '2025-12-18'
  ),
  gpt52Model: citation(
    'openai-gpt52-model',
    'GPT-5.2 model',
    'OpenAI',
    'https://developers.openai.com/api/docs/models/gpt-5.2',
    'Model page listing GPT-5.2 pricing, context window, image input, and reasoning controls.',
    '2025-12-11'
  ),
  gpt52Launch: citation(
    'openai-gpt52-launch',
    'Introducing GPT-5.2',
    'OpenAI',
    'https://openai.com/index/introducing-gpt-5-2/',
    'Launch post positioning GPT-5.2 as a major step up for tool use, code, spreadsheets, presentations, and long documents.',
    '2025-12-11'
  ),
  gpt51CodexMaxModel: citation(
    'openai-gpt51-codex-max-model',
    'GPT-5.1-Codex-Max model',
    'OpenAI',
    'https://platform.openai.com/docs/models/gpt-5.1-codex-max',
    'Model page listing GPT-5.1-Codex-Max pricing, context window, max output, and image input support.',
    '2025-11-19'
  ),
  gpt51CodexMaxLaunch: citation(
    'openai-gpt51-codex-max-launch',
    'GPT-5.1-Codex-Max',
    'OpenAI',
    'https://openai.com/index/gpt-5-1-codex-max/',
    'Launch post describing GPT-5.1-Codex-Max as optimized for long-running tasks, multi-window compaction, and independent work over hours.',
    '2025-11-19'
  ),
  gpt51CodexMiniModel: citation(
    'openai-gpt51-codex-mini-model',
    'GPT-5.1-Codex-Mini model',
    'OpenAI',
    'https://platform.openai.com/docs/models/gpt-5.1-codex-mini',
    'Model page listing GPT-5.1-Codex-Mini pricing, context window, max output, image input, and reasoning support.',
    '2025-11-19'
  ),
  codexReleaseNotes: citation(
    'openai-codex-release-notes',
    'Codex release notes',
    'OpenAI',
    'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
    'OpenAI release notes describing the GPT-5.1 Codex model family rollout inside Codex and ChatGPT.',
    '2025-11-19'
  ),
};

function buildSignals(
  entries: Record<PlannerAxis, [number, string, Citation[]]>
): Record<PlannerAxis, ProviderSignal> {
  return {
    budget: signal(...entries.budget),
    coding: signal(...entries.coding),
    toolUse: signal(...entries.toolUse),
    multimodality: signal(...entries.multimodality),
    longContext: signal(...entries.longContext),
    stability: signal(...entries.stability),
  };
}

function standardModalities(citations: Citation[], note?: string) {
  return {
    textInput: true,
    textOutput: true,
    imageInput: true,
    imageOutput: false,
    audioInput: false,
    audioOutput: false,
    videoInput: false,
    videoOutput: false,
    display: 'Text input/output, image input',
    citations,
    note,
  };
}

export const MODELS: ModelRecord[] = [
  {
    id: 'gpt-5.4',
    name: 'GPT-5.4',
    shortName: '5.4',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Current flagship GPT-5 line model in OpenAI docs.',
    snapshotDate: checkedOn,
    releaseDate: metric('2026-03-05', 'Mar 5, 2026', [sources.gpt54Launch]),
    tagline: 'Flagship model for ambitious coding and professional work.',
    description:
      'GPT-5.4 is the premium all-rounder here: the broadest context budget, the strongest general positioning, and the highest ceiling when the task is simply hard.',
    accent: '#74ffd7',
    glow: 'rgba(116, 255, 215, 0.34)',
    orbit: 1,
    contextWindow: metric(1_050_000, '1.05M tokens', [sources.gpt54Model]),
    maxOutputTokens: metric(128_000, '128K tokens', [sources.gpt54Model]),
    knowledgeCutoff: metric('2025-08-31', 'Aug 31, 2025', [sources.gpt54Model]),
    inputPriceUsdPer1M: metric(2.5, '$2.50', [sources.gpt54Model]),
    outputPriceUsdPer1M: metric(15, '$15.00', [sources.gpt54Model]),
    cachedInputPriceUsdPer1M: metric(0.25, '$0.25', [sources.gpt54Model]),
    reasoningControls: metric<string>(
      null,
      'Reasoning effort supports none, low, medium, high, and xhigh.',
      [sources.gpt54Model]
    ),
    modalities: standardModalities(
      [sources.gpt54Model, sources.modelsCompare],
      'GPT-5.4 stays text-native on output, but OpenAI positions it strongly for computer-use and agentic workflows.'
    ),
    toolSurfaceCount: metric(
      10,
      '10 documented Responses tools',
      [sources.gpt54Model],
      'The GPT-5.4 model page lists web search, file search, image generation, code interpreter, hosted shell, apply patch, skills, computer use, MCP, and tool search.'
    ),
    toolSummary: metric<string>(
      null,
      'Deepest built-in tool surface in this set, paired with the strongest general-purpose capability.',
      [sources.gpt54Model, sources.gpt54Launch]
    ),
    strengths: [
      point(
        'Highest general ceiling',
        'OpenAI positions GPT-5.4 as its best intelligence at scale for agentic, coding, and professional workflows.',
        [sources.gpt54Model, sources.gpt54Launch]
      ),
      point(
        'Best for hard, mixed workloads',
        'The mix of 1.05M context, 128K output, and the full tool surface makes it the safest pick when the task shape is still evolving.',
        [sources.gpt54Model, sources.modelsCompare]
      ),
    ],
    benchmarks: [
      point('SWE-Bench Pro', 'Published in the GPT-5.4 mini launch comparison.', [sources.gpt54MiniLaunch], '57.7%'),
      point('OSWorld-Verified', 'Published in the GPT-5.4 mini launch comparison.', [sources.gpt54MiniLaunch], '75.0%'),
    ],
    cautions: [
      point(
        'Premium price tier',
        'GPT-5.4 carries the highest output-token price in this seven-model roster.',
        [sources.gpt54Model]
      ),
      point(
        'Overkill for swarm work',
        'OpenAI’s own model guide suggests smaller variants when latency and cost matter more than absolute capability.',
        [sources.modelsOverview, sources.modelsCompare]
      ),
    ],
    fitSignals: buildSignals({
      budget: [1, 'Best capability, but clearly not the cost play.', [sources.gpt54Model, sources.modelsOverview]],
      coding: [5, 'OpenAI explicitly frames it as the top option for agentic and coding-heavy work.', [sources.gpt54Model, sources.gpt54Launch]],
      toolUse: [5, 'The published tool surface is the richest in the set.', [sources.gpt54Model]],
      multimodality: [4, 'Image input plus strong computer-use positioning make it useful for UI and screenshot-heavy tasks.', [sources.gpt54Model, sources.gpt54Launch]],
      longContext: [5, 'Largest context window in the roster.', [sources.gpt54Model]],
      stability: [5, 'Newest flagship line and the default starting point in official guidance.', [sources.modelsOverview, sources.gpt54Launch]],
    }),
  },
  {
    id: 'gpt-5.4-mini',
    name: 'GPT-5.4-Mini',
    shortName: '5.4 mini',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Current small GPT-5 line model across OpenAI surfaces.',
    snapshotDate: checkedOn,
    releaseDate: metric('2026-03-17', 'Mar 17, 2026', [sources.gpt54MiniLaunch]),
    tagline: 'Fast, efficient mini model that still feels serious.',
    description:
      'GPT-5.4-Mini is the high-leverage speed pick: much cheaper than GPT-5.4, tuned for coding and computer use, and especially attractive in delegated or iterative workflows.',
    accent: '#a9ffda',
    glow: 'rgba(169, 255, 218, 0.28)',
    orbit: 2,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt54MiniModel, sources.gpt54MiniLaunch]),
    maxOutputTokens: metric(128_000, '128K tokens', [sources.gpt54MiniModel]),
    knowledgeCutoff: metric('2025-08-31', 'Aug 31, 2025', [sources.gpt54MiniModel]),
    inputPriceUsdPer1M: metric(0.75, '$0.75', [sources.gpt54MiniModel]),
    outputPriceUsdPer1M: metric(4.5, '$4.50', [sources.gpt54MiniModel]),
    cachedInputPriceUsdPer1M: metric(0.075, '$0.075', [sources.gpt54MiniModel]),
    reasoningControls: metric<string>(
      null,
      'Reasoning token support documented on the model page.',
      [sources.gpt54MiniModel]
    ),
    modalities: standardModalities(
      [sources.gpt54MiniModel, sources.modelsCompare],
      'Like GPT-5.4, it is strongest when image input and tool use back up a coding workflow.'
    ),
    toolSurfaceCount: metric(
      10,
      '10 documented Responses tools',
      [sources.gpt54MiniModel],
      'The GPT-5.4 mini page lists the same documented Responses tool surface as GPT-5.4.'
    ),
    toolSummary: metric<string>(
      null,
      'Retains the full OpenAI tool stack while dropping cost dramatically.',
      [sources.gpt54MiniModel, sources.gpt54MiniLaunch]
    ),
    strengths: [
      point(
        'Strongest mini model yet',
        'OpenAI describes GPT-5.4 mini as its strongest mini model yet for coding, computer use, and subagents.',
        [sources.gpt54MiniLaunch]
      ),
      point(
        'Excellent delegated-work fit',
        'The launch explicitly recommends it for subagents, debugging, and supporting tasks that benefit from speed and lower cost.',
        [sources.gpt54MiniLaunch]
      ),
    ],
    benchmarks: [
      point('SWE-Bench Pro', 'Published in the launch post.', [sources.gpt54MiniLaunch], '54.4%'),
      point('OSWorld-Verified', 'Published in the launch post.', [sources.gpt54MiniLaunch], '72.1%'),
    ],
    cautions: [
      point(
        'Context is strong, not maximal',
        '400K is substantial, but still far below GPT-5.4’s 1.05M window.',
        [sources.gpt54MiniModel, sources.gpt54Model]
      ),
      point(
        'Not the absolute top model',
        'OpenAI presents it as a speed-and-cost optimized tradeoff rather than the flagship choice.',
        [sources.gpt54MiniLaunch, sources.modelsOverview]
      ),
    ],
    fitSignals: buildSignals({
      budget: [5, 'Best cost-per-capability balance in the newest GPT-5 line.', [sources.gpt54MiniModel, sources.gpt54MiniLaunch]],
      coding: [4, 'Launch positioning is very strong for coding and debugging, but still below GPT-5.4 at the ceiling.', [sources.gpt54MiniLaunch]],
      toolUse: [5, 'It keeps the same documented tool surface as GPT-5.4.', [sources.gpt54MiniModel]],
      multimodality: [4, 'Strong for screenshot and UI flows because it pairs image input with the same tool stack.', [sources.gpt54MiniModel, sources.gpt54MiniLaunch]],
      longContext: [4, '400K is still large enough for serious codebase work.', [sources.gpt54MiniModel]],
      stability: [5, 'Newest mini tier and a first-class recommendation in official docs.', [sources.modelsOverview, sources.gpt54MiniLaunch]],
    }),
  },
  {
    id: 'gpt-5.3-codex',
    name: 'GPT-5.3-Codex',
    shortName: '5.3 codex',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Current specialized Codex model in OpenAI product surfaces.',
    snapshotDate: checkedOn,
    releaseDate: metric('2026-02-05', 'Feb 5, 2026', [sources.gpt53CodexLaunch]),
    tagline: 'Specialist coding model for serious autonomous work.',
    description:
      'GPT-5.3-Codex is the focused coder in the lineup: less of a generalist than GPT-5.4, but sharper when the mission is sustained engineering work with strong tool use.',
    accent: '#72d2ff',
    glow: 'rgba(114, 210, 255, 0.3)',
    orbit: 3,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt53CodexModel]),
    maxOutputTokens: metric(192_000, '192K tokens', [sources.gpt53CodexModel]),
    knowledgeCutoff: metric('2025-08-31', 'Aug 31, 2025', [sources.gpt53CodexModel]),
    inputPriceUsdPer1M: metric(1.5, '$1.50', [sources.gpt53CodexModel]),
    outputPriceUsdPer1M: metric(6, '$6.00', [sources.gpt53CodexModel]),
    cachedInputPriceUsdPer1M: metric(0.15, '$0.15', [sources.gpt53CodexModel]),
    reasoningControls: metric<string>(
      null,
      'Reasoning effort documented on the model page.',
      [sources.gpt53CodexModel]
    ),
    modalities: standardModalities(
      [sources.gpt53CodexModel, sources.gpt53CodexLaunch],
      'OpenAI highlights frontend work, screenshots, and computer-use-style workflows around this model.'
    ),
    toolSurfaceCount: metric(
      8,
      '8 explicitly highlighted coding workflow levers',
      [sources.gpt53CodexLaunch],
      'The launch emphasizes research, tool use, frontend work, monitoring/debugging, long runs, strong steerability, screenshots, and autonomous execution.'
    ),
    toolSummary: metric<string>(
      null,
      'The most coding-specialized model in the current lineup, with strong positioning for long autonomous runs.',
      [sources.gpt53CodexModel, sources.gpt53CodexLaunch]
    ),
    strengths: [
      point(
        'Top agentic coding positioning',
        'OpenAI describes GPT-5.3-Codex as its most capable agentic coding model.',
        [sources.gpt53CodexLaunch]
      ),
      point(
        'Faster than the previous Codex specialist',
        'OpenAI says it is 25% faster than GPT-5.2-Codex while also being more capable.',
        [sources.gpt53CodexLaunch]
      ),
    ],
    benchmarks: [
      point('SWE-Bench Verified', 'Launch benchmark.', [sources.gpt53CodexLaunch], '56.8%'),
      point('Terminal-Bench', 'Launch benchmark.', [sources.gpt53CodexLaunch], '74.0%'),
      point('SWE-Lancer Diamond', 'Launch benchmark.', [sources.gpt53CodexLaunch], '51.9%'),
    ],
    cautions: [
      point(
        'More specialized than GPT-5.4',
        'It shines in coding, but OpenAI’s broader model guide still points general buyers to GPT-5.4 first.',
        [sources.modelsOverview, sources.gpt53CodexLaunch]
      ),
      point(
        'Not the cheapest swarm option',
        'Its price sits well above GPT-5.4 mini and GPT-5.1-Codex-Mini.',
        [sources.gpt53CodexModel, sources.gpt54MiniModel, sources.gpt51CodexMiniModel]
      ),
    ],
    fitSignals: buildSignals({
      budget: [3, 'Mid-pack pricing: premium for swarm work, fair for specialist coding.', [sources.gpt53CodexModel]],
      coding: [5, 'OpenAI explicitly calls it the most capable agentic coding model.', [sources.gpt53CodexLaunch]],
      toolUse: [5, 'The launch is packed with tool-oriented and autonomous workflow positioning.', [sources.gpt53CodexLaunch]],
      multimodality: [4, 'Strong for screenshot- and UI-guided coding flows.', [sources.gpt53CodexModel, sources.gpt53CodexLaunch]],
      longContext: [4, '400K context plus very high max output make it comfortable in long coding sessions.', [sources.gpt53CodexModel]],
      stability: [4, 'Current specialist model, but more niche than the flagship GPT-5 line.', [sources.gpt53CodexLaunch, sources.modelsOverview]],
    }),
  },
  {
    id: 'gpt-5.2-codex',
    name: 'GPT-5.2-Codex',
    shortName: '5.2 codex',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Current Codex-era specialist model in OpenAI docs.',
    snapshotDate: checkedOn,
    releaseDate: metric('2025-12-18', 'Dec 18, 2025', [sources.gpt52CodexLaunch]),
    tagline: 'Long-horizon coding model with strong persistence.',
    description:
      'GPT-5.2-Codex is the long-run repo surgeon: not as new as GPT-5.3-Codex, but still heavily optimized for extended coding tasks, tool reliability, and compaction.',
    accent: '#7e9dff',
    glow: 'rgba(126, 157, 255, 0.3)',
    orbit: 4,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt52CodexModel]),
    maxOutputTokens: metric(192_000, '192K tokens', [sources.gpt52CodexModel]),
    knowledgeCutoff: metric('2025-08-31', 'Aug 31, 2025', [sources.gpt52CodexModel]),
    inputPriceUsdPer1M: metric(1.1, '$1.10', [sources.gpt52CodexModel]),
    outputPriceUsdPer1M: metric(4.4, '$4.40', [sources.gpt52CodexModel]),
    cachedInputPriceUsdPer1M: metric(0.11, '$0.11', [sources.gpt52CodexModel]),
    reasoningControls: metric<string>(
      null,
      'Reasoning effort documented on the model page.',
      [sources.gpt52CodexModel]
    ),
    modalities: standardModalities(
      [sources.gpt52CodexModel, sources.gpt52CodexLaunch],
      'The launch highlights design mockups, screenshots, and Windows support improvements for real coding workflows.'
    ),
    toolSurfaceCount: metric(
      7,
      '7 explicitly highlighted long-horizon coding levers',
      [sources.gpt52CodexLaunch],
      'The launch highlights reliable tool calling, native compaction, long-running sessions, screenshot interpretation, frontend implementation, diff review, and task persistence.'
    ),
    toolSummary: metric<string>(
      null,
      'Built for long coding runs with special attention to staying coherent as the session grows.',
      [sources.gpt52CodexModel, sources.gpt52CodexLaunch]
    ),
    strengths: [
      point(
        'Long-horizon fit',
        'OpenAI says GPT-5.2-Codex is optimized for long-horizon, agentic coding tasks.',
        [sources.gpt52CodexLaunch]
      ),
      point(
        'Native compaction',
        'The launch explicitly calls out native compaction to preserve context over longer sessions.',
        [sources.gpt52CodexLaunch]
      ),
    ],
    benchmarks: [
      point('SWE-Bench Verified', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '56.4%'),
      point('Terminal-Bench', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '64.0%'),
      point('SWE-Lancer Diamond', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '38.2%'),
    ],
    cautions: [
      point(
        'Superseded by GPT-5.3-Codex for top-end coding',
        'OpenAI’s next Codex release positions GPT-5.3-Codex as both faster and more capable.',
        [sources.gpt53CodexLaunch]
      ),
      point(
        'Specialist, not generalist',
        'It is most compelling when the task is sustained coding rather than mixed-mode professional work.',
        [sources.gpt52CodexLaunch, sources.modelsOverview]
      ),
    ],
    fitSignals: buildSignals({
      budget: [4, 'Cheaper than GPT-5.3-Codex and much cheaper than GPT-5.4.', [sources.gpt52CodexModel]],
      coding: [5, 'Still a top-tier coding specialist, even after GPT-5.3-Codex arrived.', [sources.gpt52CodexLaunch, sources.gpt53CodexLaunch]],
      toolUse: [4, 'Strong tool-reliability positioning, though the newer Codex model goes even further.', [sources.gpt52CodexLaunch, sources.gpt53CodexLaunch]],
      multimodality: [4, 'Useful for screenshot and UI implementation flows inside coding work.', [sources.gpt52CodexLaunch]],
      longContext: [5, 'OpenAI explicitly optimizes it for long-horizon work, not just raw context size.', [sources.gpt52CodexLaunch, sources.gpt52CodexModel]],
      stability: [4, 'Still current and documented, but no longer the newest specialist.', [sources.gpt52CodexLaunch, sources.gpt53CodexLaunch]],
    }),
  },
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    shortName: '5.2',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'General GPT-5 line model in current docs.',
    snapshotDate: checkedOn,
    releaseDate: metric('2025-12-11', 'Dec 11, 2025', [sources.gpt52Launch]),
    tagline: 'General-purpose professional model with strong document workflows.',
    description:
      'GPT-5.2 sits between the flagship and the specialists. It is stronger than earlier general models on tools, docs, slides, spreadsheets, and long-form work without leaning fully into Codex specialization.',
    accent: '#ffc66d',
    glow: 'rgba(255, 198, 109, 0.32)',
    orbit: 5,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt52Model]),
    maxOutputTokens: metric(128_000, '128K tokens', [sources.gpt52Model]),
    knowledgeCutoff: metric('2025-08-31', 'Aug 31, 2025', [sources.gpt52Model]),
    inputPriceUsdPer1M: metric(1.75, '$1.75', [sources.gpt52Model]),
    outputPriceUsdPer1M: metric(7, '$7.00', [sources.gpt52Model]),
    cachedInputPriceUsdPer1M: metric(0.175, '$0.175', [sources.gpt52Model]),
    reasoningControls: metric<string>(
      null,
      'Reasoning effort supports none, low, medium, high, and xhigh.',
      [sources.gpt52Model]
    ),
    modalities: standardModalities(
      [sources.gpt52Model, sources.gpt52Launch],
      'The launch highlights image-heavy and document-heavy workflows more than pure coding specialization.'
    ),
    toolSurfaceCount: metric(
      8,
      '8 explicitly highlighted professional-work levers',
      [sources.gpt52Launch],
      'The launch spotlights better tools, spreadsheets, presentations, long documents, image understanding, code, and compact-mode behavior.'
    ),
    toolSummary: metric<string>(
      null,
      'A very capable generalist for structured work that mixes code with docs, slides, spreadsheets, and research.',
      [sources.gpt52Model, sources.gpt52Launch]
    ),
    strengths: [
      point(
        'Best docs-and-decks fit in the general lineup',
        'OpenAI highlights GPT-5.2 improvements in spreadsheets, presentations, and long documents.',
        [sources.gpt52Launch]
      ),
      point(
        'Stronger tool use than earlier general models',
        'The launch explicitly frames GPT-5.2 as a step up in reliable tool use.',
        [sources.gpt52Launch]
      ),
    ],
    benchmarks: [
      point('SWE-Bench Verified', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '47.4%'),
      point('Terminal-Bench', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '51.8%'),
      point('SWE-Lancer Diamond', 'Published in the GPT-5.3-Codex comparison.', [sources.gpt53CodexLaunch], '26.3%'),
    ],
    cautions: [
      point(
        'Not as sharp for pure coding as the Codex variants',
        'OpenAI split the lineup so the Codex releases now own the most aggressive coding specialization.',
        [sources.gpt52Launch, sources.gpt53CodexLaunch]
      ),
      point(
        'Pricing is awkward versus GPT-5.4 mini',
        'GPT-5.4 mini is materially cheaper while remaining very strong for coding and tool use.',
        [sources.gpt52Model, sources.gpt54MiniModel]
      ),
    ],
    fitSignals: buildSignals({
      budget: [2, 'Not outrageously expensive, but it no longer looks efficient next to GPT-5.4 mini.', [sources.gpt52Model, sources.gpt54MiniModel]],
      coding: [4, 'Strong general coding, but below the Codex specialists and GPT-5.4.', [sources.gpt52Launch, sources.gpt53CodexLaunch]],
      toolUse: [5, 'OpenAI explicitly emphasizes tools and structured professional work.', [sources.gpt52Launch]],
      multimodality: [4, 'Good fit for screenshots, docs, and image-heavy professional tasks.', [sources.gpt52Model, sources.gpt52Launch]],
      longContext: [4, 'Solid 400K context and 128K output keep it comfortable on long docs and research work.', [sources.gpt52Model]],
      stability: [4, 'Still current, but no longer the newest GPT-5 release.', [sources.gpt52Launch, sources.gpt54Launch]],
    }),
  },
  {
    id: 'gpt-5.1-codex-max',
    name: 'GPT-5.1-Codex-Max',
    shortName: '5.1 max',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Specialized long-running Codex model still present in current surfaces.',
    snapshotDate: checkedOn,
    releaseDate: metric('2025-11-19', 'Nov 19, 2025', [sources.gpt51CodexMaxLaunch]),
    tagline: 'Older specialist still built for marathon coding sessions.',
    description:
      'GPT-5.1-Codex-Max is the stubborn grinder: older than the 5.2 and 5.3 lines, but still one of the most interesting models for extremely long, autonomous coding sessions.',
    accent: '#ff8f7c',
    glow: 'rgba(255, 143, 124, 0.3)',
    orbit: 6,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt51CodexMaxModel]),
    maxOutputTokens: metric(192_000, '192K tokens', [sources.gpt51CodexMaxModel]),
    knowledgeCutoff: metric('2024-09-30', 'Sep 30, 2024', [sources.gpt51CodexMaxModel]),
    inputPriceUsdPer1M: metric(1.5, '$1.50', [sources.gpt51CodexMaxModel]),
    outputPriceUsdPer1M: metric(6, '$6.00', [sources.gpt51CodexMaxModel]),
    cachedInputPriceUsdPer1M: metric(0.15, '$0.15', [sources.gpt51CodexMaxModel]),
    reasoningControls: metric<string>(
      null,
      'Supports reasoning effort with strong xhigh-style positioning in the launch.',
      [sources.gpt51CodexMaxModel, sources.gpt51CodexMaxLaunch]
    ),
    modalities: standardModalities(
      [sources.gpt51CodexMaxModel, sources.gpt51CodexMaxLaunch],
      'The launch centers long-running engineering more than general visual work, but image input is still supported.'
    ),
    toolSurfaceCount: metric(
      6,
      '6 explicitly highlighted marathon-coding levers',
      [sources.gpt51CodexMaxLaunch],
      'The launch highlights long-running task stamina, multi-window compaction, independent work over hours, code review, frontend coding, and CLI/agent workflows.'
    ),
    toolSummary: metric<string>(
      null,
      'Best interpreted as a durable long-run coding specialist rather than a modern default.',
      [sources.gpt51CodexMaxModel, sources.gpt51CodexMaxLaunch]
    ),
    strengths: [
      point(
        'Long-run persistence',
        'OpenAI says it can work independently for hours and compact across millions of tokens within a single task.',
        [sources.gpt51CodexMaxLaunch]
      ),
      point(
        'Token efficiency for hard work',
        'The launch says it uses 30% fewer thinking tokens than GPT-5.1 Codex on SWE-bench Verified.',
        [sources.gpt51CodexMaxLaunch]
      ),
    ],
    benchmarks: [],
    cautions: [
      point(
        'Knowledge cutoff is noticeably older',
        'Its knowledge cutoff predates the 5.2 and 5.4 lines by almost a year.',
        [sources.gpt51CodexMaxModel, sources.gpt54Model]
      ),
      point(
        'Older specialist lane',
        'Later releases now carry the newer official coding crown in OpenAI’s lineup.',
        [sources.gpt51CodexMaxLaunch, sources.gpt52CodexLaunch, sources.gpt53CodexLaunch]
      ),
    ],
    fitSignals: buildSignals({
      budget: [3, 'Reasonable for a specialist, but not the cheapest subagent choice.', [sources.gpt51CodexMaxModel]],
      coding: [4, 'Still strong, especially in marathon sessions, but later Codex models supersede it.', [sources.gpt51CodexMaxLaunch, sources.gpt53CodexLaunch]],
      toolUse: [4, 'Well suited to autonomous coding loops, though less current than the 5.3 release.', [sources.gpt51CodexMaxLaunch, sources.gpt53CodexLaunch]],
      multimodality: [3, 'Image input exists, but the official positioning is overwhelmingly coding-first.', [sources.gpt51CodexMaxModel, sources.gpt51CodexMaxLaunch]],
      longContext: [5, 'Its compaction story is one of the strongest in the lineup, even without the biggest raw window.', [sources.gpt51CodexMaxLaunch]],
      stability: [3, 'Still present, but clearly an older specialist compared with later GPT-5 releases.', [sources.gpt51CodexMaxLaunch, sources.gpt54Launch]],
    }),
  },
  {
    id: 'gpt-5.1-codex-mini',
    name: 'GPT-5.1-Codex-Mini',
    shortName: '5.1 mini',
    provider: 'OpenAI',
    status: 'stable',
    statusNote: 'Small Codex family model still available in current surfaces.',
    snapshotDate: checkedOn,
    releaseDate: metric(
      '2025-11-19',
      'Nov 19, 2025',
      [sources.codexReleaseNotes],
      'OpenAI release notes describe the GPT-5.1 Codex family rollout in ChatGPT and Codex.'
    ),
    tagline: 'Cheap Codex helper for delegated coding work.',
    description:
      'GPT-5.1-Codex-Mini is the lightweight helper model: much cheaper than the newer specialists, useful for swarm tasks, but clearly below the top lines on raw depth.',
    accent: '#ffb8ee',
    glow: 'rgba(255, 184, 238, 0.28)',
    orbit: 7,
    contextWindow: metric(400_000, '400K tokens', [sources.gpt51CodexMiniModel]),
    maxOutputTokens: metric(96_000, '96K tokens', [sources.gpt51CodexMiniModel]),
    knowledgeCutoff: metric('2024-09-30', 'Sep 30, 2024', [sources.gpt51CodexMiniModel]),
    inputPriceUsdPer1M: metric(0.2, '$0.20', [sources.gpt51CodexMiniModel]),
    outputPriceUsdPer1M: metric(0.8, '$0.80', [sources.gpt51CodexMiniModel]),
    cachedInputPriceUsdPer1M: metric(0.02, '$0.02', [sources.gpt51CodexMiniModel]),
    reasoningControls: metric<string>(
      null,
      'Reasoning token support documented on the model page.',
      [sources.gpt51CodexMiniModel]
    ),
    modalities: standardModalities(
      [sources.gpt51CodexMiniModel, sources.codexReleaseNotes],
      'A practical small model for coding support, not a premium visual or general-purpose model.'
    ),
    toolSurfaceCount: metric(
      4,
      '4 explicitly highlighted helper-model levers',
      [sources.gpt51CodexMiniModel, sources.codexReleaseNotes],
      'The strongest documented story here is low price, image input, reasoning support, and Codex-family availability.'
    ),
    toolSummary: metric<string>(
      null,
      'Best used as a cheap supporting model for parallel review, simple edits, and delegated code tasks.',
      [sources.gpt51CodexMiniModel, sources.codexReleaseNotes]
    ),
    strengths: [
      point(
        'Excellent swarm economics',
        'Its pricing is dramatically lower than every other model in the lineup.',
        [sources.gpt51CodexMiniModel]
      ),
      point(
        'Useful small Codex helper',
        'OpenAI release notes position the 5.1 Codex family directly inside Codex and ChatGPT workflows.',
        [sources.codexReleaseNotes]
      ),
    ],
    benchmarks: [],
    cautions: [
      point(
        'Older knowledge base',
        'Its 2024 knowledge cutoff trails every newer GPT-5 generation here.',
        [sources.gpt51CodexMiniModel, sources.gpt54Model]
      ),
      point(
        'Lower output headroom',
        'Its max output is materially smaller than the newer flagship and specialist models.',
        [sources.gpt51CodexMiniModel, sources.gpt53CodexModel, sources.gpt54Model]
      ),
    ],
    fitSignals: buildSignals({
      budget: [5, 'The cheapest model in the roster by a wide margin.', [sources.gpt51CodexMiniModel]],
      coding: [3, 'Useful for smaller coding tasks, but clearly below the flagship and specialist lines.', [sources.gpt51CodexMiniModel, sources.codexReleaseNotes]],
      toolUse: [3, 'A helper model rather than the place OpenAI concentrates its richest autonomous workflow story.', [sources.gpt51CodexMiniModel, sources.gpt53CodexLaunch]],
      multimodality: [3, 'Image input exists, but the small-model positioning limits how far it can carry complex visual workflows.', [sources.gpt51CodexMiniModel]],
      longContext: [3, '400K context is good on paper, but the model is not positioned as a marathon specialist.', [sources.gpt51CodexMiniModel, sources.gpt51CodexMaxLaunch]],
      stability: [3, 'Still available, but now clearly an older helper tier.', [sources.codexReleaseNotes, sources.gpt54MiniLaunch]],
    }),
  },
];

export function getAllCitations(models: ModelRecord[]): Citation[] {
  const map = new Map<string, Citation>();
  for (const model of models) {
    const buckets: Citation[][] = [
      model.releaseDate.citations,
      model.contextWindow.citations,
      model.maxOutputTokens.citations,
      model.knowledgeCutoff.citations,
      model.inputPriceUsdPer1M.citations,
      model.outputPriceUsdPer1M.citations,
      model.cachedInputPriceUsdPer1M.citations,
      model.reasoningControls.citations,
      model.modalities.citations,
      model.toolSurfaceCount.citations,
      model.toolSummary.citations,
      ...model.strengths.map((entry) => entry.citations),
      ...model.benchmarks.map((entry) => entry.citations),
      ...model.cautions.map((entry) => entry.citations),
      ...Object.values(model.fitSignals).map((entry) => entry.citations),
    ];

    for (const bucket of buckets) {
      for (const entry of bucket) {
        map.set(entry.id, entry);
      }
    }
  }

  return [...map.values()];
}
