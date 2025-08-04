import { FiPlus, FiTrash2, FiDatabase } from 'react-icons/fi';

interface Region {
  id: string;
  name: string;
}

interface RegionModalProps {
  isOpen: boolean;
  regions: Region[];
  newRegionName: string;
  loading: boolean;
  onClose: () => void;
  onRegionNameChange: (name: string) => void;
  onAddRegion: (e: React.FormEvent) => void;
  onDeleteRegion: (id: string) => void;
  onCreateRedisGroup: (regionId: string, regionName: string) => void;
}

export default function RegionModal({
  isOpen,
  regions,
  newRegionName,
  loading,
  onClose,
  onRegionNameChange,
  onAddRegion,
  onDeleteRegion,
  onCreateRedisGroup
}: RegionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Manage Regions</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Add Region Form */}
        <form onSubmit={onAddRegion} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newRegionName}
              onChange={(e) => onRegionNameChange(e.target.value)}
              placeholder="Region name (e.g., US-East-1)"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <FiPlus />
              Add
            </button>
          </div>
        </form>

        {/* Regions List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {regions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No regions created yet</p>
          ) : (
            regions.map((region) => (
              <div
                key={region.id}
                className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium">{region.name}</span>
                  <div className="text-xs text-gray-400 mt-1">ID: {region.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCreateRedisGroup(region.id, region.name)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded"
                    title="Create Redis Group"
                    disabled={loading}
                  >
                    <FiDatabase />
                  </button>
                  <button
                    onClick={() => onDeleteRegion(region.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded"
                    title="Delete region"
                    disabled={loading}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-3">
            <p><strong>💡 Tip:</strong> After creating a region, click the <FiDatabase className="inline mx-1" /> button to create a Redis consumer group for monitoring.</p>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
