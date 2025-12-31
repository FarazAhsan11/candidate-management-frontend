import type { InfoRowProps } from '@/types';

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <p className="flex justify-between">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="font-bold text-gray-900">{value}</span>
    </p>
  );
}
