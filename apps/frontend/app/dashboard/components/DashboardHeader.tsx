import { FiShield, FiLogOut } from 'react-icons/fi';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {/* Logo and Title */}
        <div className="relative">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <FiShield className="text-white text-2xl" />
          </div>
          {/* Pulse animation for online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-gray-900"></div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            UpTime Monitor
          </h1>
          <p className="text-gray-400 text-sm">Keep your websites online 24/7</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg hover:shadow-red-500/25"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
}
