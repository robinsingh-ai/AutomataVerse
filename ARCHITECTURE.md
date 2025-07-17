# AutomataVerse Architecture Documentation

This document provides a comprehensive overview of the AutomataVerse application architecture, including system design, component structure, and development guidelines.

## 🏗️ System Architecture

### Overview
AutomataVerse is a modern web application built with Next.js 14 that provides interactive simulators for automata theory concepts. The architecture follows a component-based approach with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   UI Components │  │   Simulators    │  │   Auth Pages    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Context/State  │  │  Canvas/Konva   │  │  API Routes     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        Backend Services                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Firebase      │  │   Firestore     │  │   Vercel        │ │
│  │   Auth          │  │   Database      │  │   Hosting       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── problems/             # Problem set endpoints
│   ├── components/               # Shared UI components
│   │   ├── Navbar.tsx           # Navigation component
│   │   ├── AutomataBanner.tsx   # Hero banner
│   │   ├── SaveMachineToast.tsx # Toast notifications
│   │   └── login/               # Login-specific components
│   ├── context/                 # React Context providers
│   │   └── ThemeContext.tsx     # Theme management
│   ├── simulator/               # Simulator pages
│   │   ├── page.tsx             # Main simulator dashboard
│   │   ├── layout.tsx           # Simulator layout
│   │   ├── dfa/                 # DFA simulator route
│   │   ├── nfa/                 # NFA simulator route
│   │   ├── pda/                 # PDA simulator route
│   │   ├── fsm/                 # FSM simulator route
│   │   └── tm/                  # Turing Machine simulator route
│   ├── store/                   # Redux store configuration
│   │   ├── index.ts             # Store setup with persistence
│   │   ├── authSlice.ts         # Authentication state
│   │   └── hooks.ts             # Typed Redux hooks
│   ├── profile/                 # User profile pages
│   ├── login/                   # Authentication pages
│   ├── learn/                   # Learning resources
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── simulators/                  # Core simulator implementations
│   ├── dfa/                     # DFA simulator logic
│   │   ├── AutomataSimulator.tsx # Main DFA component
│   │   ├── components/          # DFA-specific components
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── NodeCanvas.tsx
│   │   │   ├── InputPopup.tsx
│   │   │   └── Grid.tsx
│   │   ├── utils/               # DFA utilities
│   │   │   └── dfaSerializer.ts
│   │   └── type.ts              # TypeScript interfaces
│   ├── nfa/                     # NFA simulator (similar structure)
│   ├── pda/                     # PDA simulator (similar structure)
│   ├── fsm/                     # FSM simulator (similar structure)
│   └── tm/                      # Turing Machine simulator
├── lib/                         # Utility libraries
│   ├── firebase.ts              # Firebase client config
│   ├── firebase-admin.ts        # Firebase admin SDK
│   ├── machineService.ts        # Cloud storage operations
│   └── gtag.ts                  # Google Analytics
├── middleware.ts                # Next.js middleware
└── types/                       # Global TypeScript types
```

## 🧩 Component Architecture

### 1. Simulator Components

Each simulator follows a consistent architecture pattern:

```typescript
// Simulator Structure
AutomataSimulator.tsx           # Main simulator component
├── ControlPanel.tsx            # Simulation controls
├── NodeCanvas.tsx              # Interactive canvas
├── InputPopup.tsx              # Input dialogs
├── InfoPanel.tsx               # State information
├── TestInputPanel.tsx          # Input testing
└── Grid.tsx                    # Background grid
```

#### Key Components:

**AutomataSimulator.tsx**
- Main orchestrator component
- Manages simulation state
- Handles user interactions
- Coordinates between sub-components

**NodeCanvas.tsx**
- Konva-based interactive canvas
- Handles drag-and-drop operations
- Renders states and transitions
- Manages visual feedback

**ControlPanel.tsx**
- Simulation controls (play, pause, step)
- Input string management
- Validation and testing
- Export/import functionality

### 2. State Management

The application uses Redux Toolkit with persistence:

```typescript
// Store Structure
store/
├── index.ts                    # Store configuration
├── authSlice.ts               # Authentication state
└── hooks.ts                   # Typed hooks
```

**State Persistence:**
- Uses `redux-persist` for client-side storage
- Only persists authentication state
- Handles SSR/hydration properly

### 3. Authentication Architecture

**Firebase Integration:**
```typescript
// Authentication Flow
lib/firebase.ts → authSlice.ts → middleware.ts
```

**Protected Routes:**
- `/profile` - Requires authentication
- `/login`, `/signup` - Redirect if authenticated
- Middleware handles route protection

## 🎨 UI/UX Architecture

### Theme System
- React Context for theme management
- Supports light/dark modes
- System preference detection
- Persistent theme storage

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Flexible grid layouts
- Touch-friendly interactions

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

## 🔄 Data Flow

### 1. Simulator Data Flow

```
User Action → Component State → Canvas Update → Visual Feedback
     ↓              ↓              ↓              ↓
  onClick      setState()    Konva.render()   Animation
