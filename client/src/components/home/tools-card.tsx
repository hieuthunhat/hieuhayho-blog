import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tools = ['Figma', 'Framer', 'React', 'Tailwind', 'Notion', 'Linear', 'Webflow'];

export default function ToolsCard() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">tools & stack</CardTitle>
        <CardDescription className="text-xs">things I reach for daily</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tools.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="bg-blue-50 text-blue-900 hover:bg-blue-100"
            >
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
