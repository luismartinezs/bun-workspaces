import LoginView from './login/login-view.vue';
import { authState } from './auth.state';
import type { AuthContract } from './auth.contract';

// Export the component for use in the app layout
export { LoginView };

// Export the service implementation for other modules
export const authService: AuthContract = authState.service;

export type { AuthContract };