```

### 2. Authentication Flow

```
User Login → Firebase Auth → Redux Store → Route Protection
     ↓              ↓              ↓              ↓
  Submit      Auth Success    Update State   Redirect
```

### 3. Machine Save/Load Flow

```
Machine Design → Serialization → Firebase → Cloud Storage
     ↓              ↓              ↓              ↓
  JSON Format   Validation    Firestore    User Profile
```

## 🛠️ Technical Specifications

### Core Technologies

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Konva (Canvas)

**State Management:**
- Redux Toolkit
- Redux Persist
- React Context

**Backend Services:**
- Firebase Authentication
- Firestore Database
- Vercel (Hosting)

**Development Tools:**
- ESLint
- TypeScript
- PostCSS
- Webpack (via Next.js)

### Performance Optimizations

**Code Splitting:**
- Dynamic imports for heavy components
- Route-based code splitting
- Lazy loading of simulators

**Bundle Optimization:**
- Webpack optimizations
- Source map disabled in production
- Tree shaking enabled

**Caching:**
- Static asset caching
- API response caching
- Service worker (future)

## 🔒 Security Architecture

### Source Code Protection
- Production source maps disabled
- Code minification with comment removal
- Console log stripping in production

### Security Headers
```typescript
// next.config.mjs
headers: [
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'X-XSS-Protection: 1; mode=block'
]
```

### Authentication Security
- Firebase security rules
- JWT token validation
- Route-level protection
- CSRF protection

## 📊 Algorithm Implementations

### DFA Simulation
```typescript
// DFA Execution Algorithm
function simulateDFA(input: string, states: State[]) {
  let currentState = initialState;
  let position = 0;
  
  while (position < input.length) {
    const symbol = input[position];
    const transition = currentState.transitions[symbol];
    
    if (!transition) return false; // Reject
    
    currentState = states[transition.target];
    position++;
  }
  
  return currentState.isAccepting;
}
```

### NFA Simulation (Non-deterministic)
```typescript
// NFA with Epsilon Transitions
function simulateNFA(input: string, states: State[]) {
  let currentStates = epsilonClosure([initialState]);
  
  for (const symbol of input) {
    const nextStates = [];
    
    for (const state of currentStates) {
      const transitions = state.transitions[symbol] || [];
      nextStates.push(...transitions.map(t => t.target));
    }
    
    currentStates = epsilonClosure(nextStates);
  }
  
  return currentStates.some(state => state.isAccepting);
}
```

### PDA Simulation (Stack-based)
```typescript
// PDA with Stack Operations
function simulatePDA(input: string, states: State[]) {
  const stack = ['$']; // Bottom marker
  let currentState = initialState;
  
  for (const symbol of input) {
    const stackTop = stack[stack.length - 1];
    const transition = findTransition(currentState, symbol, stackTop);
    
    if (!transition) return false;
    
    // Stack operations
    stack.pop(); // Pop
    stack.push(...transition.push); // Push
    
    currentState = transition.target;
  }
  
  return currentState.isAccepting && stack.length === 1;
}
```

## 🚀 Deployment Architecture

### Vercel Deployment
```typescript
// Deployment Configuration
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain"
  }
}
```

### Environment Management
- `.env.local` - Local development
- `.env.production` - Production variables
- Vercel environment variables
- Firebase project configuration

## 🔧 Development Architecture

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Prettier code formatting
- Husky pre-commit hooks

### Testing Strategy
- Unit tests for algorithms
- Component testing (React Testing Library)
- Integration tests for simulators
- End-to-end tests (Playwright)

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build:secure
      - name: Deploy to Vercel
        uses: vercel/action@v20
```

## 📈 Scalability Considerations

### Performance Scaling
- Component memoization
- Virtual scrolling for large datasets
- Lazy loading of heavy components
- CDN for static assets

### Data Scaling
- Firestore query optimization
- Pagination for large datasets
- Caching strategies
- Database indexing

### Feature Scaling
- Modular simulator architecture
- Plugin system for new automata types
- Microservice architecture (future)
- API versioning

## 🔍 Monitoring and Analytics

### Error Tracking
- Client-side error boundaries
- Server-side error logging
- Performance monitoring
- User analytics

### Performance Metrics
- Core Web Vitals
- Bundle size monitoring
- Load time tracking
- User interaction metrics

This architecture documentation provides the foundation for understanding and contributing to the AutomataVerse project. For specific implementation details, refer to the contributing guidelines and individual component documentation.
