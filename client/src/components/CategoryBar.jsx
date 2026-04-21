const categories = ["All", "Tools", "Electronics", "Kitchen", "Camping", "Photography", "Sports", "Outdoor", "Garden", "Home", "Other"];

export default function CategoryBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-6 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === cat
              ? "bg-green-900 text-white border-green-900 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-green-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}