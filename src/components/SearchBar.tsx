"use client";

export default function SearchBar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search recipes by name or ingredient..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-yellow-500 bg-gray-800 text-yellow-400 placeholder-yellow-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
      />
    </div>
  );
}

