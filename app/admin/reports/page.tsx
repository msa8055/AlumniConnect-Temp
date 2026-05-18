import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <Card><CardContent className="p-6 text-muted-foreground">Reports will populate from real jobs, users, events, applications, and registrations as the system is used.</CardContent></Card>
    </div>
  );
}
