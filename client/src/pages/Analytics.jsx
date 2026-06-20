import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, MapPin, Sparkles, TrendingUp } from 'lucide-react';

const Analytics = () => {
  // Mock analytics dataset based on generated formulas
  const trendData = [
    { year: 2012, Hatchback: 1.8, Sedan: 2.8, SUV: 4.2, Premium: 8.5 },
    { year: 2014, Hatchback: 2.2, Sedan: 3.5, SUV: 5.6, Premium: 11.2 },
    { year: 2016, Hatchback: 2.9, Sedan: 4.6, SUV: 7.8, Premium: 15.6 },
    { year: 2018, Hatchback: 3.8, Sedan: 6.2, SUV: 10.5, Premium: 22.0 },
    { year: 2020, Hatchback: 4.9, Sedan: 8.0, SUV: 14.2, Premium: 30.5 },
    { year: 2022, Hatchback: 6.2, Sedan: 10.4, SUV: 18.5, Premium: 41.5 },
    { year: 2024, Hatchback: 7.8, Sedan: 13.2, SUV: 24.0, Premium: 54.0 },
  ];

  const brandData = [
    { brand: 'Maruti', AvgPrice: 4.8, ResaleScore: 92, Maintenance: 20 },
    { brand: 'Hyundai', AvgPrice: 6.2, ResaleScore: 88, Maintenance: 25 },
    { brand: 'Tata', AvgPrice: 8.5, ResaleScore: 84, Maintenance: 30 },
    { brand: 'Honda', AvgPrice: 9.0, ResaleScore: 86, Maintenance: 28 },
    { brand: 'Toyota', AvgPrice: 22.5, ResaleScore: 95, Maintenance: 32 },
    { brand: 'Mahindra', AvgPrice: 14.8, ResaleScore: 87, Maintenance: 35 },
    { brand: 'BMW', AvgPrice: 38.0, ResaleScore: 62, Maintenance: 85 },
    { brand: 'Tesla', AvgPrice: 45.0, ResaleScore: 65, Maintenance: 22 }
  ];

  const cityMultipliers = [
    { city: 'Delhi', factor: -2, status: 'Below Avg' },
    { city: 'Kolkata', factor: -6, status: 'Below Avg' },
    { city: 'Ahmedabad', factor: -5, status: 'Below Avg' },
    { city: 'Pune', factor: -3, status: 'Below Avg' },
    { city: 'Chennai', factor: 0, status: 'Baseline' },
    { city: 'Hyderabad', factor: 2, status: 'Above Avg' },
    { city: 'Mumbai', factor: 5, status: 'Above Avg' },
    { city: 'Bangalore', factor: 7, status: 'Above Avg' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] py-8 px-4 md:px-8 max-w-6xl mx-auto z-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-autoversePrimary" />
            <span>Market Trend Analytics</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Data insights, brand residuals, and geographic valuation variances
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-autoverseAccent/10 border border-autoverseAccent/30 rounded-full">
          <Sparkles className="w-4 h-4 text-autoverseAccent" />
          <span className="text-[10px] uppercase font-bold text-autoverseAccent">Live Market Indexes</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* CHART 1: Market valuation over year (Line) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <LineIcon className="w-4 h-4 text-autoversePrimary" />
            <span>Pricing Trajectory by Build Year (₹ Lakhs)</span>
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Hatchback" stroke="#00FFA3" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Sedan" stroke="#00E5FF" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SUV" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Premium" stroke="#FF007A" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATS 1: City Multipliers */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-autoverseSecondary" />
            <span>Location Pricing Indices</span>
          </h3>
          
          <div className="space-y-3">
            {cityMultipliers.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                <span className="font-bold text-white">{c.city}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold ${
                    c.factor > 0 
                      ? 'bg-red-500/10 text-red-400' 
                      : (c.factor < 0 ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400')
                  }`}>
                    {c.factor > 0 ? `+${c.factor}%` : `${c.factor}%`}
                  </span>
                  <span className="text-[9px] text-gray-500">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Second Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 2: Resale Score comparison (Bar) */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-autoverseAccent" />
            <span>Residual Value Index & Resale Score (out of 100)</span>
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="brand" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#00FFA3' }}
                />
                <Bar dataKey="ResaleScore" fill="#00FFA3" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Maintenance Cost comparison (Area) */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-autoverseSecondary" />
            <span>Average Maintenance Cost Index</span>
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={brandData}>
                <defs>
                  <linearGradient id="colorMaintenance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="brand" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#7C3AED' }}
                />
                <Area type="monotone" dataKey="Maintenance" stroke="#7C3AED" fillOpacity={1} fill="url(#colorMaintenance)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
