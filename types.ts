
export enum AppState {
  WELCOME,
  CAPTURING,
  LOADING,
  RESULTS,
  ERROR,
}

export interface Recipe {
  title: string;
  description: string;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
}
