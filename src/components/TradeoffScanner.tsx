import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { TASK_SCENARIOS, type TaskScenarioId } from '../data/tasks';
import { computePlannerScores } from '../lib/scoring';
import type { Citation, ModelRecord, ScoredModel } from '../types';

type BaseScannerMetric =
  | 'inputPrice'
  | 'outputPrice'
  | 'contextWindow'
  | 'maxOutputTokens'
  | 'plannerScore'
  | 'stabilityScore';

export type ScannerMetric = BaseScannerMetric | TaskScenarioId;

interface TradeoffScannerProps {
  models: ModelRecord[];
  scores: ScoredModel[];
  xMetric: ScannerMetric;
  yMetric: ScannerMetric;
  onMetricChange: (axis: 'x' | 'y', value: ScannerMetric) => void;
  onInspectCitations: (title: string, citations: Citation[]) => void;
}

interface ScannerPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  fill: string;
}

const options: Array<{ value: ScannerMetric; label: string }> = [
  { value: 'inputPrice', label: 'Input price' },
  { value: 'outputPrice', label: 'Output price' },
  { value: 'contextWindow', label: 'Context window' },
  { value: 'maxOutputTokens', label: 'Max output' },
  { value: 'plannerScore', label: 'Planner fit' },
  { value: 'stabilityScore', label: 'Stability score' },
  ...TASK_SCENARIOS.map((scenario) => ({
    value: scenario.id,
    label: `${scenario.name} fit`,
  })),
];

function valueForMetric(
  model: ModelRecord,
  score: ScoredModel,
  metric: ScannerMetric,
  scenarioScoreMap: Map<string, number>
): number {
  switch (metric) {
    case 'inputPrice':
      return model.inputPriceUsdPer1M.value ?? 0;
    case 'outputPrice':
      return model.outputPriceUsdPer1M.value ?? 0;
    case 'contextWindow':
      return model.contextWindow.value ?? 0;
    case 'maxOutputTokens':
      return model.maxOutputTokens.value ?? 0;
    case 'plannerScore':
      return score.totalScore;
    case 'stabilityScore':
      return score.breakdown.stability.rawScore;
    default:
      return scenarioScoreMap.get(metric)?.valueOf() ?? 0;
  }
}

function labelForMetric(metric: ScannerMetric): string {
  return options.find((entry) => entry.value === metric)?.label ?? metric;
}

