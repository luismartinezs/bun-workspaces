# Functional Programming Cheatsheet

Replacing Class-Based OOP with Functional Patterns in TypeScript.

## 1. The "Service" Pattern
Classes are often used just to group related functions. Modules do this natively.

### ❌ Class Approach
```ts
class UserService {
  constructor(private db: Database) {}

  async getUser(id: string) {
    return this.db.findUser(id);
  }
}
```

### ✅ Functional Approach
Context passing is explicit and tree-shakeable.
```ts
// user.service.ts
export const getUser = async (db: Database, id: string) => {
  return db.findUser(id);
};
```
*Why?* Classes bundle unused methods into your build. Modules allow bundlers to drop what isn't imported.

## 2. Dependency Injection
Classes use constructors to lock dependencies into `this`. FP uses **Higher-Order Functions** or **Partial Application**.

### ❌ Class Approach
```ts
class PaymentProcessor {
  constructor(private stripe: StripeClient) {}

  async charge(amount: number) {
    await this.stripe.charges.create({ amount });
  }
}
```

### ✅ Functional Approach (Factory)
Create a scope that holds the dependencies (Closure).
```ts
export const createPaymentProcessor = (stripe: StripeClient) => ({
  charge: async (amount: number) => {
    await stripe.charges.create({ amount });
  }
});

// Usage
const payments = createPaymentProcessor(stripeClient);
await payments.charge(100);
```

### ✅ Functional Approach (Context - Simpler)
Just pass the dependency when you call it.
```ts
export const charge = async (stripe: StripeClient, amount: number) => {
  await stripe.charges.create({ amount });
};
```

## 3. Strategies & Polymorphism
Interfaces and implementation classes are verbose. Use **Type Unions** and **Maps**.

### ❌ Class Approach
```ts
interface Logger { log(msg: string): void }
class ScreenLogger implements Logger {
  log(msg: string) { console.log(msg) }
}
```

### ✅ Functional Approach
Data is separating from behavior.
```ts
type Logger = (msg: string) => void;

const screenLogger: Logger = (msg) => console.log(msg);
const fileLogger: Logger = (msg) => fs.appendFileSync("log.txt", msg);

// Storage
const loggers: Record<string, Logger> = {
  screen: screenLogger,
  file: fileLogger
};
```

## 4. Private Methods
Classes use `private` to hide helper logic. Modules use **export scope**.

### ❌ Class Approach
```ts
class Parser {
  public parse(data: any) {
    return this.clean(data);
  }
  private clean(data: any) { ... }
}
```

### ✅ Functional Approach
If you don't export it, it's effectively private.
```ts
// Not exported = private
const clean = (data: any) => { ... }

export const parse = (data: any) => {
  return clean(data);
};
```

## 5. State Management
Classes mutate `this.state`. FP returns **New State** (Immutability).

### ❌ Class Approach
```ts
class Counter {
  private count = 0;
  increment() { this.count++; }
}
```

### ✅ Functional Approach
Pure definition of the change.
```ts
type State = { count: number };

export const increment = (state: State): State => ({
  ...state,
  count: state.count + 1
});
```

## Summary Table

| Concept | OOP (Class) | FP (Functional) |
|:---|:---|:---|
| **Grouping** | Class | Module (File) |
| **Encapsulation** | `private` | Not exported |
| **Dependencies** | Constructor | Factory Function / Argument |
| **Polymorphism** | Interface + `implements` | Function Type + Object Map |
| **State** | `this.state` mutation | `(state) => newState` |
