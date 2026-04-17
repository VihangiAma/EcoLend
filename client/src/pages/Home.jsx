import CategoryBar from "../components/CategoryBar";
import ItemList from "../components/ItemList"; // Your existing logic to fetch from MySQL

export default function Home() {

  //const [selectedCategory, setSelectedCategory] = useState("All");
  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <div>
        <h2 className="text-3xl font-black text-gray-900">Explore Items</h2>
        <p className="text-gray-500">Find what you need in Western Province.</p>
      </div>

      {/* 2. Filters */}
      <CategoryBar />

      {/* 3. The Grid of Real Data from MySQL */}
      <ItemList />
    </div>
  );
}