# Supabase Client Initialization - KS Foundation

This document shows the correct way to initialize Supabase in your application.

---

## ✅ Current Implementation (Already Set Up)

Your project already has Supabase properly initialized in:

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

---

## 📝 Your Project Details

| Property | Value |
|----------|-------|
| **Supabase URL** | `https://hgxeyfsrlaqwqndymkpp.supabase.co` |
| **Project ID** | `hgxeyfsrlaqwqndymkpp` |
| **Region** | Auto-detected |
| **Organization** | KS Foundation |
| **Domain** | www.ksfoundation.space |

---

## 🔧 Setup Instructions

### Step 1: Get Your API Keys

From Supabase Dashboard (`https://app.supabase.com/`):

1. Select project: `hgxeyfsrlaqwqndymkpp`
2. Go to **Settings** → **API**
3. Copy these keys:
   - **anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Create .env.local

```bash
# Copy template
cp .env.example .env.local

# Edit file
nano .env.local
```

### Step 3: Fill in Supabase Keys

```env
# Supabase (from Step 1 above)
VITE_SUPABASE_URL=https://hgxeyfsrlaqwqndymkpp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Verify Setup

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Check browser console - should see no errors

# Try this in browser console:
import { supabase } from "@/integrations/supabase/client";
supabase.auth.getUser().then(d => console.log(d));
```

---

## 💻 Using Supabase in Components

### Example 1: Read Data

```typescript
import { supabase } from "@/integrations/supabase/client";

export function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(10);
      
      if (error) {
        console.error('Error:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return <div>{users.length} users found</div>;
}
```

### Example 2: Insert Data

```typescript
const { data, error } = await supabase
  .from('users')
  .insert([
    {
      email: 'user@ksfoundation.space',
      full_name: 'John Doe',
    }
  ])
  .select();

if (error) console.error(error);
else console.log('User created:', data);
```

### Example 3: Update Data

```typescript
const { data, error } = await supabase
  .from('users')
  .update({ full_name: 'Jane Doe' })
  .eq('id', userId)
  .select();
```

### Example 4: Delete Data

```typescript
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

### Example 5: Real-time Subscription

```typescript
const subscription = supabase
  .from('orders')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();

// Cleanup when component unmounts
return () => subscription.unsubscribe();
```

### Example 6: Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@ksfoundation.space',
  password: 'SecurePassword123!',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@ksfoundation.space',
  password: 'SecurePassword123!',
});

// Get current user
const { data } = await supabase.auth.getUser();
console.log('Current user:', data.user);

// Sign out
await supabase.auth.signOut();
```

### Example 7: File Upload

```typescript
const file = new File(['contents'], 'file.txt', { type: 'text/plain' });

const { data, error } = await supabase.storage
  .from('ks-foundation-uploads')
  .upload(`public/file-${Date.now()}.txt`, file);

if (error) {
  console.error('Upload failed:', error);
} else {
  console.log('Uploaded:', data.path);
}
```

### Example 8: Google OAuth

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://www.ksfoundation.space/auth/callback',
  },
});
```

---

## 🔐 Security Configuration

### Enable Row Level Security (RLS)

Each table should have RLS policies. Example:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own data
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own data"
  ON users
  FOR DELETE
  USING (auth.uid() = id);
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install @supabase/supabase-js
```

### Issue: "VITE_SUPABASE_URL is undefined"

**Solution:**
1. Check `.env.local` has correct variables
2. Prefix with `VITE_` for Vite visibility
3. Restart dev server: `npm run dev`

### Issue: "Unauthorized" errors in database queries

**Solution:**
1. Check Row Level Security (RLS) policies
2. Verify user is authenticated
3. Enable debug in Supabase dashboard: Settings > Auth > Debug

### Issue: "CORS error" on file uploads

**Solution:**
1. Add domain to Storage CORS settings
2. Go to **Settings** > **Storage** > **CORS Configuration**
3. Add: `https://www.ksfoundation.space`

---

## 📊 Monitoring & Debugging

### View Real-time Requests

In Supabase Dashboard:
1. Go to **Logs** > **API Requests**
2. See all queries and errors in real-time

### Enable Query Debugging

```typescript
// Enable logging
const supabase = createClient(url, key, {
  debug: true,  // Logs all requests
});
```

### Check Authentication Logs

In Supabase Dashboard:
1. Go to **Authentication** > **Logs**
2. See signup, signin, and error events

---

## 🚀 Deployment Notes

### For Vercel

1. Go to **Project Settings** > **Environment Variables**
2. Add all `VITE_*` and secret keys:
   ```
   VITE_SUPABASE_URL=https://hgxeyfsrlaqwqndymkpp.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_secret_key
   ```
3. Deploy: `vercel --prod`

### For Self-Hosted

1. Create `.env.production` with production keys
2. Build: `npm run build`
3. Deploy `dist/` folder to your server
4. Verify: `curl https://www.ksfoundation.space`

---

## 📚 Resources

| Resource | Link |
|----------|------|
| Supabase Docs | https://supabase.com/docs |
| JavaScript SDK | https://supabase.com/docs/reference/javascript |
| Database Docs | https://supabase.com/docs/guides/database |
| Auth Docs | https://supabase.com/docs/guides/auth |
| Storage Docs | https://supabase.com/docs/guides/storage |
| Real-time | https://supabase.com/docs/guides/realtime |

---

## ✨ Next Steps

1. ✅ Fill in `.env.local` with your Supabase keys
2. ✅ Start dev server: `npm run dev`
3. ✅ Test authentication by signing up
4. ✅ Create database tables (see SUPABASE_SETUP_KS_FOUNDATION.md)
5. ✅ Enable RLS policies for security
6. ✅ Set up Edge Functions for backend logic
7. ✅ Configure webhooks for payments

---

**Organization**: KS Foundation  
**Domain**: www.ksfoundation.space  
**Supabase Project**: hgxeyfsrlaqwqndymkpp  
**Last Updated**: January 26, 2026

---
