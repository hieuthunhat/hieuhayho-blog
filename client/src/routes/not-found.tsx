import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Card className="mt-12">
      <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
        <p className="text-base text-blue-950">This page doesn't exist.</p>
        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link to="/">back home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
