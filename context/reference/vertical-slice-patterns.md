# Strategy pattern

Locaiton: inside feature folder that has multiple ways to execute
Role: handles different implementations of the same action. Core logic remains identical
- slice.strategy.ts (e.g. login.google.ts, login.email.ts)

# Command pattern

Location: inside specific feature folder
role: Contains primary entry point function for the feature. groups input data, validation, and execution into one unit
- action.command.ts (e.g. login.command.ts, checkout.command.ts)

# Service Contract Pattern

Location: root of module that provides data
Role: defines a type or interface describing what a service must provide. Other slices import this type to ensure they are "talking the same language" without importing logic from other modules
- slice.contract.ts (e.g. auth.contract.ts, payments.contract.ts)

# Public API Pattern

Location: root of each module folder
Role: exports only functions or types that other slices are allowed to use.
- slice.public.ts (e.g. auth.public.ts, payments.public.ts)
- index.ts (reexports everything in slice.public.ts)

# Observer / Event Pattern

Location: in global shared folder
Role: handling a slide telling another slice that something happened
- shared/event-bus.ts

# Best practices

- Naming files: feature.domain.ts

Example of folder structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.public.ts       <-- [PATTERN: Public API]
│   │   ├── auth.contract.ts     <-- [PATTERN: Service Contract]
│   │   ├── login/               <-- Vertical Slice (Action-based)
│   │   │   ├── login.command.ts <-- [PATTERN: Command]
│   │   │   ├── login.schema.ts  <-- (Validation logic)
│   │   │   └── strategies/      <-- [PATTERN: Strategy]
│   │   │       ├── google.ts
│   │   │       └── email.ts
│   │   └── shared/              <-- Internal Auth utilities only
│   │
│   └── payments/
│       ├── payments.public.ts   <-- [PATTERN: Public API]
│       ├── checkout/            <-- Vertical Slice
│       │   ├── checkout.command.ts
│       │   └── strategies/      <-- [PATTERN: Strategy]
│       │       ├── stripe.ts
│       │       └── paypal.ts
│       └── shared/              <-- Internal Payment utilities
│
└── shared/                      <-- Global, non-business logic
    ├── components/              <-- UI Kit (Buttons, Inputs)
    ├── utils/                   <-- Date formatters, Logger
    └── event-bus.ts             <-- [PATTERN: Observer/Events]
```

# Rules

1. Single folder: A feature must be entirely contained within its own folder

Enforcement: code reviews

2. No Horizontal Imports: A file inside modules/auth/login is strictly forbidden from importing anything from modules/auth/reset-password or modules/payments/checkout

Enforcement: ESLint with the eslint-plugin-import or nx (if using a monorepo) to block deep-path imports

3. Shared is for Primitives: src/shared folder cannot contain any "Business Logic."

Enforcement: shared should only contain "leaf" nodes—things that don't depend on anything else in the app

4. Dependency Flow: Slices depend on Contracts, not Implementations

Enforcement: If a slice's import list includes concrete classes/functions from another slice, it’s a red flag. It should only import Types or Interfaces

5. Public API: Every slice must have a public.ts (or index.ts). This is the only file that can be imported by the outside world

Enforcement: Use a tool like dependency-cruiser to automatically fail the build if someone bypasses the public.ts file

Increase friction via automated tools:
- ESLint: Throw a red error in the IDE if Module A tries to import from Module B's internals
- Zod: Force every Command to have a schema. If there's no schema, the command won't run. This prevents "loose" data from floating between slices
- Dependency Cruiser: Generates a graph of your code. If it sees a circular dependency (A -> B -> A), it fails the CI/CD pipeline immediately
- Tests per Slice: Enforce a rule that every /slice-folder must contain its own .spec.ts file. If the tests for "Login" require the "Payments" DB to be running, the slices are too coupled

# Examples

## Strategy

```ts
// 1. The Type Definition
type AuthStrategy<TInput> = (credentials: TInput) => Promise<User>;

// 2. The Implementation (Strategies)
const googleStrategy: AuthStrategy<string> = async (token) => {
  return { id: 'g123', email: 'user@google.com' };
};

