import type { ReactNode } from 'react';


export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  message?: string;
}


export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface AdminRouteProps {
  children: ReactNode;
}

export interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export interface InfoRowProps {
  label: string;
  value: string | number;
}
