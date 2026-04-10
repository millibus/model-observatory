import type { Citation } from '../types';

interface CitationDrawerProps {
  title: string;
  citations: Citation[];
}

export function CitationDrawer({ title, citations }: CitationDrawerProps) {
  return (
    <section className="glass-panel mt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">Evidence drawer</div>
          <h2 className="panel-title mt-3 text-2xl font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted">Every listed citation points back to an official OpenAI page checked on 2026-04-02.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {citations.map((entry) => (
          <article key={entry.id} className="metric-row">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">{entry.title}</p>
              <p className="text-sm text-muted">{entry.detail}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(171,255,237,0.72)]">
                {entry.publisher}
                {entry.publishedOn ? ` · published ${entry.publishedOn}` : ''}
              </p>
            </div>
            <a
              className="badge self-start border-[rgba(99,240,209,0.18)] bg-[rgba(99,240,209,0.06)] text-[rgba(218,255,247,0.92)]"
              href={entry.url}
              target="_blank"
              rel="noreferrer"
            >
              Open source
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
