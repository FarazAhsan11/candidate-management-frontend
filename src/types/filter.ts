export interface FilterState {
  search: string;
  position: string;
  status: string;
  experience: string;
  sortBy: string;
  currentPage: number;
}

export type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_POSITION'; payload: string }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_EXPERIENCE'; payload: string }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'RESET_FILTERS' };
