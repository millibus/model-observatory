import { startTransition, useDeferredValue, useState } from 'react';
import { BrainCircuit, Crosshair, DatabaseZap, Sparkles } from 'lucide-react';
import { CaveatStrip } from './components/CaveatStrip';
import { CitationDrawer } from './components/CitationDrawer';
import { EvidenceConsole } from './components/EvidenceConsole';
import { OrbitalAtlas } from './components/OrbitalAtlas';
import { TaskMixer } from './components/TaskMixer';
import { TradeoffScanner, type ScannerMetric } from './components/TradeoffScanner';
import { getAllCitations, MODELS } from './data/models';
import { buildProfileFromTaskMix, DEFAULT_TASK_MIX, type TaskMix, type TaskScenarioId } from './data/tasks';
import { computePlannerScores } from './lib/scoring';
import type { Citation } from './types';

interface CitationState {
  title: string;
  citations: Citation[];
}

function dedupeCitations(citations: Citation[]): Citation[] {
  const map = new Map<string, Citation>();
  for (const citation of citations) {
    map.set(citation.id, citation);
  }
  return [...map.values()];
}

export default function App() {
  const [taskMix, setTaskMix] = useState<TaskMix>(DEFAULT_TASK_MIX);
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['gpt-5.4-mini', 'gpt-5.3-codex']);
  const [xMetric, setXMetric] = useState<ScannerMetric>('plannerScore');
  const [yMetric, setYMetric] = useState<ScannerMetric>('deep-refactors');
  const [citationState, setCitationState] = useState<CitationState>({
    title: 'Model Observatory source deck',
    citations: getAllCitations(MODELS),
  });

  const profile = buildProfileFromTaskMix(taskMix);
  const deferredProfile = useDeferredValue(profile);
  const scores = computePlannerScores(MODELS, deferredProfile);

  const selectedModel = MODELS.find((model) => model.id === selectedModelId) ?? MODELS[0];
  const winner = MODELS.find((model) => model.id === scores[0]?.modelId) ?? MODELS[0];

  function updateTaskMix(taskId: TaskScenarioId, value: number) {
    setTaskMix((current) => ({
      ...current,
      [taskId]: value,
    }));
  }

  function applyPreset(nextMix: TaskMix) {
    startTransition(() => {
      setTaskMix(nextMix);
    });
  }

  function toggleCompare(modelId: string) {
    setComparisonIds((current) => {
      if (current.includes(modelId)) {
        const next = current.filter((entry) => entry !== modelId);
        return next.length > 0 ? next : [modelId];
      }

      if (current.length < 2) {
        return [...current, modelId];
      }

      return [current[1], modelId];
    });
  }

  function inspectCitations(title: string, citations: Citation[]) {
    setCitationState({
      title,
      citations: dedupeCitations(citations),
    });
  }

  function handleMetricChange(axis: 'x' | 'y', value: ScannerMetric) {
    startTransition(() => {
      if (axis === 'x') {
        setXMetric(value);
      } else {
        setYMetric(value);
      }
    });
  }

  const missionSummary = `${winner.name} is currently the strongest fit for this workload mix. ${
    scores[0]?.explanation ?? ''
  }`;

  return (
    <div className="observatory-shell">
      <div className="hero-halo" />
      <main className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="eyebrow">
                <Sparkles size={14} />
                Orbital observatory
              </div>
              <h1 className="panel-title mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Model Observatory
              </h1>
              <p className="mt-5 max-w-3xl text-base text-muted md:text-lg">
                A mission-control comparison deck for GPT-5.4, GPT-5.4-Mini, GPT-5.3-Codex, GPT-5.2-Codex, GPT-5.2,
                GPT-5.1-Codex-Max, and GPT-5.1-Codex-Mini. Hard specs come first, OpenAI release positioning stays
                labeled, and the task heatmap lets you remix the workload instead of staring at one fake leaderboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
              <article className="control-surface">
                <div className="badge w-fit">
                  <Crosshair size={14} />
                  Snapshot
                </div>
                <p className="panel-title mt-3 text-2xl font-semibold">2026-04-02</p>
                <p className="mt-2 text-sm text-muted">Official OpenAI docs, model pages, and release posts only.</p>
              </article>
              <article className="control-surface">
                <div className="badge w-fit">
                  <BrainCircuit size={14} />
                  Current fit
                </div>
                <p className="panel-title mt-3 text-2xl font-semibold">{scores[0]?.totalScore ?? 0}</p>
                <p className="mt-2 text-sm text-muted">{winner.shortName}</p>
              </article>
              <article className="control-surface">
                <div className="badge w-fit">
                  <DatabaseZap size={14} />
                  Selected
                </div>
                <p className="panel-title mt-3 text-2xl font-semibold">{selectedModel.shortName}</p>
                <p className="mt-2 text-sm text-muted">{selectedModel.provider}</p>
              </article>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
            <article className="control-surface border-[rgba(99,240,209,0.16)] bg-[rgba(99,240,209,0.05)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[rgba(171,255,237,0.78)]">Mission readout</p>
              <p className="mt-3 text-lg text-[rgba(226,255,248,0.95)]">{missionSummary}</p>
            </article>
            <article className="control-surface">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Recommendation formula</p>
              <p className="mt-3 text-sm text-muted">
                Final score = your task mix translated into weighted budget, coding, tool use, multimodality,
                long-context, and recency signals. Release positioning is blended into each axis, not treated as a
                universal benchmark.
              </p>
            </article>
          </div>
        </header>

        <div className="mt-6">
          <CaveatStrip />
        </div>

        <div className="mt-6 grid gap-6 2xl:grid-cols-[1.15fr,0.85fr]">
          <OrbitalAtlas
            models={MODELS}
            scores={scores}
            selectedModelId={selectedModelId}
            comparisonIds={comparisonIds}
            onSelectModel={setSelectedModelId}
            onToggleCompare={toggleCompare}
            onInspectCitations={inspectCitations}
          />
          <TaskMixer
            models={MODELS}
            scores={scores}
            taskMix={taskMix}
            onTaskMixChange={updateTaskMix}
            onApplyPreset={applyPreset}
            onSelectModel={setSelectedModelId}
            onToggleCompare={toggleCompare}
            onInspectCitations={inspectCitations}
          />
        </div>

        <div className="mt-6">
          <TradeoffScanner
            models={MODELS}
            scores={scores}
            xMetric={xMetric}
            yMetric={yMetric}
            onMetricChange={handleMetricChange}
            onInspectCitations={inspectCitations}
          />
        </div>

        <div className="mt-6">
          <EvidenceConsole models={MODELS.filter((model) => comparisonIds.includes(model.id))} scores={scores} onInspectCitations={inspectCitations} />
        </div>

        <CitationDrawer title={citationState.title} citations={citationState.citations} />
      </main>
    </div>
  );
}
