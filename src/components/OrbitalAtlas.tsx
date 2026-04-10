import { motion } from 'framer-motion';
import { Eye, Radar, Sparkles } from 'lucide-react';
import type { Citation, ModelRecord, ScoredModel } from '../types';

interface OrbitalAtlasProps {
  models: ModelRecord[];
  scores: ScoredModel[];
  selectedModelId: string;
  comparisonIds: string[];
  onSelectModel: (modelId: string) => void;
  onToggleCompare: (modelId: string) => void;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}

const placements: Record<string, { top: string; left: string }> = {
  'gpt-5.4': { top: '18%', left: '49%' },
  'gpt-5.4-mini': { top: '31%', left: '78%' },
  'gpt-5.3-codex': { top: '57%', left: '82%' },
  'gpt-5.2-codex': { top: '76%', left: '62%' },
  'gpt-5.2': { top: '78%', left: '36%' },
  'gpt-5.1-codex-max': { top: '53%', left: '18%' },
  'gpt-5.1-codex-mini': { top: '28%', left: '22%' },
};

function sizeForContext(value: number | null): number {
  if (value === null) return 74;
  return Math.min(94, Math.max(70, 64 + Math.round((value / 1_000_000) * 20)));
}

export function OrbitalAtlas({
  models,
  scores,
  selectedModelId,
  comparisonIds,
  onSelectModel,
  onToggleCompare,
  onInspectCitations,
}: OrbitalAtlasProps) {
  const selectedModel = models.find((model) => model.id === selectedModelId) ?? models[0];
  const selectedScore = scores.find((entry) => entry.modelId === selectedModel.id);
  const selectedCitationSet = [
    ...selectedModel.releaseDate.citations,
    ...selectedModel.contextWindow.citations,
    ...selectedModel.inputPriceUsdPer1M.citations,
    ...selectedModel.reasoningControls.citations,
  ];

  return (
    <section className="glass-panel atlas-shell subtle-grid">
      <div className="scan-line" />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="eyebrow">
            <Radar size={14} />
            Orbital atlas
          </div>
          <h2 className="panel-title mt-3 text-3xl font-semibold">Where the seven-model roster sits in the field</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-[15px]">
            Node size hints at published context budget, glow color marks the model lane, and the compare markers let
            you throw any entry straight into the evidence console.
          </p>
        </div>
        <button
          type="button"
          className="badge self-start border-[rgba(99,240,209,0.18)] bg-[rgba(99,240,209,0.06)] text-[rgba(218,255,247,0.92)]"
          onClick={() => onInspectCitations(`${selectedModel.name} focus sources`, selectedCitationSet)}
        >
          <Eye size={14} />
          Inspect focus sources
        </button>
      </div>

      <div className="relative mt-8 min-h-[28rem]">
        <div className="atlas-ring h-[14rem] w-[14rem]" />
        <div className="atlas-ring h-[22rem] w-[22rem]" />
        <div className="atlas-ring h-[30rem] w-[30rem]" />
        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(122,184,255,0.2)] bg-[rgba(7,18,28,0.85)] text-center shadow-[0_0_40px_rgba(122,184,255,0.15)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(171,255,237,0.75)]">Observer</p>
            <p className="panel-title mt-2 text-lg font-semibold">Buyer guide</p>
          </div>
        </div>

        {models.map((model) => {
          const placement = placements[model.id];
          const selected = model.id === selectedModel.id;
          const compared = comparisonIds.includes(model.id);
          const score = scores.find((entry) => entry.modelId === model.id);
          const size = sizeForContext(model.contextWindow.value);

          return (
            <motion.div
              key={model.id}
              className="atlas-node"
              style={{ top: placement.top, left: placement.left }}
              animate={{ scale: selected ? 1.04 : 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            >
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`Focus ${model.name}`}
                onClick={() => onSelectModel(model.id)}
                className="flex flex-col items-center justify-center p-3 text-center shadow-[0_0_34px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:-translate-y-1"
                style={{
                  width: size,
                  height: size,
                  boxShadow: `0 0 26px ${model.glow}`,
                  borderColor: selected ? model.accent : 'rgba(255,255,255,0.08)',
                }}
              >
                <span
                  className={selected ? 'absolute inset-[-10px] rounded-full animate-pulse-slow' : 'absolute inset-[-10px] rounded-full'}
                  style={{
                    border: `1px dashed ${selected ? model.accent : 'rgba(255,255,255,0.06)'}`,
                  }}
                />
                <span className="panel-title text-sm font-semibold leading-tight">{model.shortName}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">{model.provider}</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span
                  className="badge border-transparent bg-[rgba(255,255,255,0.04)] px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: model.accent }}
                >
                  {model.status}
                </span>
                <span className="badge border-transparent bg-[rgba(255,255,255,0.04)] px-2 py-1 text-[10px]">
                  {score?.totalScore ?? '0'}
                </span>
                {compared && (
                  <span className="badge border-[rgba(255,183,118,0.18)] bg-[rgba(255,183,118,0.08)] px-2 py-1 text-[10px] text-[rgba(255,236,219,0.92)]">
                    Compare
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <article data-testid="atlas-focus" className="control-surface">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow" style={{ background: `${selectedModel.glow}`, color: selectedModel.accent }}>
              <Sparkles size={14} />
              Focus model
            </span>
            <span className="badge">{selectedModel.provider}</span>
            <span className="badge">{selectedModel.status}</span>
            <span className="badge">Planner fit {selectedScore?.totalScore ?? '0'}</span>
          </div>
          <h3 className="panel-title mt-4 text-2xl font-semibold">{selectedModel.name}</h3>
          <p className="mt-2 text-sm text-muted">{selectedModel.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="metric-row">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Context window</p>
                <p className="mt-1 text-lg font-semibold">{selectedModel.contextWindow.display}</p>
              </div>
              <button
                type="button"
                className="badge self-start"
                onClick={() =>
                  onInspectCitations(`${selectedModel.name} context sources`, selectedModel.contextWindow.citations)
                }
              >
                Source
              </button>
            </div>
            <div className="metric-row">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Price</p>
                <p className="mt-1 text-lg font-semibold">
                  {selectedModel.inputPriceUsdPer1M.display} / {selectedModel.outputPriceUsdPer1M.display}
                </p>
              </div>
              <button
                type="button"
                className="badge self-start"
                onClick={() =>
                  onInspectCitations(`${selectedModel.name} pricing sources`, [
                    ...selectedModel.inputPriceUsdPer1M.citations,
                    ...selectedModel.outputPriceUsdPer1M.citations,
                  ])
                }
              >
                Source
              </button>
            </div>
          </div>
        </article>

        <article className="control-surface">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Comparison tray</p>
              <p className="mt-1 text-sm text-muted">Choose any two models to inspect side-by-side below.</p>
            </div>
            <button
              type="button"
              className="badge border-[rgba(99,240,209,0.18)] bg-[rgba(99,240,209,0.06)] text-[rgba(218,255,247,0.92)]"
              onClick={() => onToggleCompare(selectedModel.id)}
            >
              {comparisonIds.includes(selectedModel.id) ? 'Unpin' : 'Pin'} focus model
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {models.map((model) => {
              const active = comparisonIds.includes(model.id);

              return (
                <button
                  key={model.id}
                  type="button"
                  className="badge transition-colors"
                  style={{
                    borderColor: active ? model.accent : 'rgba(172,216,255,0.16)',
                    background: active ? `${model.glow}` : 'rgba(255,255,255,0.03)',
                  }}
                  onClick={() => onToggleCompare(model.id)}
                >
                  {model.shortName}
                </button>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
