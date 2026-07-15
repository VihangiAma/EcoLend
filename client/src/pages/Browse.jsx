import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  RotateCcw,
  X,
  ChevronDown,
  ShieldCheck,
  PackageSearch,
} from "lucide-react";
import API from "../api/axios";
import CategoryBar from "../components/CategoryBar";


const ITEM_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80";

const getServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL.replace(/\/$/, "");
  }

  const axiosBaseUrl = API.defaults.baseURL || "";

  return axiosBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

const getImageUrl = (imagePath, fallbackImage) => {
  if (!imagePath || typeof imagePath !== "string") {
    return fallbackImage;
  }

  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    return fallbackImage;
  }

  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("blob:")
  ) {
    return trimmedPath;
  }

  const serverUrl = getServerUrl();
  const normalizedPath = trimmedPath.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${serverUrl}${cleanPath}`;
};

const getOwnerFallbackImage = (ownerName) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    ownerName || "Member"
  )}&background=005A36&color=ffffff&size=128&bold=true`;
};

const getItemImagePath = (item) => {
  return (
    item?.image_url ||
    item?.imageUrl ||
    item?.image ||
    item?.item_image ||
    item?.itemImage ||
    item?.images?.[0]?.url ||
    item?.images?.[0] ||
    null
  );
};

const getOwnerImagePath = (item) => {
  return (
    item?.owner_avatar ||
    item?.ownerAvatar ||
    item?.profile_image ||
    item?.profileImage ||
    item?.avatar ||
    item?.owner?.avatar ||
    item?.owner?.profile_image ||
    null
  );
};

const getOwnerName = (item) => {
  return (
    item?.owner_name ||
    item?.ownerName ||
    item?.owner?.name ||
    item?.owner?.full_name ||
    item?.owner?.fullName ||
    "Member"
  );
};

const getItemId = (item) => {
  return item?.item_id || item?.itemId || item?.id || item?._id;
};

export default function Browse() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }

        if (maxPrice) {
          params.append("maxPrice", maxPrice);
        }

        if (sortBy) {
          params.append("sortBy", sortBy);
        }

        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        const res = await API.get(`/items/all?${params.toString()}`);

        const itemData = Array.isArray(res.data)
          ? res.data
          : res.data?.items || [];

        setItems(itemData);
      } catch (err) {
        console.error("Error fetching browse items:", err);

        setFetchError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load marketplace items."
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFilteredItems();
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, maxPrice, sortBy, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice(5000);
    setSortBy("relevance");
    setSearchTerm("");
  };

  const handleOpenItem = (item) => {
    const itemId = getItemId(item);

    if (!itemId) {
      console.error("Item ID is missing:", item);
      return;
    }

    navigate(`/items/${itemId}`);
  };

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#E8F3EC] flex items-center justify-center">
            <SlidersHorizontal size={17} className="text-[#005A36]" />
          </div>

          <div>
            <h2 className="text-sm font-black text-gray-900">Filters</h2>
            <p className="text-[10px] text-gray-400 font-semibold">
              Refine marketplace results
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#005A36] hover:text-[#003d25] transition-colors"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="space-y-3">
  

  <div className="overflow-x-auto pb-1">
    <CategoryBar
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />
  </div>
