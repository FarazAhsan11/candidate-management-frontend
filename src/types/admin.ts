
export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  pendingReviews: number;
}
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'hr' | 'interviewer';
    createdAt: string;
}