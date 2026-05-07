import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { seedProjects } from '@/content/seed-projects';
import type { Project } from '@/lib/types';

function ShapeBlock({ project }: { project: Project }) {
  const baseStyle: React.CSSProperties = {
    background: project.accent,
  };
  if (project.shape === 'circle') {
    return <div className="h-10 w-10" style={{ ...baseStyle, borderRadius: '50%' }} />;
  }
  if (project.shape === 'parallelogram') {
    return (
      <div
        className="h-10 w-10 rounded-md"
        style={{ ...baseStyle, transform: 'skewX(-12deg)' }}
      />
    );
  }
  return <div className="h-10 w-10 rounded-md" style={baseStyle} />;
}

export default function WorkGrid() {
  return (
    <section id="work" className="mb-6">
      <div className="mb-4 flex items-baseline justify-between px-1">
        <h2 className="text-lg font-medium text-blue-950">selected work</h2>
        <span className="text-xs text-muted-foreground">2024 — 2026</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {seedProjects.map((p) => (
          <Card
            key={p.name}
            className="cursor-pointer transition-colors hover:border-blue-300"
          >
            <CardContent className="p-5">
              <div
                className="mb-3 flex h-24 items-center justify-center rounded-md"
                style={{ background: p.bg }}
              >
                <ShapeBlock project={p} />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-950">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.type}</p>
                </div>
                <span className="text-xs text-muted-foreground">{p.year}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
