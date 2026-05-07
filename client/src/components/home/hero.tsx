import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <Card className="mb-6">
      <CardContent className="p-10">
        <Badge
          variant="secondary"
          className="mb-4 bg-blue-50 text-blue-900 hover:bg-blue-50"
        >
          <Sparkles className="mr-1.5 h-3 w-3" />
          available for work · 2026
        </Badge>
        <h1 className="mb-4 max-w-xl text-4xl font-medium leading-tight text-blue-950">
          Developer crafting calm, considered interfaces.
        </h1>
        <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          I help small teams turn rough ideas into shipped products. I care about the
          quiet details: tight type, sensible defaults, and code that reads like prose.
        </p>
        <div className="flex gap-2.5">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <a href="#work">
              view work
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">get in touch</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
