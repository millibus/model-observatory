import type { Citation, CitedMetric, EvidencePoint, ModelRecord, ScoredModel } from '../types';

interface EvidenceConsoleProps {
  models: ModelRecord[];
  scores: ScoredModel[];
  onInspectCitations: (title: string, citations: Citation[]) => void;
}

function MetricCard({
  model,
  label,
  metric,
  onInspectCitations,
}: {
  model: ModelRecord;
  label: string;
  metric: CitedMetric<unknown>;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}) {
  return (
    <div className="metric-row">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{metric.display}</p>
        {metric.note ? <p className="mt-1 text-xs text-muted">{metric.note}</p> : null}
      </div>
      <button
        type="button"
        className="badge self-start"
        aria-label={`Open citations for ${model.name} ${label}`}
        onClick={() => onInspectCitations(`${model.name} ${label} sources`, metric.citations)}
      >
        Source
      </button>
    </div>
  );
}

function EvidenceList({
  model,
  title,
  entries,
  emptyLabel,
  onInspectCitations,
}: {
  model: ModelRecord;
  title: string;
  entries: EvidencePoint[];
  emptyLabel: string;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h4 className="panel-title text-lg font-semibold">{title}</h4>
        {entries.length > 0 ? (
          <button
            type="button"
            className="badge"
            onClick={() =>
              onInspectCitations(
                `${model.name} ${title.toLowerCase()} sources`,
                entries.flatMap((entry) => entry.citations)
              )
            }
          >
            Open all
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {entries.map((entry) => (
            <article key={`${title}-${entry.title}`} className="metric-row">
              <div>
                <p className="text-sm font-semibold text-white">
                  {entry.title}
                  {entry.result ? <span className="ml-2 text-[rgba(171,255,237,0.88)]">{entry.result}</span> : null}
                </p>
                <p className="mt-2 text-sm text-muted">{entry.detail}</p>
              </div>
              <button
                type="button"
                className="badge self-start"
                onClick={() => onInspectCitations(`${model.name} ${entry.title} sources`, entry.citations)}
              >
                Source
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function EvidenceConsole({ models, scores, onInspectCitations }: EvidenceConsoleProps) {
  const scoreMap = new Map(scores.map((entry) => [entry.modelId, entry]));

  return (
    <section className="glass-panel">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">Evidence console</div>
          <h2 className="panel-title mt-3 text-3xl font-semibold">Read the facts, not just the fit score</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted md:text-[15px]">
            Every card shows published specs, release claims, benchmark snippets, and caveats side-by-side. This is
            where the dashboard exposes what it knows, what is missing, and why the ranking behaves the way it does.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {models.map((model) => {
          const score = scoreMap.get(model.id);

          return (
            <article key={model.id} className="control-surface">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge">{model.provider}</span>
                    <span className="badge">{model.status}</span>
                    <span className="badge">fit {score?.totalScore ?? 0}</span>
                  </div>
                  <h3 className="panel-title mt-3 text-2xl font-semibold" style={{ color: model.accent }}>
                    {model.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{model.tagline}</p>
                </div>
                <button
                  type="button"
                  className="badge self-start"
                  onClick={() =>
                    onInspectCitations(`${model.name} score formulas`, Object.values(model.fitSignals).flatMap((entry) => entry.citations))
                  }
                >
                  Planner signals
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetricCard model={model} label="Release" metric={model.releaseDate} onInspectCitations={onInspectCitations} />
                <MetricCard model={model} label="Context window" metric={model.contextWindow} onInspectCitations={onInspectCitations} />
                <MetricCard model={model} label="Max output" metric={model.maxOutputTokens} onInspectCitations={onInspectCitations} />
                <MetricCard model={model} label="Knowledge cutoff" metric={model.knowledgeCutoff} onInspectCitations={onInspectCitations} />
                <MetricCard model={model} label="Input price" metric={model.inputPriceUsdPer1M} onInspectCitations={onInspectCitations} />
                <MetricCard model={model} label="Output price" metric={model.outputPriceUsdPer1M} onInspectCitations={onInspectCitations} />
                <MetricCard
                  model={model}
                  label="Cached input"
                  metric={model.cachedInputPriceUsdPer1M}
                  onInspectCitations={onInspectCitations}
                />
                <MetricCard model={model} label="Reasoning" metric={model.reasoningControls} onInspectCitations={onInspectCitations} />
                <MetricCard
                  model={model}
                  label="Tool summary"
                  metric={model.toolSummary}
                  onInspectCitations={onInspectCitations}
                />
                <div className="metric-row">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">Native modalities</p>
                    <p className="mt-1 text-sm font-semibold text-white">{model.modalities.display}</p>
                    {model.modalities.note ? <p className="mt-1 text-xs text-muted">{model.modalities.note}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="badge self-start"
                    onClick={() =>
                      onInspectCitations(`${model.name} modality sources`, model.modalities.citations)
                    }
                  >
                    Source
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <EvidenceList
                  model={model}
                  title="Strengths"
                  entries={model.strengths}
                  emptyLabel="No extra strengths list for this model."
                  onInspectCitations={onInspectCitations}
                />
                <EvidenceList
                  model={model}
                  title="Benchmarks"
                  entries={model.benchmarks}
                  emptyLabel="No direct benchmark snapshot was included in the cited vendor pages used for this model."
                  onInspectCitations={onInspectCitations}
                />
                <EvidenceList
                  model={model}
                  title="Cautions"
                  entries={model.cautions}
                  emptyLabel="No additional caution entries for this model."
                  onInspectCitations={onInspectCitations}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
