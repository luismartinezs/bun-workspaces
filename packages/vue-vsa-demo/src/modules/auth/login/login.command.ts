import { eventBus } from '../../../shared/event-bus';
import { type LoginInput, loginSchema } from './login.schema';

type LoginDeps = {
  setUser: (user: { username: string }) => void;
};

export const createLoginCommand = (deps: LoginDeps) => (input: LoginInput) => ({
  execute: async () => {
    const result = loginSchema.safeParse(input);
    if (!result.success) {
      throw new Error(result.error?.issues?.[0]?.message ?? 'Invalid input');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded check for demo
    if (input.password === 'secret123') {
      const user = { username: input.username };
      deps.setUser(user);
      eventBus.emit('USER_LOGGED_IN', user);
      return { success: true };
    }

    throw new Error('Invalid credentials (try "secret123")');
  }
});
