import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Monitor, Smartphone, Tablet, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Session {
  id: string;
  ip: string;
  user_agent: string;
  created_at: string;
  current?: boolean;
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { listSessions, revokeSession } = useAuth();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    const { error, data } = await listSessions();
    setIsLoading(false);

    if (error) {
      toast.error('Failed to load sessions');
    } else {
      setSessions(data || []);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    const { error } = await revokeSession(sessionId);
    if (!error) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session revoked successfully');
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile')) return <Smartphone className="h-4 w-4" />;
    if (ua.includes('tablet')) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceName = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    return 'Unknown Browser';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your active sessions across different devices and browsers.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No active sessions found.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getDeviceIcon(session.user_agent)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getDeviceName(session.user_agent)}
                    </span>
                    {session.current && (
                      <Badge variant="secondary">Current Session</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.ip} • {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>

              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Revoke
                </Button>
              )}
            </div>
          ))
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Revoking a session will sign out that device. You can revoke all other sessions to sign out everywhere except this device.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}