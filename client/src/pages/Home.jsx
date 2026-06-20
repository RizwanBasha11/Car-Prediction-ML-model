import React from 'react';
import ThreeCarShowcase from '../components/ThreeCarShowcase';
import { Cpu, Zap, Eye, Mic, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

const Home = ({ setActivePage }) => {
  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center py-12 px-4 md:px-8">
      {/* Glow Orbs background */}
      <div className="glow-orb w-[400px] h-[400px] bg-autoverseSecondary/10 top-1/4 left-1/4" />
      <div className="glow-orb w-[450px] h-[450px] bg-autoversePrimary/10 bottom-1/4 right-1/4" />

      {/* Hero Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Area */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-autoversePrimary/10 border border-autoversePrimary/30">
            <Sparkles className="w-4 h-4 text-autoversePrimary" />
            <span className="text-xs font-semibold text-autoversePrimary tracking-wider uppercase">
              Quantum Valuation Matrix Active
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Decide the Real Price of{' '}
            <span className="bg-gradient-to-r from-autoversePrimary via-autoverseSecondary to-autoverseAccent bg-clip-text text-transparent text-glow-primary">
              Any Vehicle
            </span>
          </h1>

          <p className="text-base text-gray-300 max-w-lg leading-relaxed">
            AutoVerse AI leverages a synchronized ensemble of <strong>XGBoost</strong>, <strong>CatBoost</strong>, and <strong>LightGBM</strong> to output hyper-accurate market predictions, future depreciation forecasts, and visual vehicle health score sheets.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActivePage('predict')}
              className="px-8 py-4 bg-gradient-to-r from-autoverseSecondary to-autoversePrimary hover:brightness-110 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-neonPrimary flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-5 h-5" />
              <span>Launch Predictor</span>
            </button>
            
            <button
              onClick={() => setActivePage('compare')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white border border-white/15 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-5 h-5 rotate-45" />
              <span>Compare Specs</span>
            </button>
          </div>
        </div>

        {/* 3D Hologram Car Showcase */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-neonPrimary relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-autoverseAccent/20 flex items-center justify-center border border-autoverseAccent animate-ping pointer-events-none" />
          <ThreeCarShowcase />
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 z-10">
        
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-autoversePrimary/10 flex items-center justify-center border border-autoversePrimary/20">
            <Cpu className="w-5 h-5 text-autoversePrimary" />
          </div>
          <h3 className="text-lg font-bold text-white">Neural Ensemble Predict</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Consolidated valuation model taking input from 13 parameters including safety, engine CC, location, and owner logs.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-autoverseSecondary/10 flex items-center justify-center border border-autoverseSecondary/20">
            <Zap className="w-5 h-5 text-autoverseSecondary" />
          </div>
          <h3 className="text-lg font-bold text-white">Depreciation Forecasting</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Simulates brand-adjusted future value curves for 1, 3, and 5 years to predict overall investment retention.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-autoverseAccent/10 flex items-center justify-center border border-autoverseAccent/20">
            <Eye className="w-5 h-5 text-autoverseAccent" />
          </div>
          <h3 className="text-lg font-bold text-white">Visual Condition Grading</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Drag and drop images of any car to trigger a computer vision breakdown checking exterior scratches and panel gaps.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-autoversePrimary/10 flex items-center justify-center border border-autoversePrimary/20">
            <Mic className="w-5 h-5 text-autoversePrimary" />
          </div>
          <h3 className="text-lg font-bold text-white">Natural Voice Parse</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Speak directly to search the market. Parses statements like "Find me a Toyota under 15 Lakhs in Bangalore".
          </p>
        </div>

      </div>
    </div>
  );
};

export default Home;
