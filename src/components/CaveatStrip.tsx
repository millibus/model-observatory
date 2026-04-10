export function CaveatStrip() {
  return (
    <div className="caveat-strip glass-panel border-[rgba(255,183,118,0.22)] bg-[rgba(34,20,8,0.72)] py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="eyebrow bg-[rgba(255,183,118,0.12)] text-[rgba(255,226,196,0.92)]">
            Mission caveat
          </div>
          <p className="mt-3 max-w-4xl text-sm text-[rgba(255,236,219,0.82)] md:text-[15px]">
            OpenAI release posts and model pages emphasize different things: some focus on flagship general ability,
            some on long-horizon coding, some on low-cost delegation. This dashboard uses published specs first, then
            blends in clearly labeled release positioning so the task heatmap stays useful without pretending to be a
            universal benchmark.
          </p>
        </div>
        <div className="badge border-[rgba(255,183,118,0.18)] bg-[rgba(255,183,118,0.08)] text-[rgba(255,236,219,0.84)]">
          Snapshot verified on 2026-04-02
        </div>
      </div>
    </div>
  );
}
