import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-base font-medium text-blue-950">Have a project in mind?</p>
          <p className="text-sm text-muted-foreground">
            Booking from June 2026 · responses within 24h
          </p>
        </div>
        <Button asChild className="whitespace-nowrap bg-blue-700 hover:bg-blue-800">
          <Link to="/contact">
            say hello
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
