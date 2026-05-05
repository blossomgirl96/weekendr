export interface Kid {
  id: string;
  age: number;
}

export interface KidPreferences {
  startingAddress: string;
  targetLocality: string;
  kids: Kid[];
  interests: string[];
  budgetCeiling: number;
  vibe: 'active' | 'educational' | 'relaxing' | 'creative';
}

export interface CostBreakdown {
  entry: string;
  parking: string;
  food: string;
  total: number;
}

export interface Activity {
  title: string;
  description: string;
  location: string;
  time: string;
  cost: CostBreakdown;
  driveTime: string;
  whyItsGreat: string;
  ageSuitability: string;
  mapsUrl?: string;
  isIndoor: boolean;
}

export interface DayPlan {
  primary: Activity[];
  planB: Activity[]; // Indoor fallback
}

export interface WeekendPlan {
  saturday: DayPlan;
  sunday: DayPlan;
  tips: string[];
  weatherForecast: string;
}
