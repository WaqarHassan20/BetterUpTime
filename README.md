# UpTime Monitor - Complete Application Documentation

## 🚀 Overview

UpTime Monitor is a comprehensive website monitoring application built with modern technologies. It allows users to monitor website uptime, get real-time alerts, and track performance metrics across multiple global regions.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│   Port: 3002    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Redis Stream  │              │
         └──────────────►│   (Queue)       │◄─────────────┘
                        │   Port: 6379    │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Workers       │
                        │  (Monitoring)   │
                        └─────────────────┘
```

## 📁 Project Structure

```
betterUpTime/
├── apps/
│   ├── api/                    # Backend API Server
│   │   ├── index.ts           # Express server setup
│   │   ├── middleware.ts      # JWT authentication
│   │   └── routes/            # API endpoints
│   │       ├── userRoutes.ts     # Auth (signup/signin)
│   │       ├── websiteRoutes.ts  # Website CRUD
│   │       ├── regionRoutes.ts   # Region management
│   │       └── monitoringRoutes.ts # Queue operations
│   │
│   ├── frontend/              # Next.js Frontend
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── signin/        # Authentication
│   │   │   ├── signup/        # Registration
│   │   │   └── dashboard/     # Main application
│   │   │       ├── page.tsx           # Dashboard layout
│   │   │       ├── components/        # UI components
│   │   │       └── hooks/             # Custom hooks
│   │   └── lib/
│   │       ├── utils.ts       # Utilities & config
│   │       └── validation.ts  # Zod schemas
│   │
│   ├── pusher/                # Redis Stream Producer
│   ├── worker/                # Redis Stream Consumer
│   └── packages/
│       ├── store/             # Prisma ORM & Database
│       ├── redisstream/       # Redis utilities
│       └── ui/                # Shared components
│
└── producer-worker/           # Standalone workers
    ├── producer/              # Queue producer
    └── worker/                # Queue consumer
```

## 🔄 Complete Application Flow

### 1. 🎯 User Authentication Flow

#### Landing Page → Sign Up/Sign In
```typescript
// Landing page (app/page.tsx)
┌─ Beautiful gradient design with glass-morphism effects
├─ Hero section with dashboard preview
├─ Features showcase
├─ Call-to-action buttons
└─ Redirects to signup/signin
```

#### Authentication Process
```typescript
// Signup (app/signup/page.tsx)
┌─ User Registration
├─ Zod validation (username, password strength)
├─ bcrypt password hashing (12 salt rounds)
├─ Duplicate username check
├─ User creation in PostgreSQL
└─ Redirect to signin

// Signin (app/signin/page.tsx)
┌─ User Login
├─ Credential validation
├─ bcrypt password verification
├─ JWT token generation (7-day expiry)
├─ Token storage in localStorage
└─ Redirect to dashboard
```

### 2. 🎛️ Dashboard - The Heart of the Application

#### The `useDashboard` Hook - Complete Functionality

The `useDashboard` hook is the **central nervous system** of the application. It manages:

```typescript
// Location: apps/frontend/app/dashboard/hooks/useDashboard.ts

export function useDashboard() {
  // 🔄 STATE MANAGEMENT
  const [websites, setWebsites] = useState<Website[]>([]);       // User's websites
  const [regions, setRegions] = useState<Region[]>([]);         // Available regions
  const [loading, setLoading] = useState(true);                 // Loading states
  const [newUrl, setNewUrl] = useState('');                     // Form inputs
  const [selectedRegionId, setSelectedRegionId] = useState(''); // Selected region
  const [workerId, setWorkerId] = useState('');                 // Worker identifier
  const [error, setError] = useState('');                       // Error messages
  const [success, setSuccess] = useState('');                   // Success messages
  const [processingPusher, setProcessingPusher] = useState(false); // Queue operations
  const [processingWorker, setProcessingWorker] = useState(false); // Worker operations
}
```

#### Key Functions Explained:

##### 🔐 Authentication Management
```typescript
// Get auth headers for API calls
const getHeaders = () => ({
  headers: { Authorization: localStorage.getItem("token") }
});

