'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AlumniSettingsPage() {
  const [message, setMessage] = useState('');
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
          <Button variant="outline" onClick={() => setMessage('Password changes are handled from the local login system.')}>Change Password</Button>
          <Button variant="outline" onClick={() => setMessage('Notification preferences saved.')}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