const emailStrategy: AuthStrategy<{ email: string; password: string }> = async ({ email, password }) => {
  return { id: 'db456', email };
};

// 3. The Execution (The Slice logic)
const login = async <TInput>(strategy: AuthStrategy<TInput>, data: TInput) => {
  const user = await strategy(data);
  return user;
};
```

## Command

```ts
// 1. The Command "Creator"
const createRegisterUserCommand = (input: RegisterInput) => {
  // We return an object with a standard 'execute' property
  return {
    execute: async () => {
      validate(input);
      await db.save(input);
      return { success: true };
    }
  };
};

// 2. Usage
const cmd = createRegisterUserCommand({ email: 'hi@me.com', pass: '123' });
await cmd.execute();
```

## Service contract

```ts
// --- Inside modules/auth/auth.contract.ts ---
export type AuthContract = {
  getCurrentUser: () => Promise<{ id: string; role: string } | null>;
};

// --- Inside modules/payments/checkout.ts ---
// We pass the contract as a dependency to the function
const processCheckout = async (auth: AuthContract) => {
  const user = await auth.getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  // Process payment...
};
```

## Public API

```ts
// --- modules/auth/auth.public.ts ---

// We import everything from the internals
import { loginCommand } from './login/login.command';
import { AuthContract } from './auth.contract';

// We ONLY export what we want public
export const authApi = {
  login: loginCommand,
};

export type { AuthContract }; // Exporting only the type/contract

// modules/auth/index.ts
// we reexport everything in auth.public.ts
export * from './auth.public';
```

## Observer Pattern

```ts
// --- shared/event-bus.ts ---
type AppEvents = {
  'USER_REGISTERED': { id: string; email: string };
  'PAYMENT_SUCCESS': { amount: number; transactionId: string };
};

type Listener<K extends keyof AppEvents> = (data: AppEvents[K]) => void;
const listeners: Record<string, Listener<any>[]> = {};

export const eventBus = {
  // Subscribe (The Observer)
  on: <K extends keyof AppEvents>(event: K, callback: Listener<K>) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },
  // Publish (The Subject)
  emit: <K extends keyof AppEvents>(event: K, data: AppEvents[K]) => {
    listeners[event]?.forEach(cb => cb(data));
  }
};

// --- Usage across slices ---
// In Payments:
eventBus.on('USER_LOGGED_IN', (user) => console.log('Prepare cart for', user.id));

// In Auth:
eventBus.emit('USER_LOGGED_IN', { id: '123' });
```


# Types
- Use generics in the shared folder logic to keep things flexible but strictly types
- Use `unknown` inside a slice if you are receiving data from the outside world (like an API) that you haven't validated yet


# Composition root
The Composition Root is the "God File." It is the only place in your entire app allowed to know about every slice
Location: It should be at the very top of your folder tree (usually src/main.ts or src/index.ts).
Imports slices and plugs them into each other


```ts
// modules/payments/checkout.ts
// This is the "Contract" - a simple requirement
type UserProvider = { getUserId: () => string };

const checkout = (userProvider: UserProvider) => {
  const id = userProvider.getUserId();
  console.log(`Charging user: ${id}`);
};

// src/main.ts
import { authService } from './modules/auth/auth.public';
import { checkout } from './modules/payments/payments.public';

// We "Wire" them together here.
// Payments gets exactly what it needs, but it doesn't know it's coming from Auth.
const startApp = () => {
  const userProvider = {
    getUserId: () => authService.getCurrentUser().id
  };

  checkout(userProvider);
};
```


- Slices: Live in modules/. They are selfish. they only care about their own logic and their own contracts.
- Shared: Lives in shared/. It contains "dumb" tools (Date helpers, UI components, Event Bus).
- Composition Root: Lives in src/main.ts. It is the "Social Director" that introduces Slices to each other.


# Rules for AI

- Flatness: Don't let the AI create deep nested folder structures within a slice. Keep it flat: command, schema, public-api
- No Global Side-Effects: Instruct the AI that slices must communicate via the eventBus
- Public API: Strictly enforce the public.ts pattern