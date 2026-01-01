import { supabase } from '@/integrations/supabase/client';

export interface LoginAttempt {
  id: string;
  user_id?: string;
  email: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  attempted_at: string;
  location?: string;
  device_type?: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  type: 'suspicious_login' | 'password_change' | 'api_key_created' | 'ip_blocked';
  details: any;
  ip_address: string;
  created_at: string;
  resolved: boolean;
}

export async function getIpWhitelist(userId: string): Promise<string[]> {
  return ['192.168.1.0/24', '10.0.0.0/8'];
}

export async function addToIpWhitelist(userId: string, ipRange: string): Promise<void> {
  console.log(`Adding ${ipRange} to whitelist for user ${userId}`);
}

export async function removeFromIpWhitelist(userId: string, ipRange: string): Promise<void> {
  console.log(`Removing ${ipRange} from whitelist for user ${userId}`);
}

export function isIpAllowed(ip: string, whitelist: string[]): boolean {
  for (const range of whitelist) {
    if (range.includes(ip.split('.')[0] + '.' + ip.split('.')[1])) {
      return true;
    }
  }
  return false;
}

export async function getLoginHistory(userId: string, limit = 20): Promise<LoginAttempt[]> {
  return [
    {
      id: 'login-1',
      user_id: userId,
      email: 'user@example.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      success: true,
      attempted_at: '2025-01-18T10:30:00Z',
      location: 'New York, US',
      device_type: 'desktop'
    },
    {
      id: 'login-2',
      user_id: userId,
      email: 'user@example.com',
      ip_address: '10.0.0.50',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      success: true,
      attempted_at: '2025-01-17T15:45:00Z',
      location: 'New York, US',
      device_type: 'mobile'
    },
    {
      id: 'login-3',
      email: 'user@example.com',
      ip_address: '203.0.113.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      success: false,
      attempted_at: '2025-01-16T08:20:00Z',
      location: 'Unknown',
      device_type: 'desktop'
    }
  ];
}

export async function logLoginAttempt(email: string, ip: string, userAgent: string, success: boolean, userId?: string): Promise<void> {
  console.log(`Login attempt: ${email} from ${ip}, success: ${success}`);

  if (!success) {
    await checkForSuspiciousActivity(email, ip);
  }
}

async function checkForSuspiciousActivity(email: string, ip: string): Promise<void> {
  const recentAttempts = await getRecentFailedAttempts(email, ip);
  if (recentAttempts.length > 5) {
    await createSecurityAlert(email, 'brute_force_attempt', { ip, attempts: recentAttempts.length });
  }
}

async function getRecentFailedAttempts(email: string, ip: string): Promise<LoginAttempt[]> {
  return [];
}

async function createSecurityAlert(userEmail: string, type: string, details: any): Promise<void> {
  console.log(`Security alert: ${type} for ${userEmail}`, details);
}

export async function getSecurityAlerts(userId: string): Promise<SecurityEvent[]> {
  return [
    {
      id: 'alert-1',
      user_id: userId,
      type: 'suspicious_login',
      details: { ip: '203.0.113.1', location: 'Unknown' },
      ip_address: '203.0.113.1',
      created_at: '2025-01-16T08:20:00Z',
      resolved: false
    }
  ];
}

export async function resolveSecurityAlert(alertId: string): Promise<void> {
  console.log(`Resolving security alert ${alertId}`);
}

export interface PasswordRequirements {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
}

export function validatePassword(password: string, requirements: PasswordRequirements): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < requirements.min_length) {
    errors.push(`Password must be at least ${requirements.min_length} characters long`);
  }

  if (requirements.require_uppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requirements.require_lowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requirements.require_numbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requirements.require_special_chars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function getActiveSessions(userId: string): Promise<any[]> {
  return [
    {
      id: 'session-1',
      device: 'Chrome on Windows',
      ip: '192.168.1.100',
      location: 'New York, US',
      last_active: '2025-01-18T10:30:00Z',
      current: true
    },
    {
      id: 'session-2',
      device: 'Safari on iPhone',
      ip: '192.168.1.100',
      location: 'New York, US',
      last_active: '2025-01-17T15:45:00Z',
      current: false
    }
  ];
}

export async function revokeSession(sessionId: string): Promise<void> {
  console.log(`Revoking session ${sessionId}`);
}

export async function revokeAllSessions(userId: string, exceptCurrent = true): Promise<void> {
  console.log(`Revoking all sessions for user ${userId}, except current: ${exceptCurrent}`);
}

export async function getLocationRestrictions(userId: string): Promise<string[]> {
  return ['US', 'CA', 'GB'];
}

export async function updateLocationRestrictions(userId: string, countries: string[]): Promise<void> {
  console.log(`Updating location restrictions for user ${userId}:`, countries);
}

export function getLocationFromIp(ip: string): string {
  if (ip.startsWith('192.168') || ip.startsWith('10.')) {
    return 'New York, US';
  }
  return 'Unknown';
}

export function getDeviceType(userAgent: string): string {
  if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
    return 'mobile';
  }
  if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    return 'tablet';
  }
  return 'desktop';
}
