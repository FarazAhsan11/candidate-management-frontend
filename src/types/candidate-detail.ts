import type { Candidate } from './candidate';

export interface CandidateInfoProps {
  candidate: Candidate;
}


export interface RemarksWidgetProps {
  candidate: Candidate;
  onUpdate: (updated: Candidate) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
