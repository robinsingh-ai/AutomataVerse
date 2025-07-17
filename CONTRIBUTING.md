# Contributing to AutomataVerse

Thank you for your interest in contributing to AutomataVerse! This document provides comprehensive guidelines for contributing to our interactive automata theory platform.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Architecture](#project-architecture)
4. [Contribution Guidelines](#contribution-guidelines)
5. [Code Standards](#code-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Simulator Development](#simulator-development)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Documentation](#documentation)
10. [Pull Request Process](#pull-request-process)
11. [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Git**
- **Firebase CLI** (for local development)
- **Code Editor** (VS Code recommended)

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🛠️ Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/AutomataVerse.git
cd AutomataVerse
```

### 2. Environment Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Firebase configuration to .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (optional for local development)
firebase init
```

### 4. Development Server

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 5. Build and Test

```bash
# Build for production
npm run build

# Run secure build
npm run build:secure

# Start production server
npm start
```

## 🏗️ Project Architecture

Please read our [Architecture Documentation](./ARCHITECTURE.md) for a comprehensive understanding of:

- System architecture
- Component structure
- State management
- Data flow patterns
- Security considerations

## 🤝 Contribution Guidelines

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes** - Fix existing issues
2. **New Features** - Add new simulators or functionality
3. **Performance Improvements** - Optimize existing code
4. **Documentation** - Improve docs and comments
5. **UI/UX Enhancements** - Improve user experience
6. **Testing** - Add or improve tests
7. **Accessibility** - Enhance accessibility features

### Issue Types

- 🐛 **Bug Report** - Something isn't working
- 🚀 **Feature Request** - New feature or enhancement
- 📚 **Documentation** - Documentation improvements
- 🎨 **Design** - UI/UX improvements
- 🔧 **Maintenance** - Code maintenance and refactoring

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for major changes
3. **Discuss your approach** with maintainers
4. **Follow the code style** and conventions
5. **Write tests** for new features

## 📝 Code Standards

### TypeScript Guidelines

```typescript
// Use explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

// Prefer interfaces over types for objects
interface ComponentProps {
  title: string;
  onSave: (data: User) => void;
}

// Use const assertions for immutable data
const SIMULATOR_TYPES = ['dfa', 'nfa', 'pda', 'tm', 'fsm'] as const;
type SimulatorType = typeof SIMULATOR_TYPES[number];

// Use proper generics
function createSimulator<T extends SimulatorType>(
  type: T,
  config: SimulatorConfig<T>
): Simulator<T> {
  // Implementation
}
```

### React Component Guidelines

```typescript
// Use functional components with hooks
import React, { useState, useEffect, useCallback } from 'react';

interface Props {
  title: string;
  onSave: (data: string) => void;
}

const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  const [value, setValue] = useState('');

  // Use useCallback for event handlers
  const handleSave = useCallback(() => {
    onSave(value);
  }, [value, onSave]);

  // Use useEffect for side effects
  useEffect(() => {
    // Side effect logic
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Input field"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default MyComponent;
```

### CSS and Styling Guidelines

```css
/* Use Tailwind CSS classes */
.button-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Custom CSS for complex styling */
.simulator-canvas {
  @apply relative w-full h-full overflow-hidden;
}

/* Use CSS variables for themes */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

[data-theme="dark"] {
  --primary-color: #60a5fa;
  --secondary-color: #94a3b8;
}
```

### File Naming Conventions

```
components/
├── ComponentName.tsx          # PascalCase for components
├── hooks/
│   └── useCustomHook.ts       # camelCase with 'use' prefix
├── utils/
│   └── helperFunction.ts      # camelCase for utilities
├── types/
│   └── simulatorTypes.ts      # camelCase for type files
└── constants/
    └── simulatorConstants.ts  # camelCase for constants
```

## 🧪 Testing Guidelines

### Unit Testing

```typescript
// Example test file: __tests__/simulators/dfa/dfaSimulator.test.ts
import { simulateDFA } from '../../../src/simulators/dfa/utils/dfaSimulator';

describe('DFA Simulator', () => {
  const mockDFA = {
    states: ['q0', 'q1'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': 'q1', '1': 'q0' },
      q1: { '0': 'q0', '1': 'q1' }
    },
    initialState: 'q0',
    acceptingStates: ['q1']
  };

  it('should accept valid strings', () => {
    expect(simulateDFA('0', mockDFA)).toBe(true);
    expect(simulateDFA('01', mockDFA)).toBe(false);
  });

  it('should reject invalid strings', () => {
    expect(simulateDFA('', mockDFA)).toBe(false);
    expect(simulateDFA('2', mockDFA)).toBe(false);
  });
});
```

### Component Testing

```typescript
// Example: __tests__/components/ControlPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../../src/components/ControlPanel';

describe('ControlPanel', () => {
  const mockProps = {
    onRun: jest.fn(),
    onStep: jest.fn(),
    inputString: '',
    onInputChange: jest.fn(),
    isRunning: false,
    validationResult: null
  };

  it('should render control buttons', () => {
    render(<ControlPanel {...mockProps} />);
    
    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Step')).toBeInTheDocument();
  });

  it('should call onRun when run button is clicked', () => {
    render(<ControlPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('Run'));
    expect(mockProps.onRun).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
// Example: __tests__/integration/simulator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import AutomataSimulator from '../../src/simulators/dfa/AutomataSimulator';

describe('DFA Simulator Integration', () => {
  it('should allow creating and testing a DFA', async () => {
    render(
      <Provider store={store}>
        <AutomataSimulator />
      </Provider>
    );

    // Add states
    fireEvent.click(screen.getByText('Add State'));
    
    // Add transitions
    // ... test interactions
    
    // Test input
    fireEvent.change(screen.getByLabelText('Input String'), {
      target: { value: '010' }
    });
    
    fireEvent.click(screen.getByText('Run'));
    
    // Verify results
    expect(screen.getByText('Accepted')).toBeInTheDocument();
  });
});
```

## 🎮 Simulator Development

### Creating a New Simulator

1. **Create simulator directory structure:**

```
src/simulators/new-simulator/
├── AutomataSimulator.tsx
├── components/
│   ├── ControlPanel.tsx
│   ├── NodeCanvas.tsx
│   ├── InputPopup.tsx
│   └── InfoPanel.tsx
├── utils/
│   └── simulator.ts
├── types.ts
└── constants.ts
```

2. **Define TypeScript interfaces:**

```typescript
// types.ts
export interface State {
  id: string;
  x: number;
  y: number;
  isAccepting: boolean;
  isInitial: boolean;
}

export interface Transition {
  from: string;
  to: string;
  label: string;
  // Add specific transition properties
}

export interface SimulatorConfig {
  states: State[];
  transitions: Transition[];
  alphabet: string[];
}
```

3. **Implement simulation algorithm:**

```typescript
// utils/simulator.ts
export function simulateAutomaton(
  input: string,
  config: SimulatorConfig
): SimulationResult {
  // Implementation specific to your automaton type
}

export function validateAutomaton(
  config: SimulatorConfig
): ValidationResult {
  // Validation logic
}
```

4. **Create main simulator component:**

```typescript
// AutomataSimulator.tsx
import React, { useState, useEffect } from 'react';
import { SimulatorConfig, State, Transition } from './types';

const AutomataSimulator: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);
  const [transitions, setTransitions] = useState<Transition[]>([]);
  
  // Implement simulator logic
  
  return (
    <div className="simulator-container">
      <ControlPanel />
      <NodeCanvas />
      <InfoPanel />
    </div>
  );
};

export default AutomataSimulator;
```

### Algorithm Implementation Guidelines

```typescript
// Example: DFA simulation algorithm
function simulateDFA(input: string, dfa: DFA): boolean {
  let currentState = dfa.initialState;
  
  for (const symbol of input) {
    const transition = dfa.transitions[currentState]?.[symbol];
    if (!transition) {
      return false; // No valid transition
    }
    currentState = transition;
  }
  
  return dfa.acceptingStates.includes(currentState);
}

// Example: NFA simulation with epsilon transitions
function simulateNFA(input: string, nfa: NFA): boolean {
  let currentStates = epsilonClosure([nfa.initialState], nfa);
  
  for (const symbol of input) {
    const nextStates: string[] = [];
    
    for (const state of currentStates) {
      const transitions = nfa.transitions[state]?.[symbol] || [];
      nextStates.push(...transitions);
    }
    
    currentStates = epsilonClosure(nextStates, nfa);
  }
  
  return currentStates.some(state => nfa.acceptingStates.includes(state));
}
```

## 🎨 UI/UX Guidelines

### Design System

```typescript
// Theme configuration
const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};
```

### Component Design Patterns

```typescript
// Button component with variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  isLoading,
  onClick,
  children
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
```

### Accessibility Requirements

```typescript
// Ensure keyboard navigation
const SimulatorNode: React.FC<NodeProps> = ({ node, onSelect }) => {
  return (
    <div
      className="simulator-node"
      role="button"
      tabIndex={0}
      aria-label={`State ${node.id}`}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(node);
        }
      }}
    >
      {node.id}
    </div>
  );
};

// Provide screen reader announcements
const SimulationStatus: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {status}
    </div>
  );
};
```

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Simulates a Deterministic Finite Automaton (DFA) with the given input string.
 * 
 * @param input - The input string to process
 * @param dfa - The DFA configuration object
 * @returns True if the input is accepted, false otherwise
 * 
 * @example
 * ```typescript
 * const dfa = {
 *   states: ['q0', 'q1'],
 *   alphabet: ['0', '1'],
 *   transitions: { q0: { '0': 'q1' }, q1: { '1': 'q0' } },
 *   initialState: 'q0',
 *   acceptingStates: ['q1']
 * };
 * 
 * const result = simulateDFA('01', dfa); // returns true
 * ```
 */
export function simulateDFA(input: string, dfa: DFA): boolean {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * ControlPanel component for managing simulator operations.
 * 
 * This component provides controls for running simulations, stepping through
 * execution, and managing input strings.
 * 
 * @param props - Component props
 * @param props.onRun - Callback for running simulation
 * @param props.onStep - Callback for stepping through simulation
 * @param props.inputString - Current input string
 * @param props.onInputChange - Callback for input string changes
 * @param props.isRunning - Whether simulation is currently running
 * @param props.validationResult - Current validation result
 * 
 * @example
 * ```tsx
 * <ControlPanel
 *   onRun={handleRun}
 *   onStep={handleStep}
 *   inputString={input}
 *   onInputChange={setInput}
 *   isRunning={false}
 *   validationResult={null}
 * />
 * ```
 */
const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  // Implementation
};
```

### README Updates

When adding new features, update the main README.md:

```markdown
## New Feature: [Feature Name]

### Description
Brief description of what the feature does.

### Usage
```typescript
// Usage example
```

### Screenshots
![Feature Screenshot](./docs/images/feature-screenshot.png)
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure all tests pass:**
   ```bash
   npm test
   npm run build
   ```

2. **Run linting:**
   ```bash
   npm run lint
   npm run lint:fix
   ```

3. **Update documentation:**
   - Add/update comments
   - Update README if needed
   - Add changelog entry

4. **Test your changes:**
   - Test manually in the browser
   - Test on different screen sizes
   - Test accessibility features

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
Include screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented appropriately
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass
2. **Manual review** by maintainers
3. **Testing** on multiple devices/browsers
4. **Documentation** review
5. **Approval** and merge

### Merge Requirements

- ✅ All CI checks passing
- ✅ At least one maintainer approval
- ✅ No merge conflicts
- ✅ Branch up to date with main
- ✅ All conversations resolved

## 👥 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Help others learn
- Give constructive feedback
- Focus on the issue, not the person

### Communication

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - General questions, ideas
- **Pull Requests** - Code contributions
- **Code Reviews** - Constructive feedback

### Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Reach out to maintainers
- Join our community channels

## 🏆 Recognition

Contributors are recognized in:
- README contributors section
- Release notes
- GitHub contributor graph
- Special mentions for significant contributions

## 📊 Development Metrics

We track:
- Code coverage
- Bundle size
- Performance metrics
- Accessibility compliance
- User feedback

Thank you for contributing to AutomataVerse! Your contributions help make automata theory more accessible to learners worldwide. 🎉

---

For questions or clarifications, please open an issue or reach out to the maintainers.
