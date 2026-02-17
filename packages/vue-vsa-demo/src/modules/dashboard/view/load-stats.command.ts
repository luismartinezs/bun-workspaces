import type { AuthContract } from '../../auth/auth.public';

type StatsDeps = {
  auth: AuthContract;
};

export const createLoadStatsCommand = (deps: StatsDeps) => async () => {
  const user = deps.auth.getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: You must be logged in to view stats');
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    visits: Math.floor(Math.random() * 1000),
    sales: Math.floor(Math.random() * 100)
  };
};
