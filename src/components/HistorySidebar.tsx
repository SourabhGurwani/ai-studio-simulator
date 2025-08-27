// src/components/HistorySidebar.tsx
import { HistoryItem } from '../types/types';

interface HistorySidebarProps {
  historyItems: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  historyItems,
  onSelectItem,
  onClearHistory,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <aside className="w-full lg:w-80 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">History</h2>
        {historyItems.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
            aria-label="Clear all history"
          >
            Clear All
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No generation history yet</p>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectItem(item);
                }
              }}
            >
              <img
                src={item.thumbnailUrl}
                alt="History thumbnail"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                {item.prompt}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 capitalize">{item.style}</span>
                <span className="text-gray-400">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};