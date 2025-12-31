import type { LoadingSpinnerProps } from '@/types/components';

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`} />
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