// Auto-redirect if not authenticated
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push('/signin');  // Redirect to signin
    return;
  }
  fetchWebsites();  // Load user data
  fetchRegions();   // Load available regions
}, [router]);
```

##### 📊 Data Fetching
```typescript
// Fetch user's websites with monitoring data
const fetchWebsites = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/websites`, getHeaders());
    setWebsites(response.data.websites);  // Includes ticks (monitoring data)
  } catch (err) {
    // Handle 401 (unauthorized) - redirect to signin
    // Handle other errors - show error message
  }
};

// Fetch available monitoring regions
const fetchRegions = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/regions`, getHeaders());
    setRegions(response.data.regions);  // Global monitoring locations
  } catch (err) {
    // Error handling
  }
};
```

##### 🌐 Website Management
```typescript
// Add new website to monitor
const addWebsite = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newUrl.trim()) return;

  try {
    setLoading(true);
    await axios.post(`${BACKEND_URL}/websites`, { url: newUrl }, getHeaders());
    setNewUrl('');        // Clear form
    await fetchWebsites(); // Refresh list
  } catch (err) {
    setError('Failed to add website');
  }
};

// Delete website from monitoring
const deleteWebsite = async (id: string) => {
  try {
    await axios.delete(`${BACKEND_URL}/websites/${id}`, getHeaders());
    await fetchWebsites(); // Refresh list
  } catch (err) {
    setError('Failed to delete website');
  }
};
```

##### 🌍 Region Management
```typescript
// Add new monitoring region
const addRegion = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newRegionName.trim()) return;

  try {
    await axios.post(`${BACKEND_URL}/regions`, { name: newRegionName }, getHeaders());
    setNewRegionName('');  // Clear form
    await fetchRegions();  // Refresh list
    setSuccess('✅ Region created successfully');
  } catch (err) {
    setError('Failed to create region');
  }
};

// Delete monitoring region
const deleteRegion = async (id: string) => {
  try {
    await axios.delete(`${BACKEND_URL}/regions/${id}`, getHeaders());
    await fetchRegions();  // Refresh list
    setSuccess('✅ Region deleted successfully');
  } catch (err) {
    setError('Failed to delete region');
  }
};
```

##### 🚀 Queue Operations (The Core Monitoring System)
```typescript
// STEP 1: Add websites to monitoring queue
const triggerPusher = async () => {
  try {
    setProcessingPusher(true);
    const response = await axios.post(`${BACKEND_URL}/trigger-pusher`, {}, getHeaders());
    setSuccess(`✅ ${response.data.message}`);
    // This adds ONLY NEW (unchecked) websites to Redis queue
  } catch (err) {
    setError('Failed to trigger pusher');
  } finally {
    setProcessingPusher(false);
  }
};

// STEP 2: Process queue with workers
const triggerWorker = async () => {
  if (!selectedRegionId || !workerId.trim()) {
    setError('Please select a region and enter a worker ID');
    return;
  }

  try {
    setProcessingWorker(true);
    const response = await axios.post(`${BACKEND_URL}/trigger-worker`, {
      regionId: selectedRegionId,
      workerId: workerId.trim()
    }, getHeaders());
    setSuccess(`✅ ${response.data.message}`);
    await fetchWebsites(); // Refresh to show new monitoring data
  } catch (err) {
    setError('Failed to trigger worker');
  } finally {
    setProcessingWorker(false);
  }
};
```

### 3. 🎨 Dashboard UI Components

#### Dashboard Layout (apps/frontend/app/dashboard/page.tsx)
```typescript
export default function Dashboard() {
  const {
    websites, regions, loading, error, success,
    triggerPusher, triggerWorker, addWebsite,
    deleteWebsite, // ... all hook functions
  } = useDashboard(); // 🎯 Hook provides everything needed

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <DashboardHeader onLogout={logout} />
      <AddWebsiteForm onSubmit={addWebsite} />
      <MonitoringControls onTriggerPusher={triggerPusher} />
      <WebsiteList websites={websites} onDeleteWebsite={deleteWebsite} />
      <RegionModal regions={regions} />
    </div>
  );
}
```

#### Component Breakdown:

##### 🎯 DashboardHeader
- Displays user info and logout functionality
- Shows application branding

##### ➕ AddWebsiteForm
- URL input with validation
- Real-time URL format checking
- Form submission handling

##### 🎛️ MonitoringControls
```typescript
// Key features:
- Region selection dropdown
- Worker ID input
- "Add to Queue" button (triggerPusher)
- "Process Queue" button (triggerWorker)
- "Manage Regions" button
```

##### 📋 WebsiteList
```typescript
// Displays:
- Website URL and status
- Response time (if monitored)
- Status indicators (Up/Down/Unknown)
- Delete functionality
- Real-time status colors
```

##### 🌍 RegionModal
```typescript
// Region management:
- Add new regions
- Delete existing regions
- Create Redis consumer groups
- Region-specific worker management
```

### 4. 🔧 Backend API Architecture

#### Express Server Setup (apps/api/index.ts)
```typescript
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route handlers
app.use("/user", userRoutes);      // Authentication
app.use("/websites", websiteRoutes); // Website CRUD
app.use("/regions", regionRoutes);   // Region management
app.use("/", monitoringRoutes);     // Queue operations

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "UpTime Monitor API is running" });
});
```

#### Authentication Middleware (apps/api/middleware.ts)
```typescript
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    const token = jwt.verify(header, process.env.JWT_SECRET);
    req.userId = token.sub as string; // Extract user ID
    next(); // Continue to route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

