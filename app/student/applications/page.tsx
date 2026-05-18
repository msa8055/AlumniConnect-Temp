import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function ApplicationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Card><CardContent className="p-6 text-muted-foreground">Applications submitted from the Job Board are saved in the backend.</CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
