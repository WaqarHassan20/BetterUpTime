import { FiActivity, FiMonitor, FiSettings } from 'react-icons/fi';

interface Region {
  id: string;
  name: string;
}

interface MonitoringControlsProps {
  regions: Region[];
  selectedRegionId: string;
  workerId: string;
  processingPusher: boolean;
  processingWorker: boolean;
  websitesCount: number;
  onRegionChange: (regionId: string) => void;
  onWorkerIdChange: (workerId: string) => void;
  onTriggerPusher: () => void;
  onTriggerWorker: () => void;
  onManageRegions: () => void;
}

export default function MonitoringControls({
  regions,
  selectedRegionId,
  workerId,
  processingPusher,
  processingWorker,
  websitesCount,
  onRegionChange,
  onWorkerIdChange,
  onTriggerPusher,
  onTriggerWorker,
  onManageRegions
}: MonitoringControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Monitoring Controls</h2>
      
      {/* Worker Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Region
          </label>
          <select
            value={selectedRegionId}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a region...</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.id.slice(0, 8)}...)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Worker ID
          </label>
          <input
            type="text"
            value={workerId}
            onChange={(e) => onWorkerIdChange(e.target.value)}
            placeholder="e.g., worker-1, monitoring-bot"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onTriggerPusher}
          disabled={processingPusher || websitesCount === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <FiActivity className={processingPusher ? 'animate-spin' : ''} />
          {processingPusher ? 'Adding to Queue...' : 'Add to Queue'}
        </button>
        
        <button
          onClick={onTriggerWorker}
          disabled={processingWorker || !selectedRegionId || !workerId.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <FiMonitor className={processingWorker ? 'animate-spin' : ''} />
          {processingWorker ? 'Processing...' : 'Process Queue'}
        </button>

        <button
          onClick={onManageRegions}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <FiSettings />
          Manage Regions
        </button>
      </div>
      
      <div className="mt-3 text-sm text-gray-400">
        <p>• <strong>Add to Queue:</strong> Adds only NEW (unchecked) websites to the monitoring queue</p>
        <p>• <strong>Process Queue:</strong> Processes websites in the selected region with specified worker ID</p>
        <p>• <strong>Manage Regions:</strong> Create and manage monitoring regions</p>
      </div>
    </div>
  );
}