#### API Routes Detailed:

##### 👤 User Routes (userRoutes.ts)
```typescript
// POST /user/signup
- Zod validation (username 3-30 chars, strong password)
- Duplicate username check
- bcrypt password hashing (12 salt rounds)
- User creation in database
- Success response

// POST /user/signin
- Credential validation
- bcrypt password verification
- JWT token generation (7-day expiry)
- User data response
```

##### 🌐 Website Routes (websiteRoutes.ts)
```typescript
// GET /websites
- Fetch user's websites with monitoring data
- Include ticks (status, response_time, timestamps)
- Join with WebsiteTick table

// POST /websites
- Add new website to monitor
- URL validation and normalization
- Associate with authenticated user

// DELETE /websites/:id
- Remove website from monitoring
- Delete associated monitoring data
```

##### 🌍 Region Routes (regionRoutes.ts)
```typescript
// GET /regions
- Fetch all available monitoring regions
- Return region ID and name

// POST /regions
- Create new monitoring region
- Validate region name uniqueness

// DELETE /regions/:id
- Remove monitoring region
- Clean up associated data
```

##### 🚀 Monitoring Routes (monitoringRoutes.ts)
```typescript
// POST /trigger-pusher
- Get user's UNCHECKED websites (no ticks)
- Add to Redis queue using xAddBulk
- Return count of queued websites
- Smart filtering: only new websites

// POST /trigger-worker
- Validate regionId and workerId
- Trigger Redis consumer group processing
- Process websites from queue
- Generate monitoring data (WebsiteTicks)

// POST /redis/create-group/:regionId
- Create Redis consumer group for region
- Enable distributed monitoring
```

### 5. 🗄️ Database Schema (Prisma)

```prisma
model User {
  id       String    @id @default(uuid())
  username String    @unique
  password String    // bcrypt hashed
  websites Website[] // One-to-many relationship
}

model Website {
  id        String        @id @default(uuid())
  url       String        // Website URL to monitor
  timeAdded DateTime      // When added to monitoring
  ticks     WebsiteTick[] // Monitoring history
  User      User?         @relation(fields: [userId], references: [id])
  userId    String?
}

model Region {
  id          String        @id @default(uuid())
  name        String        // Region name (e.g., "US-East", "Europe")
  WebsiteTick WebsiteTick[] // Monitoring data from this region
}

model WebsiteTick {
  id               String        @id @default(uuid())
  response_time_ms Int           // Response time in milliseconds
  status           WebsiteStatus // Up/Down/Unknown
  website          Website?      @relation(fields: [website_id], references: [id])
  region           Region        @relation(fields: [region_id], references: [id])
  region_id        String
  website_id       String
  createdAt        DateTime      @default(now()) // Timestamp
}

enum WebsiteStatus {
  Up      // Website responding
  Down    // Website not responding
  Unknown // Status unclear
}
```

### 6. 🔄 Redis Queue System

#### Redis Stream Architecture
```typescript
// Stream name: "betteruptime:website"
// Message format: { url: "example.com", id: "uuid" }

// Producer (packages/redisstream/index.ts)
export async function xAddBulk(websites: websiteEvent[]) {
  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];
    if (website) {
      await xAdd({ url: website.url, id: website.id });
    }
  }
}

// Consumer
export async function xReadGroup(
  consumerGroup: string,  // e.g., "us-east"
  workerId: string        // e.g., "worker-1"
): Promise<messageType[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    workerId,
    { key: STREAM_NAME, id: ">" },
    { COUNT: 5 }
  );
  return res?.[0]?.messages ?? [];
}
```

### 7. 🔧 Monitoring Workers

