import { FiPlus } from 'react-icons/fi';

interface AddWebsiteFormProps {
  newUrl: string;
  loading: boolean;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddWebsiteForm({ 
  newUrl, 
  loading, 
  onUrlChange, 
  onSubmit 
}: AddWebsiteFormProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Website</h2>
      <form onSubmit={onSubmit} className="flex gap-4">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          <FiPlus />
          Add Website
        </button>
      </form>
    </div>
  );
}
