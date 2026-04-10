import {
  Bot,
  FileText,
  GitBranchPlus,
  Gauge,
  Layers3,
  Palette,
  Rocket,
  SlidersHorizontal,
} from 'lucide-react';
import { TASK_PRESETS, TASK_SCENARIOS, type TaskMix, type TaskScenarioId } from '../data/tasks';
import { computePlannerScores } from '../lib/scoring';
import type { Citation, ModelRecord, ScoredModel } from '../types';

interface TaskMixerProps {
  models: ModelRecord[];
  scores: ScoredModel[];
  taskMix: TaskMix;
  onTaskMixChange: (taskId: TaskScenarioId, value: number) => void;
  onApplyPreset: (taskMix: TaskMix) => void;
  onSelectModel: (modelId: string) => void;
  onToggleCompare: (modelId: string) => void;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}

const icons = {
  'quick-fixes': Gauge,
  'feature-shipping': Rocket,
  'deep-refactors': GitBranchPlus,
  'tool-orchestration': Bot,
  'visual-ui': Palette,
  'docs-and-decks': FileText,
  'budget-swarms': Layers3,
} as const;

function taskSources(model: ModelRecord): Citation[] {
  return [
    ...model.releaseDate.citations,
    ...model.contextWindow.citations,
    ...model.inputPriceUsdPer1M.citations,
    ...model.toolSummary.citations,
    ...Object.values(model.fitSignals).flatMap((entry) => entry.citations),
    ...model.strengths.flatMap((entry) => entry.citations),
  ];
}

function scoreForModel(scores: ScoredModel[], modelId: string): number {
  return scores.find((entry) => entry.modelId === modelId)?.totalScore ?? 0;
}

