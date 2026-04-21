import { useEffect, useState } from 'react';
import API from '../api/axios';
import ItemCard from './ItemCard';

export default function ItemList({ category, searchQuery }) { 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // We send the current searchQuery to the backend
        const res = await API.get(`/items/all?category=${category}&search=${searchQuery}`);
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, searchQuery]);
  if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Loading items...</div>;

  // FIX 3: Add a safety check before checking .length
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
      {items.map((item) => (
        <ItemCard key={item.item_id} item={item} />
      ))}
    </div>
  );
}