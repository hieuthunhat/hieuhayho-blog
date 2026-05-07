import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { label: 'projects shipped', value: '42' },
  { label: 'years building', value: '7' },
  { label: 'happy clients', value: '28' },
  { label: 'coffee per week', value: '∞' },
];

export default function Stats() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-medium text-blue-950">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
