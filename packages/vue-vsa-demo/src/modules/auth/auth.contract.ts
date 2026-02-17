export type User = {
  username: string;
};

export type AuthContract = {
  getCurrentUser: () => User | null;
};
