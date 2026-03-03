# Customer Backend TODO - RetroTick SaaS Platform
*Detailed technical roadmap - March 3, 2026*

## 🎯 Tech Stack (Your Wheelhouse)
- **Database:** Supabase (PostgreSQL)
- **Backend:** Supabase Edge Functions (Deno/TypeScript)
- **Frontend:** React/Next.js or Expo (for admin)
- **File Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Hosting:** Vercel/Netlify + Supabase

---

## 📊 Database Schema (PostgreSQL)

### **Core Tables:**

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    company_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    subscription_status TEXT DEFAULT 'trial',
    subscription_plan TEXT,
    trial_ends_at TIMESTAMPTZ
);

-- Uploaded applications
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash TEXT NOT NULL, -- SHA-256 for dedup
    pe_info JSONB, -- Parsed PE metadata
    status TEXT DEFAULT 'uploaded', -- uploaded, processing, ready, failed
    compatibility_score INTEGER, -- 0-100
    last_tested_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Access control
    is_public BOOLEAN DEFAULT FALSE,
    max_sessions INTEGER DEFAULT 1
);

-- Application sessions (running instances)
CREATE TABLE app_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'starting', -- starting, running, stopped, error
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    emulator_state JSONB, -- Saved state for resume
    
    -- Resource tracking
    memory_usage_mb INTEGER DEFAULT 0,
    cpu_time_seconds INTEGER DEFAULT 0
);

-- Usage tracking for billing
CREATE TABLE usage_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    event_type TEXT NOT NULL, -- session_start, session_end, file_upload, etc
    application_id UUID REFERENCES applications(id),
    session_id UUID REFERENCES app_sessions(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly INTEGER, -- cents
    max_applications INTEGER,
    max_concurrent_sessions INTEGER,
    max_file_size_mb INTEGER,
    features JSONB
);

-- Payment tracking
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    plan_id TEXT REFERENCES subscription_plans(id),
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Indexes & Constraints:**
```sql
-- Performance indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_app_sessions_user_id ON app_sessions(user_id);
CREATE INDEX idx_app_sessions_status ON app_sessions(status);
CREATE INDEX idx_usage_events_user_date ON usage_events(user_id, created_at);

-- Unique constraints
ALTER TABLE applications ADD CONSTRAINT unique_user_file_hash 
    UNIQUE(user_id, file_hash);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own applications" ON applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON app_sessions
    FOR ALL USING (auth.uid() = user_id);
```

---

## 🔧 Backend Services (Supabase Edge Functions)

### **1. File Upload & Processing**
```typescript
// functions/upload-application/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    // 1. Validate user auth & subscription limits
    // 2. Parse uploaded PE/EXE file
    // 3. Extract metadata (icons, version, etc.)
    // 4. Run basic compatibility check
    // 5. Store in Supabase Storage
    // 6. Update applications table
    // 7. Queue for full compatibility test
})
```

### **2. Session Management**
```typescript
// functions/start-session/index.ts
serve(async (req) => {
    // 1. Validate user can start session (limits)
    // 2. Generate unique session token
    // 3. Initialize emulator environment
    // 4. Return session URL + token
    // 5. Track usage for billing
})

// functions/session-heartbeat/index.ts
serve(async (req) => {
    // 1. Update last_activity_at
    // 2. Check session limits
    // 3. Return session status
})
```

### **3. Compatibility Testing**
```typescript
// functions/test-compatibility/index.ts
serve(async (req) => {
    // 1. Load application from storage
    // 2. Run headless RetroTick test
    // 3. Score compatibility (0-100)
    // 4. Update applications table
    // 5. Generate compatibility report
})
```

### **4. Usage Tracking & Billing**
```typescript
// functions/process-usage/index.ts
serve(async (req) => {
    // 1. Calculate monthly usage by user
    // 2. Generate Stripe usage records
    // 3. Check subscription limits
    // 4. Send usage alerts if needed
})
```

---

## 🎨 Frontend Components

### **Core Pages:**
1. **Dashboard** - uploaded apps, usage stats
2. **Upload** - drag/drop app upload with progress
3. **Application Detail** - compatibility report, launch session
4. **Session Viewer** - embedded RetroTick emulator
5. **Billing** - subscription management
6. **Account** - profile settings

### **React Components:**
```typescript
// components/AppUploader.tsx
// components/CompatibilityScore.tsx  
// components/SessionViewer.tsx
// components/UsageChart.tsx
// components/BillingTable.tsx
```

---

## 💳 Subscription Plans

### **Starter ($29/month)**
- 3 applications
- 1 concurrent session
- 10MB max file size
- Community support

### **Professional ($99/month)**
- 15 applications  
- 5 concurrent sessions
- 100MB max file size
- Priority support
- Custom branding

### **Enterprise ($299/month)**
- Unlimited applications
- 25 concurrent sessions
- 1GB max file size
- SSO integration
- SLA support

---

## 🚀 Implementation Roadmap

### **Phase 1: MVP (2 weeks)**
- [ ] Set up Supabase project
- [ ] Create core database schema
- [ ] Build basic upload functionality
- [ ] Implement user auth/registration
- [ ] Create simple dashboard
- [ ] Basic session management

### **Phase 2: Core Features (3 weeks)**
- [ ] File processing & metadata extraction
- [ ] Compatibility testing system
- [ ] Session viewer with embedded RetroTick
- [ ] Usage tracking
- [ ] Basic billing integration

### **Phase 3: Production Ready (2 weeks)**
- [ ] Stripe subscription management
- [ ] Advanced compatibility scoring
- [ ] Performance monitoring
- [ ] Error handling & logging
- [ ] Security audit

### **Phase 4: Scale & Polish (ongoing)**
- [ ] Advanced analytics
- [ ] Customer support tools
- [ ] API for third-party integrations
- [ ] Mobile admin app (React Native)

---

## 🔒 Security & Compliance

### **Data Protection:**
- RLS on all user data
- File encryption at rest
- Session token rotation
- Rate limiting on all endpoints

### **Business Critical:**
- Automated backups
- Error monitoring (Sentry)
- Uptime monitoring
- Customer data export tools

---

## 📈 Metrics to Track

### **Technical:**
- Application compatibility scores
- Session success rates
- Upload/processing times
- Server performance

### **Business:**
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- User session frequency
- Churn rate by plan

---

## 💡 Revenue Optimization

### **Usage-Based Features:**
- Pay-per-session options for occasional users
- Storage-based pricing tiers
- Processing priority queues
- Advanced compatibility testing

### **Value-Added Services:**
- Application migration consulting
- Custom compatibility fixes
- White-label solutions
- API access for developers

---

**Estimated Development Time:** 6-8 weeks for full MVP
**Tech Complexity:** Medium (leverages your existing Supabase expertise)
**Revenue Potential:** $10k-100k+ MRR within 6 months