import { useState } from "react";
import CategoryBar from "../components/CategoryBar";
import ItemList from "../components/ItemList";
import { useSearch } from "../contexts/SearchContext";

export default function Home() {
  const { searchQuery } = useSearch();
  const [category, setCategory] = useState("All");

  return (
    <div className="space-y-12 pb-20">
      
      {/* Main Content Area */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900">Featured Listings</h3>
            <p className="text-gray-500 font-medium italic">
              {searchQuery ? `Showing results for "${searchQuery}"` : "Discover the latest community gear"}
            </p>
          </div>
          
          {/* Category Filter Integration */}
          <CategoryBar selectedCategory={category} onCategoryChange={setCategory} />
        </div>

        {/* The Grid 
            Triggers the useEffect in ItemList with the current state
        */}
        <div className="min-h-[400px]">
          <ItemList category={category} searchQuery={searchQuery} />
        </div>
      </div>

      {/* 4. Small Call-to-Action for Interns/Users */}
      <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-bold">Have items lying around?</h4>
          <p className="text-gray-500">Turn your unused gear into passive income today.</p>
        </div>
        <button 
          onClick={() => window.location.href='/lend'}
          className="bg-green-900 text-white px-8 py-4 rounded-full font-black hover:bg-black transition-all"
        >
          Start Lending
        </button>
      </div>

    </div>
  );
}