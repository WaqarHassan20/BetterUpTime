import { FiActivity, FiExternalLink, FiTrash2 } from 'react-icons/fi';

interface Website {
  id: string;
  url: string;
  timeAdded: string;
  ticks: Array<{
    status: 'Up' | 'Down' | 'Unknown';
    response_time_ms: number;
    createdAt: string;
  }>;
}

interface WebsiteListProps {
  websites: Website[];
  onDeleteWebsite: (id: string) => void;
}

export default function WebsiteList({ websites, onDeleteWebsite }: WebsiteListProps) {
  // Get website status
  const getStatus = (site: Website) => {
    if (!site.ticks?.length) return { status: 'Unknown', time: '--', color: 'bg-gray-500' };
    const latest = site.ticks[0];
    
    const colors = {
      Up: 'bg-green-500',
      Down: 'bg-red-500',
      Unknown: 'bg-gray-500'
    };
    return {
      status: latest.status,
      time: `${latest.response_time_ms}ms`,
      color: colors[latest.status]
    };
  };

  // Get display name from URL
  const getDisplayName = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Monitored Websites ({websites.length})</h2>
      </div>

      {websites.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <FiActivity className="mx-auto mb-4 text-4xl" />
          <p>No websites added yet. Add your first website above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Website</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Response Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Last Check</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {websites.map((site) => {
                const status = getStatus(site);
                const displayName = getDisplayName(site.url);
                const favicon = `https://www.google.com/s2/favicons?domain=${site.url}`;
                
                return (
                  <tr key={site.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={favicon} 
                          alt="" 
                          className="w-5 h-5"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        <div>
                          <div className="font-medium">{displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {status.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {site.ticks?.[0]?.createdAt ? 
                        new Date(site.ticks[0].createdAt).toLocaleString() : 
                        'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(site.url, '_blank')}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
                          title="Visit website"
                        >
                          <FiExternalLink />
                        </button>
                        <button
                          onClick={() => onDeleteWebsite(site.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
                          title="Delete website"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
