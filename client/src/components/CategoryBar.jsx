const categories = ["All", "Tools", "Electronics", "Kitchen", "Camping", "Photography", "Sports", "Outdoor", "Garden", "Home", "Other"];

export default function CategoryBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="w-full md:w-auto">
      <label className="block text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-2">Category</label>
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full appearance-none rounded-full border border-gray-200 bg-white px-5 py-3 pr-10 text-sm font-semibold text-gray-700 shadow-sm outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}