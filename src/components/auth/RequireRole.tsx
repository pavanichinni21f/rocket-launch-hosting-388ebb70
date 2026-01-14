import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ role, children, fallback }: RequireRoleProps) {
  const { user, loading: authLoading } = useAuth();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setHasRole(false);
        setIsChecking(false);
        return;
      }

      try {
        // Query user_roles table to check if user has the required role
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking user role:', error);
          setHasRole(false);
          setIsChecking(false);
          return;
        }

        // Check if user has the required role
        const userRoles = roles?.map(r => r.role) || [];
        const hasRequiredRole = userRoles.includes(role as 'user' | 'admin' | 'owner');
        
        // Owner role also has admin access
        const hasOwnerAccess = role === 'admin' && userRoles.includes('owner');
        
        setHasRole(hasRequiredRole || hasOwnerAccess);
      } catch (err) {
        console.error('Error in role check:', err);
        setHasRole(false);
      } finally {
        setIsChecking(false);
      }
    }

    if (!authLoading) {
      checkUserRole();
    }
  }, [user, role, authLoading]);

  // Show loading state while checking auth and role
  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in - redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // User doesn't have the required role
  if (!hasRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // User has the required role - render children
  return <>{children}</>;
}
