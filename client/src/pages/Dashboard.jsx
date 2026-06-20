import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Cpu, Heart, History, Sparkles, Navigation, Trash2, Award } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState({
    budget: [], luxury: [], mileage: [], family: [], maintenance: []
  });
  const [loading, setLoading] = useState(true);
  const [recCategory, setRecCategory] = useState('budget'); // active recommendation segment

  const token = localStorage.getItem('autoverse_token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        // 1. Fetch Profile (which includes favorites & history)
        const profRes = await axios.get('http://localhost:8000/api/user/profile', config);
        setProfile(profRes.data);

        // 2. Fetch saved predictions log
        const predRes = await axios.get('http://localhost:8000/api/predictions', config);
        setPredictions(predRes.data);

        // 3. Fetch Seeded Recommendations
        const recRes = await axios.get('http://localhost:8000/api/cars/recommendations');
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Dashboard data load failed, running mock profiles", err);
        // Fallback mock profile
        setProfile({
          name: 'Demo Rider',
          email: 'user.demo@autoverse.ai',
          favorites: [
            { brand: 'Toyota', model: 'Fortuner', year: 2021, price: 34.5 },
            { brand: 'Tesla', model: 'Model 3', year: 2023, price: 48.0 }
          ],
          recentlyViewed: []
        });
        setPredictions([
          {
            _id: '1',
            predictedPrice: 5.4,
            confidenceScore: 92.5,
            healthScore: 85,
            inputFeatures: { brand: 'Maruti Suzuki', model: 'Swift', year: 2020 },
            createdAt: new Date().toISOString()
          }
        ]);
        setRecommendations({
          budget: [
            { brand: 'Maruti Suzuki', model: 'Swift VXI', price: 5.4, mileage: 21.2, transmission: 'Manual', image: 'swift.png' },
            { brand: 'Tata', model: 'Tiago', price: 3.9, mileage: 20.0, transmission: 'Manual', image: 'tiago.png' }
          ],
          luxury: [
            { brand: 'BMW', model: '3 Series', price: 41.5, mileage: 14.8, transmission: 'Automatic', image: 'bmw3.png' },
            { brand: 'Tesla', model: 'Model 3', price: 48.0, mileage: 490.0, transmission: 'Automatic', image: 'tesla3.png' }
          ],
          mileage: [
            { brand: 'Tata', model: 'Nexon EV', price: 15.2, mileage: 437.0, transmission: 'Automatic', image: 'nexon.png' }
          ],
          family: [
            { brand: 'Toyota', model: 'Innova Crysta', price: 18.5, mileage: 13.6, transmission: 'Manual', image: 'innova.png' },
            { brand: 'Toyota', model: 'Fortuner', price: 36.5, mileage: 12.4, transmission: 'Automatic', image: 'fortuner.png' }
          ],
          maintenance: [
            { brand: 'Honda', model: 'City ZX', price: 9.2, mileage: 17.8, transmission: 'Manual', image: 'city.png' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const deletePrediction = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:8000/api/predictions/${id}`, config);
      setPredictions(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete prediction failed", err);
    }
  };

  const removeFavorite = async (brand, model, year) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:8000/api/user/favorites?brand=${brand}&model=${model}&year=${year}`, config);
      setProfile(prev => ({
        ...prev,
        favorites: prev.favorites.filter(f => !(f.brand === brand && f.model === model && parseInt(f.year) === parseInt(year)))
      }));
    } catch (err) {
      console.error("Remove favorite failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-autoversePrimary/30 border-t-autoversePrimary rounded-full animate-spin" />
          <p className="text-xs text-autoversePrimary uppercase tracking-widest font-bold">Synchronizing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-2rem)] py-8 px-4 md:px-8 max-w-6xl mx-auto z-10 space-y-8">
      
      {/* Top Banner Profile Summary */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-autoverseSecondary to-autoversePrimary" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-autoverseSecondary to-autoverseAccent flex items-center justify-center text-2xl font-black text-autoverseBg border-2 border-white/10 shadow-neonSecondary">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{profile?.name}</h2>
            <p className="text-xs text-gray-400">{profile?.email}</p>
            {profile?.isAdmin && (
              <span className="inline-block px-2.5 py-0.5 bg-autoversePrimary/10 border border-autoversePrimary/40 rounded text-[9px] font-bold text-autoversePrimary uppercase mt-1">
                Security Admin
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-6 border-l border-white/5 pl-6 md:h-12 items-center">
          <div className="text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Saved Valuations</span>
            <span className="text-lg font-black text-white">{predictions.length}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Favorites</span>
            <span className="text-lg font-black text-white">{profile?.favorites?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Grid: Saved Predictions & Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Saved Valuations Log */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Cpu className="w-4 h-4 text-autoversePrimary" />
            <span>Valuation Ledger</span>
          </h3>

          {predictions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {predictions.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs group relative hover:border-autoversePrimary/20 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white">{p.inputFeatures.brand} {p.inputFeatures.model}</h4>
                    <p className="text-[9px] text-gray-400 uppercase mt-0.5">Year: {p.inputFeatures.year} • Health: {p.healthScore}% • Conf: {p.confidenceScore}%</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="font-black text-autoversePrimary text-sm">₹ {p.predictedPrice} L</p>
                    <button
                      onClick={() => deletePrediction(p._id)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                      title="Delete Valuation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-8">No saved predictions. Try running the AI predictor first!</p>
          )}
        </div>

        {/* Favorite Cars */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Heart className="w-4 h-4 text-autoverseSecondary" />
            <span>Starred Vehicles</span>
          </h3>

          {profile?.favorites?.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {profile.favorites.map((fav, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs group hover:border-autoverseSecondary/20 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white">{fav.brand} {fav.model}</h4>
                    <p className="text-[9px] text-gray-400 uppercase mt-0.5">Year: {fav.year} • Category: {fav.category || 'General'}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="font-black text-autoverseAccent text-sm">₹ {fav.price} L</p>
                    <button
                      onClick={() => removeFavorite(fav.brand, fav.model, fav.year)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                      title="Remove Star"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-8">No starred vehicles. Save listings as favorites to display them here.</p>
          )}
        </div>

      </div>

      {/* Personalized AI Market Recommendations Feed */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-autoverseAccent" />
            <span>AutoVerse Neural Market Feeds</span>
          </h3>

          {/* Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {['budget', 'luxury', 'mileage', 'family', 'maintenance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setRecCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  recCategory === cat
                    ? 'bg-autoverseAccent text-autoverseBg shadow-neonAccent font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Display Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations[recCategory]?.length > 0 ? (
            recommendations[recCategory].map((car, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-autoverseAccent/20 hover:scale-[1.02] transition-all flex flex-col justify-between h-56 relative overflow-hidden bg-white/20">
                <div className="absolute top-2 right-2">
                  <Award className="w-4 h-4 text-autoverseAccent opacity-60" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-autoverseAccent font-black">{recCategory} target</span>
                  <h4 className="text-sm font-black text-white mt-1">{car.brand}</h4>
                  <p className="text-xs text-gray-400 font-semibold">{car.model}</p>
                  
                  {/* Small specs bullets */}
                  <div className="mt-3 space-y-1">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Efficiency: {car.mileage} {car.fuelType === 'Electric' ? 'km/chg' : 'km/l'}</p>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Shift: {car.transmission}</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
                  <p className="text-sm font-extrabold text-white">₹ {car.price} Lakhs</p>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-autoversePrimary transition-colors cursor-pointer">
                    <Navigation className="w-3.5 h-3.5 rotate-45" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-full text-center py-6">No listings seeded for this category.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