function formatMetric(metric: ScannerMetric, value: number): string {
  if (metric === 'inputPrice' || metric === 'outputPrice') {
    return `$${value.toFixed(2)}`;
  }

  if (metric === 'plannerScore' || metric === 'stabilityScore') {
    return value.toFixed(1);
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1000)}K`;
  }

  return String(value);
}

function ScatterTooltip({
  active,
  payload,
  xMetric,
  yMetric,
}: {
  active?: boolean;
  payload?: Array<{ payload: ScannerPoint }>;
  xMetric: ScannerMetric;
  yMetric: ScannerMetric;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;

  return (
    <div className="rounded-2xl border border-[rgba(172,216,255,0.16)] bg-[rgba(8,19,31,0.92)] px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{point.name}</p>
      <p className="mt-2 text-xs text-muted">
        {labelForMetric(xMetric)}: {formatMetric(xMetric, point.x)}
      </p>
      <p className="text-xs text-muted">
        {labelForMetric(yMetric)}: {formatMetric(yMetric, point.y)}
      </p>
    </div>
  );
}

export function TradeoffScanner({
  models,
  scores,
  xMetric,
  yMetric,
  onMetricChange,
  onInspectCitations,
}: TradeoffScannerProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(320);
  const scoreMap = new Map(scores.map((entry) => [entry.modelId, entry]));
  const scenarioScoreboards = new Map(
    TASK_SCENARIOS.map((scenario) => [
      scenario.id,
      new Map(computePlannerScores(models, scenario.profile).map((entry) => [entry.modelId, entry.totalScore])),
    ])
  );
  const points: ScannerPoint[] = models
    .map((model) => {
      const score = scoreMap.get(model.id);
      if (!score) return null;
      const xScenarioScores = scenarioScoreboards.get(xMetric as TaskScenarioId) ?? new Map<string, number>();
      const yScenarioScores = scenarioScoreboards.get(yMetric as TaskScenarioId) ?? new Map<string, number>();

      return {
        id: model.id,
        name: model.name,
        x: valueForMetric(model, score, xMetric, xScenarioScores),
        y: valueForMetric(model, score, yMetric, yScenarioScores),
        z: Math.max(20, (model.contextWindow.value ?? 200_000) / 40_000),
        fill: model.accent,
      };
    })
    .filter((entry): entry is ScannerPoint => entry !== null);

  const citedMetrics = [
    ...models.flatMap((model) => model.inputPriceUsdPer1M.citations),
    ...models.flatMap((model) => model.outputPriceUsdPer1M.citations),
    ...models.flatMap((model) => model.contextWindow.citations),
    ...models.flatMap((model) => model.maxOutputTokens.citations),
    ];

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return undefined;

    const syncWidth = () => {
      const nextWidth = Math.max(320, Math.floor(element.getBoundingClientRect().width));
      setChartWidth(nextWidth);
    };

    syncWidth();

    const observer = new ResizeObserver(() => {
      syncWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="glass-panel">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="eyebrow">Tradeoff scanner</div>
          <h2 className="panel-title mt-3 text-3xl font-semibold">Plot the fleet against your chosen axes</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-[15px]">
            The chart is there to expose tension, not to hide it. Mix hard specs with task-fit axes to see when a
            cheap model wins the swarm, when a specialist outruns the flagship on refactors, or when the premium pick
            still dominates the whole mission.
          </p>
        </div>

        <button type="button" className="badge" onClick={() => onInspectCitations('Tradeoff scanner sources', citedMetrics)}>
          Open scanner sources
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="control-surface">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">X-axis metric</span>
          <select
            aria-label="X-axis metric"
            className="mt-3 w-full rounded-xl border border-[rgba(172,216,255,0.16)] bg-[rgba(6,18,28,0.88)] px-3 py-3 text-sm text-white"
            value={xMetric}
            onChange={(event) => onMetricChange('x', event.target.value as ScannerMetric)}
          >
            {options.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-surface">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Y-axis metric</span>
          <select
            aria-label="Y-axis metric"
            className="mt-3 w-full rounded-xl border border-[rgba(172,216,255,0.16)] bg-[rgba(6,18,28,0.88)] px-3 py-3 text-sm text-white"
            value={yMetric}
            onChange={(event) => onMetricChange('y', event.target.value as ScannerMetric)}
          >
            {options.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div ref={chartRef} className="mt-6 h-[24rem] w-full">
        <ScatterChart width={chartWidth} height={380} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="rgba(157,213,255,0.12)" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              tick={{ fill: 'rgba(214,234,255,0.68)', fontSize: 12 }}
              tickFormatter={(value) => formatMetric(xMetric, Number(value))}
              stroke="rgba(157,213,255,0.18)"
              name={labelForMetric(xMetric)}
            />
            <YAxis
              dataKey="y"
              tick={{ fill: 'rgba(214,234,255,0.68)', fontSize: 12 }}
              tickFormatter={(value) => formatMetric(yMetric, Number(value))}
              stroke="rgba(157,213,255,0.18)"
              name={labelForMetric(yMetric)}
            />
            <ZAxis dataKey="z" range={[240, 920]} />
            <Tooltip
              cursor={{ strokeDasharray: '4 4', stroke: 'rgba(99,240,209,0.28)' }}
              content={<ScatterTooltip xMetric={xMetric} yMetric={yMetric} />}
            />
            <Scatter
              data={points}
              shape={(props: {
                cx?: number;
                cy?: number;
                payload?: ScannerPoint;
              }) => {
                if (!props.payload) return null;
                return (
                  <g>
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={8}
                      fill={props.payload.fill}
                      fillOpacity={0.92}
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth={1.5}
                    />
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={15}
                      fill={props.payload.fill}
                      fillOpacity={0.14}
                    />
                  </g>
                );
              }}
            />
        </ScatterChart>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
        <span className="badge">{labelForMetric(xMetric)} on X</span>
        <span className="badge">{labelForMetric(yMetric)} on Y</span>
        <span className="badge">Bubble halo sized from context window</span>
      </div>
    </section>
  );
}
