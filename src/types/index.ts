export interface DailyData {
  empId: string;
  agentName: string;
  silver: number;
  gold: number;
  platinum: number;
  standard: number;
  total: number;
}

export interface MonthlyData extends DailyData {
  target: number;
  achieved: number;
  remaining: number;
}

export interface MonthData {
  monthly: MonthlyData[];
  daily: Record<string, DailyData[]>;
}