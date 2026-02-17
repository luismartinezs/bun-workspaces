import { ref } from 'vue';
import type { User, AuthContract } from './auth.contract';

// Internal state common to the auth module
const currentUser = ref<User | null>(null);

export const authState = {
  setUser: (user: User) => {
    currentUser.value = user;
  },
  // Implementation of the contract
  service: {
    getCurrentUser: () => currentUser.value
  } satisfies AuthContract
};
