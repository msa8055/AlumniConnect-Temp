import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Card><CardContent className="p-6 text-muted-foreground">Real uploaded resources can be added here in the next data module.</CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
