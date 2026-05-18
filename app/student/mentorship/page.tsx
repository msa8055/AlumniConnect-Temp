import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentMentorshipPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Mentorship</h1>
        <Card><CardContent className="p-6 text-muted-foreground">Mentorship requests sent from Find Mentors are stored and will appear for alumni to accept.</CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
