Imagine you want to log every login attempt, and if it fails 3 times, you want to trigger a "Lock Account" flow

```ts
// The Command Logic (Inside the Slice)
const createLoginCommand = (credentials: Credentials) => {
  return {
    // metadata makes it useful for logging/debugging
    name: "LoginUser",
    data: credentials,

    execute: async (context: AppContext) => {
      // 1. Validation logic
      // 2. Business logic (Check password)
      // 3. Side effects (Emit 'LOGIN_SUCCESS' event)
      console.log(`Executing ${this.name} for ${credentials.email}`);
    }
  };
};

// Why is this useful?
// Because I can write a "Command Runner" in shared/ that does this:
const runWithRetry = async (command) => {
  try {
    await command.execute();
  } catch (e) {
    console.error(`Command ${command.name} failed. Retrying...`);
    // Logic to retry or log to an external service like Sentry
  }
};
```

The Point: You don't have to write "logging" or "error handling" logic inside every feature. You write it once in a "Runner," and every slice exports a Command that the runner can handle


A command is a data structure that contains everything needed to perform an action. This allows you to treat "doing something" like a variable that you can pass around. There are three common ways to write a Command in TypeScript:

# factory

Recommended. Lock in data at the moment of creation

```ts
const createLoginCommand = (creds) => ({
  type: 'LOGIN_ACTION',
  execute: () => { /* logic using creds */ }
});
```

# pure data

Command is just data, Separate handler knows what to do. Redux style
```ts
const loginCommand = {
  type: 'LOGIN_ACTION',
  payload: { email: '...', pass: '...' }
};

// The logic lives elsewhere
const execute = (command) => {
  if (command.type === 'LOGIN_ACTION') { /* logic */ }
};
```

# Self-Contained Function

If metadata is not needed

```ts
const prepareLogin = (creds) => {
  return () => { /* logic using creds */ };
};

const runThisLater = prepareLogin({ email: '...' });
runThisLater(); // This is technically a Command
```

Command = delayed function execution