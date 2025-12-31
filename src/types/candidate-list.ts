import type { Candidate } from './candidate';

export interface CandidateListProps {
  candidates: Candidate[];
  onDelete: (id: string) => void;
  totalPages: number;
  loading: boolean;
  onEdit: (candidate: Candidate) => void;
}

export interface CandidateFiltersProps {
  positions: string[];
}