export function TaskMixer({
  models,
  scores,
  taskMix,
  onTaskMixChange,
  onApplyPreset,
  onSelectModel,
  onToggleCompare,
  onInspectCitations,
}: TaskMixerProps) {
  const scenarioBoards = TASK_SCENARIOS.map((scenario) => ({
    scenario,
    scores: computePlannerScores(models, scenario.profile),
  }));

  const winner = models.find((model) => model.id === scores[0]?.modelId) ?? models[0];
  const totalIntensity = Object.values(taskMix).reduce((sum, value) => sum + value, 0);
  const dominantTasks = [...TASK_SCENARIOS]
    .sort((left, right) => taskMix[right.id] - taskMix[left.id])
    .slice(0, 3)
    .filter((scenario) => taskMix[scenario.id] > 0);

  return (
    <section className="glass-panel">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">
            <SlidersHorizontal size={14} />
            Task mixer
          </div>
          <h2 className="panel-title mt-3 text-3xl font-semibold">Blend the workload, then watch the ranking move</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted md:text-[15px]">
            Each slider represents a real task shape, not a raw benchmark. The matrix shows who leads in each lane,
            and the overall ranking on the right blends only the workloads you care about.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TASK_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="badge transition-colors hover:bg-[rgba(255,255,255,0.08)]"
              onClick={() => onApplyPreset({ ...preset.weights })}
              title={preset.note}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[0.92fr,1.08fr]">
        <div className="space-y-4">
          {TASK_SCENARIOS.map((scenario) => {
            const Icon = icons[scenario.id];
            const board = scenarioBoards.find((entry) => entry.scenario.id === scenario.id);
            const taskWinner = models.find((model) => model.id === board?.scores[0]?.modelId) ?? models[0];

            return (
              <article key={scenario.id} className="control-surface">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                      style={{
                        borderColor: `${scenario.accent}44`,
                        background: `${scenario.accent}12`,
                        color: scenario.accent,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{scenario.name}</p>
                      <p className="mt-1 text-xs text-muted">{scenario.note}</p>
                    </div>
                  </div>
                  <span className="badge">{taskMix[scenario.id]}</span>
                </div>
                <input
                  aria-label={scenario.name}
                  className="range-input mt-4 w-full"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={taskMix[scenario.id]}
                  onChange={(event) => onTaskMixChange(scenario.id, Number(event.target.value))}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge" style={{ borderColor: `${scenario.accent}44`, color: scenario.accent }}>
                    Winner {taskWinner.shortName}
                  </span>
                  <button
                    type="button"
                    className="badge"
                    onClick={() => onSelectModel(taskWinner.id)}
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    className="badge"
                    onClick={() => onInspectCitations(`${taskWinner.name} for ${scenario.name}`, taskSources(taskWinner))}
                  >
                    Why
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <article className="control-surface border-[rgba(113,247,191,0.18)] bg-[rgba(113,247,191,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(193,255,230,0.84)]">Current blend</p>
                <h3 className="panel-title mt-3 text-3xl font-semibold">{winner.name}</h3>
                <p className="mt-2 max-w-2xl text-sm text-[rgba(226,255,248,0.9)]">
                  Best match for your current task stack, led by{' '}
                  {dominantTasks.length > 0
                    ? dominantTasks.map((scenario) => scenario.shortName.toLowerCase()).join(', ')
                    : 'no active workload priorities'}
                  .
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[18rem]">
                <div className="badge justify-center border-[rgba(113,247,191,0.18)] bg-[rgba(255,255,255,0.04)] py-2">
                  Blend score {scores[0]?.totalScore ?? 0}
                </div>
                <div className="badge justify-center border-[rgba(113,247,191,0.18)] bg-[rgba(255,255,255,0.04)] py-2">
                  Active load {totalIntensity}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="badge" onClick={() => onSelectModel(winner.id)}>
                Focus winner
              </button>
              <button type="button" className="badge" onClick={() => onToggleCompare(winner.id)}>
                Pin winner
              </button>
              <button
                type="button"
                className="badge"
                onClick={() => onInspectCitations(`${winner.name} blended recommendation`, taskSources(winner))}
              >
                Open evidence
              </button>
            </div>
          </article>

          <article className="control-surface">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Task heatmap</p>
                <p className="mt-1 text-sm text-muted">Each cell is that model’s fit for one task profile.</p>
              </div>
              <span className="badge">Click a row score to focus the model</span>
            </div>

            <div className="task-matrix mt-4">
              <div className="task-matrix-header" />
              {TASK_SCENARIOS.map((scenario) => (
                <div key={scenario.id} className="task-matrix-header" title={scenario.description}>
                  {scenario.shortName}
                </div>
              ))}

              {models.map((model) => (
                <div key={model.id} className="contents">
                  <button
                    type="button"
                    className="task-model-name"
                    onClick={() => onSelectModel(model.id)}
                  >
                    <span className="panel-title text-sm font-semibold" style={{ color: model.accent }}>
                      {model.shortName}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted">OpenAI</span>
                  </button>

                  {scenarioBoards.map(({ scenario, scores: scenarioScores }) => {
                    const value = scoreForModel(scenarioScores, model.id);
                    const winnerId = scenarioScores[0]?.modelId;
                    const active = winnerId === model.id;

                    return (
                      <button
                        key={`${model.id}-${scenario.id}`}
                        type="button"
                        className="task-cell"
                        style={{
                          background: `linear-gradient(180deg, ${scenario.accent}${active ? '38' : '20'}, rgba(9,22,35,0.92))`,
                          borderColor: active ? `${scenario.accent}88` : 'rgba(172,216,255,0.12)',
                          boxShadow: active ? `0 0 22px ${scenario.accent}25` : 'none',
                        }}
                        title={`${model.name} on ${scenario.name}: ${value.toFixed(1)}`}
                        onClick={() => onSelectModel(model.id)}
                      >
                        <span className="task-cell-score">{value.toFixed(1)}</span>
                        {active ? <span className="task-cell-tag">Lead</span> : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </article>

          <article className="control-surface">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Overall ranking</p>
            <div className="mt-4 space-y-3">
              {scores.map((score) => {
                const model = models.find((entry) => entry.id === score.modelId);
                if (!model) return null;

                return (
                  <div key={model.id} className="rounded-2xl border border-[rgba(172,216,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="panel-title text-lg font-semibold" style={{ color: model.accent }}>
                          {model.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">{score.explanation}</p>
                      </div>
                      <button
                        type="button"
                        className="badge"
                        onClick={() => onToggleCompare(model.id)}
                      >
                        {score.totalScore}
                      </button>
                    </div>
                    <div className="score-bar mt-3">
                      <div className="score-fill" style={{ width: `${score.totalScore}%`, background: model.accent }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