</div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
            Maximum Price
          </label>

          <span className="text-xs font-black text-[#005A36] bg-[#E8F3EC] px-3 py-1.5 rounded-lg">
            Rs. {Number(maxPrice).toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="w-full h-1.5 accent-[#005A36] cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-semibold text-gray-400">
          <span>Rs. 100</span>
          <span>Rs. 5,000+</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-gray-900 pb-16">
      <section className="relative overflow-hidden bg-[#005A36]">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              EcoLend Marketplace
            </span>

            <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Borrow what you need from people nearby
            </h1>

            <p className="mt-4 text-sm sm:text-base text-emerald-50/80 font-medium max-w-2xl leading-relaxed">
              Discover useful items available in your community and reduce
              unnecessary purchases.
            </p>

            <div className="mt-8 bg-white p-2 rounded-2xl shadow-xl shadow-emerald-950/20 flex items-center">
              <Search size={20} className="text-gray-400 ml-3 shrink-0" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search cameras, tools, appliances..."
                className="flex-1 min-w-0 px-3 sm:px-4 py-3 text-sm font-medium text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-2 text-gray-400 hover:text-gray-700 transition"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-gray-900">
              Marketplace Listings
            </p>

            <p className="text-xs text-gray-400 mt-0.5">
              {loading
                ? "Loading available items..."
                : `${items.length} ${
                    items.length === 1 ? "item" : "items"
                  } available`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-3 rounded-xl text-xs font-bold text-gray-700 hover:border-[#005A36] hover:text-[#005A36] transition"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-xs font-bold text-gray-700 outline-none cursor-pointer focus:border-[#005A36] focus:ring-2 focus:ring-emerald-100 transition-all"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-8 mt-8 items-start">
          <aside className="hidden lg:block bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-7 sticky top-6">
            <FilterContent />
          </aside>

          <main>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[2rem] border border-gray-100 p-3 animate-pulse"
                  >
                    <div className="aspect-[4/3] rounded-[1.5rem] bg-gray-200" />

                    <div className="p-3 space-y-3">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded" />
                      <div className="h-12 bg-gray-100 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="bg-white rounded-[2rem] border border-red-100 p-12 text-center shadow-sm">
                <PackageSearch
                  size={42}
                  className="text-red-300 mx-auto"
                />

                <h2 className="mt-4 text-lg font-black text-gray-900">
                  Unable to load items
                </h2>

                <p className="mt-2 text-sm text-gray-500">{fetchError}</p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 bg-[#005A36] text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#004528] transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-12 sm:p-16 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E8F3EC] flex items-center justify-center">
                  <PackageSearch size={30} className="text-[#005A36]" />
                </div>

                <h2 className="mt-5 text-lg font-black text-gray-900">
                  No items found
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  No marketplace items match your current search and filter
                  selections.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 inline-flex items-center gap-2 bg-[#005A36] text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#004528] transition"
                >
                  <RotateCcw size={14} />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const itemId = getItemId(item);
                  const ownerName = getOwnerName(item);

                  const itemImageUrl = getImageUrl(
                    getItemImagePath(item),
                    ITEM_FALLBACK_IMAGE
                  );

                  const ownerFallbackImage =
                    getOwnerFallbackImage(ownerName);

                  const ownerImageUrl = getImageUrl(
                    getOwnerImagePath(item),
                    ownerFallbackImage
                  );

                  const pricePerDay =
                    item.price_per_day ||
                    item.pricePerDay ||
                    item.daily_price ||
                    item.dailyPrice ||
                    0;

                  const title =
                    item.title ||
                    item.item_name ||
                    item.itemName ||
                    "Untitled Item";

                  const location =
                    item.location_name ||
                    item.locationName ||
                    item.location ||
                    "Location unavailable";

                  return (
                    <article
                      key={itemId}
                      onClick={() => handleOpenItem(item)}
                      className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                      <div className="relative m-3 rounded-[1.5rem] overflow-hidden bg-gray-100 aspect-[4/3]">
                        <img
                          src={itemImageUrl}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = ITEM_FALLBACK_IMAGE;
                          }}
                        />

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#005A36] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">
                          {item.category || "Item"}
                        </span>

                        <div className="absolute bottom-3 left-3">
                          <p className="text-white text-xl font-black drop-shadow-sm">
                            Rs. {Number(pricePerDay).toLocaleString()}
                            <span className="text-[10px] font-semibold text-white/80 ml-1">
                              / day
                            </span>
                          </p>
                        </div>

                        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm">
                          <Star
                            size={12}
                            className="fill-amber-400 text-amber-400"
                          />

                          <span className="text-[11px] font-black text-gray-800">
                            {item.rating || "4.8"}
                          </span>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-2">
                        <h3 className="text-base font-black text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#005A36] transition-colors">
                          {title}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
                          <MapPin size={14} className="text-[#005A36]" />
                          <span className="truncate">{location}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={ownerImageUrl}
                              alt={`${ownerName} profile`}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                  ownerFallbackImage;
                              }}
                            />

                            <div className="min-w-0">
                              <p className="text-[9px] uppercase tracking-wider font-black text-gray-400">
                                Lender
                              </p>

                              <p className="text-xs font-bold text-gray-700 truncate">
                                {ownerName}
                              </p>
                            </div>
                          </div>

                          <div className="w-9 h-9 shrink-0 rounded-xl bg-[#E8F3EC] flex items-center justify-center group-hover:bg-[#005A36] transition-colors">
                            <ShieldCheck
                              size={16}
                              className="text-[#005A36] group-hover:text-white transition-colors"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenItem(item);
                          }}
                          className="mt-5 w-full bg-[#005A36] hover:bg-[#004528] text-white py-3 rounded-xl text-xs font-black transition-all active:scale-[0.98]"
                        >
                          View Item
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-lg font-black text-gray-900">
                Marketplace Filters
              </h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-7">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}