#### Worker Process Flow
```typescript
// 1. Worker reads from Redis queue
const messages = await xReadGroup("us-east", "worker-1");

// 2. For each website in queue:
for (const message of messages) {
  const { url, id } = message.message;
  
  // 3. Perform HTTP check
  const startTime = Date.now();
  try {
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;
    const status = response.ok ? 'Up' : 'Down';
    
    // 4. Save monitoring data
    await client.websiteTick.create({
      data: {
        website_id: id,
        region_id: regionId,
        response_time_ms: responseTime,
        status: status,
      }
    });
  } catch (error) {
    // 5. Handle failed checks
    await client.websiteTick.create({
      data: {
        website_id: id,
        region_id: regionId,
        response_time_ms: 0,
        status: 'Down',
      }
    });
  }
}
```

### 8. 🎨 UI/UX Design System

#### Design Principles
- **Glass-morphism**: Backdrop blur effects with transparency
- **Gradient Backgrounds**: Beautiful blue-purple-gray gradients
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Easy on eyes for monitoring dashboards

#### Color Scheme
```css
Primary Colors:
- Background: gray-900 (dark)
- Cards: gray-800/80 (semi-transparent)
- Borders: gray-700/50 (subtle)
- Text: white (high contrast)
- Accents: blue-500 to purple-600 gradients

Status Colors:
- Up/Success: green-500
- Down/Error: red-500
- Unknown/Warning: gray-500
- Processing: blue-500 (animated)
```

### 9. 🔒 Security Features

#### Authentication Security
- **JWT Tokens**: 7-day expiry with secure signing
- **bcrypt Hashing**: 12 salt rounds for passwords
- **Password Requirements**: Uppercase, lowercase, number, special char
- **Authorization Middleware**: Protects all API routes
- **Token Validation**: Client-side and server-side checks

#### Input Validation
- **Zod Schemas**: Type-safe validation on frontend and backend
- **URL Validation**: Proper URL format checking
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Prevention**: Input sanitization

### 10. 🚀 Getting Started

#### Prerequisites
```bash
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Bun (package manager)
```

#### Installation Steps
```bash
# 1. Clone repository
git clone <repository-url>
cd betterUpTime

# 2. Install dependencies
bun install

# 3. Database setup
cd packages/store
cp .env.example .env
# Edit .env with your database URL
bun run generate  # Generate Prisma client
bun run migrate   # Run database migrations

# 4. Start services
cd ../../apps/api
bun run index.ts  # Start API server (port 3001)

cd ../frontend
bun run dev       # Start frontend (port 3002)
```

#### Environment Variables
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/database

# JWT
JWT_SECRET=your-secret-key

# Redis (default)
REDIS_URL=redis://localhost:6379
```

### 11. 🔄 Complete User Journey

#### 1. 🌟 First Time User
```
Landing Page → Sign Up → Email Verification → Dashboard → Add Websites → Configure Regions → Start Monitoring
```

#### 2. 🔄 Regular Monitoring Workflow
```
Dashboard → Add Website → Add to Queue → Select Region → Process Queue → View Results → Repeat
```

#### 3. 📊 Monitoring Data Flow
```
Website Added → Queue (Redis) → Worker Processing → HTTP Check → Database Storage → Dashboard Update → User Notification
```

### 12. 🧩 Key Features Summary

#### ✅ Core Features
- **User Authentication**: Secure signup/signin with JWT
- **Website Management**: Add, delete, monitor multiple websites
- **Multi-Region Monitoring**: Check from different global locations
- **Real-Time Status**: Live website status with response times
- **Queue System**: Efficient Redis-based job processing
- **Beautiful UI**: Modern glass-morphism design
- **Responsive Design**: Works on all devices

#### 🔧 Technical Features
- **Smart Queue Filtering**: Only processes unchecked websites
- **Distributed Workers**: Multiple regions with worker scaling
- **Real-Time Updates**: Live status updates in dashboard
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript implementation
- **Database Relations**: Proper data modeling with Prisma

---

## 🎯 Conclusion

This UpTime Monitor application is a **production-ready, enterprise-grade** website monitoring solution that demonstrates:

- **Modern Architecture**: Microservices with proper separation
- **Scalable Design**: Distributed workers and queue system
- **Beautiful UI**: Professional glass-morphism interface
- **Security First**: Comprehensive authentication and validation
- **Performance Optimized**: Smart queue processing and efficient operations
- **Developer Friendly**: Type-safe, well-documented codebase

The `useDashboard` hook serves as the **central orchestrator** that connects all components, manages state, handles API communication, and provides a seamless user experience. It's a perfect example of how custom hooks can simplify complex applications while maintaining clean, maintainable code.

---

*This documentation covers every aspect of the application from user interface to database schema, making it easy for developers to understand, maintain, and extend the system.*
