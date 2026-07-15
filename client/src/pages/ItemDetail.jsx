import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Star,
  Calendar,
  MessageSquare,
  Info,
} from "lucide-react";
import API from "../api/axios";
import { useLanguage } from "../contexts/LanguageContext";

const ITEM_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=900&auto=format&fit=crop";

/**
 * Get the backend server URL.
 *
 * Recommended frontend .env:
 * VITE_SERVER_URL=http://localhost:5000
 */
const getServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL.replace(/\/$/, "");
  }

  const axiosBaseUrl = API.defaults.baseURL || "";

  // Example:
  // http://localhost:5000/api -> http://localhost:5000
  return axiosBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

/**
 * Convert relative database image paths into full backend URLs.
 *
 * Supported examples:
 * uploads/items/item.jpg
 * /uploads/items/item.jpg
 * uploads\items\item.jpg
 * http://localhost:5000/uploads/items/item.jpg
 */
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
    ownerName || "Lender"
  )}&background=005A36&color=fff&size=256&bold=true`;
};

/**
 * Supports several possible API property names.
 * You can later keep only the exact names returned by your backend.
 */
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

const getOwnerAvatarPath = (item) => {
  return (
    item?.owner_avatar ||
    item?.ownerAvatar ||
    item?.profile_image ||
    item?.profileImage ||
    item?.avatar ||
    item?.owner?.avatar ||
    item?.owner?.profile_image ||
    item?.owner?.profileImage ||
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
    "Lender"
  );
};

const getOwnerId = (item) => {
  return (
    item?.owner_id ||
    item?.ownerId ||
    item?.user_id ||
    item?.userId ||
    item?.owner?.id ||
    null
  );
};

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const res = await API.get(`/items/${id}`);

        console.log("Item API response:", res.data);

        // Supports APIs that return either:
        // { ...itemData }
        // or { item: { ...itemData } }
        const itemData = res.data?.item || res.data;

        setItem(itemData);
      } catch (err) {
        console.error("Error fetching item details:", err);

        setFetchError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load this item."
        );

        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    } else {
      setLoading(false);
      setFetchError("Item ID is missing.");
    }
  }, [id]);

  const startNegotiationChat = async () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login to chat");
      navigate("/login");
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(userData);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      alert("Your login data is invalid. Please login again.");
      navigate("/login");
      return;
    }

    const ownerId = getOwnerId(item);
    const currentUserId =
      currentUser?.id ||
      currentUser?.user_id ||
      currentUser?.userId ||
      currentUser?._id;

    if (!item || !ownerId) {
      alert("Item owner information is not available.");
      return;
    }

    if (String(currentUserId) === String(ownerId)) {
      alert("You cannot chat with yourself.");
      return;
    }

    setChatLoading(true);

    try {
      const res = await API.post("/messages/create-conversation", {
        peer_id: ownerId,
        item_id: id,
      });

      const conversationId =
        res.data?.conversationId ||
        res.data?.conversation_id ||
        res.data?.conversation?.id;

      if (!conversationId) {
        throw new Error("Conversation ID was not returned by the server.");
      }

      navigate("/messages", {
        state: {
          selectedConversation: conversationId,
        },
      });
    } catch (err) {
      console.error("Failed to start chat:", {
        status: err.response?.status,
        error: err.response?.data?.error,
        message: err.response?.data?.message,
        details: err.response?.data?.details,
      });

      alert(
        `Failed to start chat: ${
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        }`
      );
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-10">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#005A36] border-t-transparent mx-auto" />

          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {t("loadingAsset") || "Loading asset specifications..."}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-sm shadow-sm space-y-4">
          <Info size={40} className="text-amber-600 mx-auto" />

          <h2 className="text-xl font-black text-gray-900">
            {t("assetNotFound") || "Asset Not Found"}
          </h2>

          <p className="text-xs text-gray-500 font-medium">
            {fetchError ||
              t("assetNotFoundDesc") ||
              "This item listing may have been unlisted, rented out, or deleted."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-[#005A36] text-white py-3 rounded-xl text-xs font-bold hover:bg-black transition-all"
          >
            {t("backToBrowse") || "Back to Browse"}
          </button>
        </div>
      </div>
    );
  }

  const ownerName = getOwnerName(item);
  const ownerId = getOwnerId(item);

  const itemImageUrl = getImageUrl(
    getItemImagePath(item),
    ITEM_FALLBACK_IMAGE
  );

  const ownerFallbackImage = getOwnerFallbackImage(ownerName);

  const ownerAvatarUrl = getImageUrl(
    getOwnerAvatarPath(item),
    ownerFallbackImage
  );

  const itemTitle =
    item.title || item.item_name || item.itemName || "Rental Item";

  const locationName =
    item.location_name ||
    item.locationName ||
    item.location ||
    "Western Province, LK";

  const pricePerDay =
    item.price_per_day ||
    item.pricePerDay ||
    item.daily_price ||
    item.dailyPrice ||
    0;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-[#005A36] transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />

            {t("backToBrowse") || "Back to Browse"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Item image */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <img
                src={itemImageUrl}
                alt={itemTitle}
                className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = ITEM_FALLBACK_IMAGE;
                }}
              />
            </div>
          </div>

          {/* Item information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <span className="inline-block bg-emerald-100/70 border border-emerald-200 text-[#005A36] px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                {item.category ||
                  t("unclassifiedAsset") ||
                  "Unclassified Asset"}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                {itemTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 text-gray-500 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <MapPin size={16} className="text-[#005A36]" />
                  <span>{locationName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Star
                    size={16}
                    className="text-amber-400 fill-amber-400"
                  />

                  <span className="text-gray-800">
                    {item.rating || "4.9"}
                  </span>

                  <span className="text-gray-400">
                    ({item.review_count || item.reviewCount || 12}{" "}
                    {t("reviews") || "Platform Reviews"})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-bl-xl border-l border-b border-gray-200/40">
                {t("aiInsightSystem") || "AI Insight System"}
              </div>

              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                {t("assetDesc") || "Asset Description"}
              </h3>

              <p className="text-gray-700 leading-relaxed text-sm font-medium italic">
                “
                {item.description ||
                  t("noDescription") ||
                  "No description is available for this item."}
                ”
              </p>
            </div>

            {/* Owner and price */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={ownerAvatarUrl}
                  alt={`${ownerName} profile`}
                  className="w-14 h-14 rounded-xl border-2 border-gray-100 shadow-sm object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = ownerFallbackImage;
                  }}
                />

                <div>
                  <p className="font-black text-gray-950 text-base">
                    {ownerName || t("verifiedMember") || "Verified Member"}
                  </p>

                  <p className="text-[11px] text-[#005A36] font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={14} />
                    {t("verifiedLender") || "Verified Lender"}
                  </p>
                </div>
              </div>

              <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="text-[10px] block font-black text-gray-400 uppercase tracking-wider">
                  {t("rentalValue") || "Rental Value"}
                </span>

                <span className="text-2xl font-black text-[#005A36]">
                  Rs. {Number(pricePerDay || 0).toLocaleString()}
                </span>

                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">
                  {t("perDayRate") || "/ Per Day Rate"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                type="button"
                className="sm:col-span-3 w-full bg-[#005A36] hover:bg-[#004227] text-white py-4 px-6 rounded-xl font-extrabold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                {t("requestBorrow") || "Request to Borrow"}
              </button>

              <button
                type="button"
                onClick={startNegotiationChat}
                disabled={chatLoading || !ownerId}
                className="sm:col-span-1 w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 py-4 px-4 rounded-xl font-extrabold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} className="text-gray-400" />

                {chatLoading ? "..." : t("chatBtn") || "Chat"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}