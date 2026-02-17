export type DashboardStats = {
  visits: number;
  sales: number;
};

export type DashboardContract = {
  getStats: () => Promise<DashboardStats>;
};
