import type { Candidate } from './candidate';


export interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export interface AddCandidateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, candidateId?: string) => Promise<void>;
  candidate?: Candidate | null;
}

export interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

export interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User | null;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'hr' | 'interviewer';
}
