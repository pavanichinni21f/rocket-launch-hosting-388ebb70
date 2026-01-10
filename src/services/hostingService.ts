/**
 * Hosting Service - Manages hosting accounts using the hosting_accounts table
 */

import { supabase } from '@/integrations/supabase/client';

export interface HostingAccount {
  id: string;
  name: string;
  domain?: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  isActive: boolean;
  storageUsedGb: number;
  bandwidthUsedGb: number;
  serverLocation: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHostingAccountInput {
  name: string;
  domain?: string;
  plan?: 'free' | 'starter' | 'business' | 'enterprise';
  serverLocation?: string;
}

/**
 * Get all hosting accounts for the current user
 */
export async function getHostingAccounts(userId: string): Promise<HostingAccount[]> {
  try {
    const { data, error } = await supabase
      .from('hosting_accounts')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch hosting accounts:', error);
      return [];
    }

    return (data || []).map(account => ({
      id: account.id,
      name: account.name,
      domain: account.domain || undefined,
      plan: account.plan || 'free',
      isActive: account.is_active ?? true,
      storageUsedGb: Number(account.storage_used_gb) || 0,
      bandwidthUsedGb: Number(account.bandwidth_used_gb) || 0,
      serverLocation: account.server_location || 'us-east',
      ownerId: account.owner_id,
      createdAt: account.created_at || new Date().toISOString(),
      updatedAt: account.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching hosting accounts:', err);
    return [];
  }
}

/**
 * Get a single hosting account by ID
 */
export async function getHostingAccountById(accountId: string): Promise<HostingAccount | null> {
  try {
    const { data, error } = await supabase
      .from('hosting_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error || !data) {
      console.error('Failed to fetch hosting account:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      domain: data.domain || undefined,
      plan: data.plan || 'free',
      isActive: data.is_active ?? true,
      storageUsedGb: Number(data.storage_used_gb) || 0,
      bandwidthUsedGb: Number(data.bandwidth_used_gb) || 0,
      serverLocation: data.server_location || 'us-east',
      ownerId: data.owner_id,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error fetching hosting account:', err);
    return null;
  }
}

/**
 * Create a new hosting account
 */
export async function createHostingAccount(userId: string, serviceId?: string, config: CreateHostingAccountInput = { name: 'My Hosting' }): Promise<HostingAccount> {
  const { data, error } = await supabase
    .from('hosting_accounts')
    .insert({
      name: config.name || `Hosting Account - ${Date.now()}`,
      domain: config.domain,
      plan: config.plan || 'starter',
      server_location: config.serverLocation || 'us-east',
      owner_id: userId,
      is_active: true,
      storage_used_gb: 0,
      bandwidth_used_gb: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create hosting account:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    domain: data.domain || undefined,
    plan: data.plan || 'starter',
    isActive: data.is_active ?? true,
    storageUsedGb: Number(data.storage_used_gb) || 0,
    bandwidthUsedGb: Number(data.bandwidth_used_gb) || 0,
    serverLocation: data.server_location || 'us-east',
    ownerId: data.owner_id,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
}

/**
 * Update a hosting account
 */
export async function updateHostingAccount(
  accountId: string, 
  updates: Partial<CreateHostingAccountInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.domain !== undefined) updateData.domain = updates.domain;
    if (updates.plan) updateData.plan = updates.plan;
    if (updates.serverLocation) updateData.server_location = updates.serverLocation;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('hosting_accounts')
      .update(updateData)
      .eq('id', accountId);

    if (error) {
      console.error('Failed to update hosting account:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error updating hosting account:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Update hosting account status
 */
export async function updateHostingAccountStatus(accountId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('hosting_accounts')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', accountId);

    if (error) {
      console.error('Failed to update hosting account status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error updating hosting account status:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Delete a hosting account
 */
export async function deleteHostingAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('hosting_accounts')
      .delete()
      .eq('id', accountId);

    if (error) {
      console.error('Failed to delete hosting account:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting hosting account:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Suspend a hosting account
 */
export async function suspendHostingAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
  return updateHostingAccountStatus(accountId, false);
}

/**
 * Activate a hosting account
 */
export async function activateHostingAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
  return updateHostingAccountStatus(accountId, true);
}

/**
 * Terminate a hosting account
 */
export async function terminateHostingAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
  return deleteHostingAccount(accountId);
}

/**
 * Get server stats (mock data)
 */
export async function getServerStats(): Promise<{
  uptime: number;
  cpu: number;
  memory: number;
  disk: number;
  bandwidth: number;
}> {
  // Mock server stats for demo
  return {
    uptime: 99.9,
    cpu: Math.floor(Math.random() * 50) + 20,
    memory: Math.floor(Math.random() * 40) + 40,
    disk: Math.floor(Math.random() * 30) + 20,
    bandwidth: Math.floor(Math.random() * 60) + 30,
  };
}
