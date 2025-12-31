import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { FilterState, FilterAction } from '@/types';

interface CandidateListContextType {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}

const CandidateListContext = createContext<CandidateListContextType | undefined>(undefined);

const initialState: FilterState = {
  search: '',
  position: 'All',
  status: 'All',
  experience: 'All',
  sortBy: 'date-desc',
  currentPage: 1,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, currentPage: 1 };
    case 'SET_POSITION':
      return { ...state, position: action.payload, currentPage: 1 };
    case 'SET_STATUS':
      return { ...state, status: action.payload, currentPage: 1 };
    case 'SET_EXPERIENCE':
      return { ...state, experience: action.payload, currentPage: 1 };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

export function CandidateListProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  return (
    <CandidateListContext.Provider value={{ filters, dispatch }}>
      {children}
    </CandidateListContext.Provider>
  );
}

export function useCandidateFilters() {
  const context = useContext(CandidateListContext);
  if (!context) {
    throw new Error('useCandidateFilters must be used within CandidateListProvider');
  }
  return context;
}
