import type { Citation, ModelRecord, PlannerAxis, RecommendationProfile, ScoredModel } from '../types';

interface MissionPlannerProps {
  models: ModelRecord[];
  scores: ScoredModel[];
  profile: RecommendationProfile;
  onProfileChange: (axis: PlannerAxis, value: number) => void;
  onStableToggle: (value: boolean) => void;
  onSelectModel: (modelId: string) => void;
  onToggleCompare: (modelId: string) => void;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}

const controls: Array<{ axis: PlannerAxis; label: string; note: string }> = [
  { axis: 'budget', label: 'Budget sensitivity', note: 'Favors low published token cost.' },
  { axis: 'coding', label: 'Coding strength', note: 'Blends provider coding positioning with context and output room.' },
  { axis: 'toolUse', label: 'Tool use', note: 'Favors documented tool surfaces and agent positioning.' },
  { axis: 'multimodality', label: 'Multimodality', note: 'Rewards broader native media input coverage.' },
  { axis: 'longContext', label: 'Long context', note: 'Rewards larger published context + output budgets.' },
  { axis: 'stability', label: 'Stability', note: 'Rewards active shipping models over preview or beta entries.' },
];

export function MissionPlanner({
  models,
  scores,
  profile,
  onProfileChange,
  onStableToggle,
  onSelectModel,
  onToggleCompare,
  onInspectCitations,
}: MissionPlannerProps) {
  const topModel = models.find((model) => model.id === scores[0]?.modelId) ?? models[0];
  const topSignals = Object.entries(scores[0]?.breakdown ?? {})
    .sort((left, right) => right[1].contribution - left[1].contribution)
    .slice(0, 2);

  return (
    <section className="glass-panel">
      <div className="eyebrow">Mission planner</div>
      <h2 className="panel-title mt-3 text-3xl font-semibold">Tune the buyer profile</h2>
      <p className="mt-3 text-sm text-muted md:text-[15px]">
        The planner score is a weighted average of six axes. Provider-positioning signals stay capped inside each axis,
        so the recommendation cannot outrank hard specs by itself.
      </p>

      <div className="mt-6 grid gap-4">
        {controls.map((control) => (
          <label key={control.axis} className="control-surface block">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{control.label}</p>
                <p className="mt-1 text-xs text-muted">{control.note}</p>
              </div>
              <span className="badge">{profile[control.axis]}</span>
            </div>
            <input
              aria-label={control.label}
              className="range-input mt-4 w-full"
              type="range"
              min="0"
              max="100"
              step="1"
              value={profile[control.axis]}
              onChange={(event) => onProfileChange(control.axis, Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <label className="control-surface mt-4 flex cursor-pointer items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Prefer shipping-stable releases</p>
          <p className="mt-1 text-xs text-muted">
            When enabled, preview and beta models take a visible stability hit in the planner.
          </p>
        </div>
        <input
          aria-label="Prefer shipping-stable releases"
          checked={profile.preferStableReleases}
          type="checkbox"
          onChange={(event) => onStableToggle(event.target.checked)}
        />
      </label>

      <article className="control-surface mt-6 border-[rgba(99,240,209,0.16)] bg-[rgba(99,240,209,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">Top recommendation</span>
          <span className="badge" style={{ color: topModel.accent }}>
            {scores[0]?.totalScore ?? 0}
          </span>
        </div>
        <h3 className="panel-title mt-4 text-2xl font-semibold">{topModel.name}</h3>
        <p className="mt-2 text-sm text-muted">{scores[0]?.explanation ?? topModel.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {topSignals.map(([axis, detail]) => (
            <span key={axis} className="badge border-[rgba(99,240,209,0.18)] bg-[rgba(99,240,209,0.06)]">
              {detail.label} {detail.rawScore}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="badge" onClick={() => onSelectModel(topModel.id)}>
            Focus in atlas
          </button>
          <button type="button" className="badge" onClick={() => onToggleCompare(topModel.id)}>
            Pin for compare
          </button>
          <button
            type="button"
            className="badge"
            onClick={() =>
              onInspectCitations(
                `${topModel.name} planner signals`,
                Object.values(topModel.fitSignals).flatMap((entry) => entry.citations)
              )
            }
          >
            Open planner evidence
          </button>
        </div>
      </article>

      <div className="mt-6 space-y-3">
        {scores.map((score) => {
          const model = models.find((entry) => entry.id === score.modelId);
          if (!model) return null;

          return (
            <article key={model.id} data-testid={`recommendation-card-${model.id}`} className="control-surface">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{model.provider}</span>
                    <span className="badge">{model.status}</span>
                  </div>
                  <h3 className="panel-title mt-3 text-xl font-semibold">{model.name}</h3>
                  <p className="mt-1 text-sm text-muted">{score.explanation}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Planner fit</p>
                  <p className="panel-title mt-1 text-3xl font-semibold" style={{ color: model.accent }}>
                    {score.totalScore}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {Object.values(score.breakdown).map((detail) => (
                  <div key={detail.axis}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted">
                      <span>{detail.label}</span>
                      <span>
                        raw {detail.rawScore} · weight {detail.weight}
                      </span>
                    </div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${detail.rawScore}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="badge" onClick={() => onSelectModel(model.id)}>
                  Focus model
                </button>
                <button type="button" className="badge" onClick={() => onToggleCompare(model.id)}>
                  Toggle compare
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
