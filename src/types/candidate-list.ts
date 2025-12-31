import type { Candidate } from './candidate';


export interface CandidateListProps {
  
  candidates: Candidate[];
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  onEdit: (candidate: Candidate) => void;
}

export interface CandidateFiltersProps {
  search: string;
  position: string;
  status: string;
  experience: string;
  positions: string[];
  sortBy: string;
  onSearchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}
