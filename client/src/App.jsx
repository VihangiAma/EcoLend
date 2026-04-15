import React from 'react';
import Navbar from './components/Navbar'; // Import the Navbar component

function App() {
  return (
    <div className="min-h-screen bg-eco-light">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-6xl font-black text-gray-900 leading-tight mb-6">
          Borrow what you need, <br />
          <span className="text-eco-green">Lend what you don't.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Join **EcoLend** to share tools, electronics, and resources with your neighbors. 
          Save money, reduce waste, and build a stronger community.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-eco-green text-white px-10 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            Browse Marketplace
          </button>
          <button className="bg-white text-eco-green border-2 border-eco-green px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/50 transition-all">
            List an Item
          </button>
        </div>

        {/* Quick Stats / Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-3xl">📍</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4">Local First</h3>
            <p className="text-gray-500 mt-2">Find items right in your neighborhood.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-3xl">🤖</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4">AI Powered</h3>
            <p className="text-gray-500 mt-2">Smart descriptions to help you list in seconds.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-3xl">🌱</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4">Sustainable</h3>
            <p className="text-gray-500 mt-2">Reduce waste through the circular economy.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;