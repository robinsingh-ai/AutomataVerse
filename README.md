# Automata-Verse

Automata-Verse is an interactive educational platform for learning and experimenting with theory of computation concepts. The application provides intuitive visual simulators for various automata models that are fundamental to computer science.

![Automata-Verse Logo](public/logo.png)

## Features

### Interactive Simulators
- **Deterministic Finite Automaton (DFA)** - Visualize and simulate DFAs with step-by-step execution
- **Nondeterministic Finite Automaton (NFA)** - Experiment with multiple possible state transitions
- **Pushdown Automaton (PDA)** - Understand stack-based computation with visual stack representation
- **Turing Machine (TM)** - Explore the power of Turing Machines with multi-tape support and intuitive tape visualization
- **Finite State Machine (FSM)** - Moore and Mealy machines with output visualization

### Cloud Features
- **Cloud Save** - Save your automata designs securely to the cloud and access them from anywhere
- **Sharing** - Generate shareable links to your automata designs for easy collaboration
- **JSON Import/Export** - Load and save machines using JSON format for easy backup and migration

### Interactive Testing
- Test your machines with custom input strings 
- Watch state transitions in real-time with step-by-step visualization
- Visualize computation paths in all automata types

### User Profiles
- Create your personal profile to manage all your saved machines
- Track your learning progress
- Customize your learning experience

### Learning Resources
- Comprehensive tutorials on automata theory
- Interactive demonstrations with explanations
- Step-by-step guides for building and understanding different automata models

## Simulators in Detail

Automata-Verse provides a comprehensive suite of simulators covering the most important computational models in automata theory:

### Deterministic Finite Automaton (DFA)
The DFA simulator allows you to:
- Create and edit states with intuitive drag-and-drop interface
- Define transitions between states with labeled edges
- Set initial and accepting states
- Test input strings with step-by-step visualization
- See immediate validation of your automaton design
- Export and share your creations

### Nondeterministic Finite Automaton (NFA)
Our NFA simulator extends the DFA capabilities with:
- Support for epsilon (ε) transitions
- Visualization of multiple active states simultaneously
- Animation of parallel state transitions
- Step-by-step tracing of all possible computation paths
- Conversion between NFA and DFA representations

### Pushdown Automaton (PDA)
The PDA simulator includes:
- Visual stack representation that updates in real-time
- Support for stack operations (push, pop)
- Step-by-step animation of stack changes
- Clear visualization of how the stack influences state transitions
- Detailed breakdowns of computation steps

### Turing Machine (TM)
Our most powerful simulator offers:
- Multi-tape support for complex algorithms
- Intuitive visualization of tape contents
- Step-by-step execution with tape movement animation
- Support for user-defined transition functions
- Ability to create, save, and load complex Turing Machines
- Customizable tape alphabet and state set

Each simulator features a consistent user interface making it easy to transition between different computational models while learning the unique capabilities and constraints of each.

## Non-Determinism and Epsilon Transitions

Automata-Verse includes advanced implementations for handling non-determinism and epsilon transitions, making it an ideal platform for exploring these powerful theoretical concepts.

### Non-Deterministic Finite Automaton (NFA) Implementation

Our NFA simulator features sophisticated algorithms for non-deterministic computation:

#### Handling Non-Determinism
- **Breadth-First Search (BFS)**: Systematically explores all possible computation paths using an efficient BFS algorithm
- **Multiple Active States**: Tracks and visualizes all states the automaton could be in simultaneously
- **Path Tracking**: Records the complete path from start to acceptance for educational visualization
- **Visual Path Exploration**: Shows exactly which path led to acceptance or rejection

#### Epsilon Transition Support
- **Toggle Support**: Easily enable or disable epsilon transitions with a single click
- **Epsilon Closure Computation**: Automatically computes the epsilon closure of states
- **Validation**: Ensures epsilon transitions are valid when enabled
- **Real-Time Updates**: Updates epsilon closures as transitions and states change

#### Non-Deterministic Execution
- **Two-Phase Simulation**:
  1. **Search Phase**: Quickly searches for an accepting path without visualization
  2. **Visualization Phase**: Once found, clearly shows the accepting path step-by-step
- **Cycle Detection**: Prevents infinite loops in NFAs with cycles
- **State Visualization**: Highlights all current states during simulation
- **Transition Animation**: Clearly shows which transitions are being taken

### Pushdown Automaton (PDA) Implementation

Our PDA simulator extends non-deterministic capabilities with stack operations:

#### Advanced Non-Determinism
- **Stack-Aware Path Exploration**: Explores all possible paths while tracking stack configurations
- **Accepting Path Visualization**: When a string is accepted, visualizes the exact path and stack operations that led to acceptance
- **Context-Free Language Support**: Handles the full range of context-free languages through non-deterministic computation

#### Comprehensive Stack Visualization
- **Real-Time Stack Updates**: Visualizes stack operations (push/pop) in real time
- **Stack History**: Tracks the complete stack history throughout the computation
- **Operation Highlighting**: Clearly indicates which stack operations occur at each step

#### Implementation Features
- **Epsilon Transitions**: Full support for epsilon transitions that don't consume input
- **Empty Stack Transitions**: Support for transitions on empty stack (ε)
- **Multiple Transition Options**: Handles cases where multiple transitions could apply to the same input and stack configuration
- **Comprehensive Acceptance Criteria**: Supports acceptance by final state and/or empty stack

Both simulators provide intuitive visualizations that make complex theoretical concepts accessible to students and researchers, allowing for deep exploration of the power of non-determinism in computational models.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **State Management**: Redux
- **Authentication**: Firebase Authentication
- **Styling**: CSS Modules / Tailwind CSS
- **Visualization**: Custom-built graph visualization components

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Automata-Verse.git
   cd Automata-Verse
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   - Create a `.env.local` file based on `.env.example`
   - Add your Firebase configuration

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To build the application for production with source code protection:

```bash
npm run build:secure
npm start
```

## Security

This project includes configurations to protect source code and problem solutions when deployed. See the following files for security guidance:

- [SECURITY.md](./SECURITY.md) - General security guidelines
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Instructions for secure Vercel deployment

## Usage

### Creating a New Automaton
1. Navigate to the specific simulator (DFA, NFA, PDA, or TM)
2. Use the intuitive UI to add states and transitions
3. Set initial and accepting states
4. Test your automaton with input strings

### Running Simulations
1. Enter an input string in the provided field
2. Use the play, step forward, or step backward controls
3. Observe state transitions and, for PDA and TM, stack/tape changes
4. Analyze acceptance or rejection of input strings

## Project Structure

```
src/
├── app/                  # Next.js app structure
│   ├── api/              # API routes
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── demo/             # Demo automata examples
│   ├── learn/            # Learning resources
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile management
│   ├── simulator/        # Automata simulators
│   ├── signup/           # Registration pages
│   ├── store/            # State management
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the importance of automata theory in computer science education
- Thanks to all contributors who have invested their time into making this project better
- Special thanks to the theoretical computer science community for their fundamental work

---

© 2023-2025 Automata-Verse Team

