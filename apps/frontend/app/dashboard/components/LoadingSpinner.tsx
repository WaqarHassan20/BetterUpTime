import { FiActivity } from 'react-icons/fi';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading dashboard..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <FiActivity className="animate-spin mx-auto mb-4 text-4xl" />
        <p>{message}</p>
      </div>
    </div>
  );
}
