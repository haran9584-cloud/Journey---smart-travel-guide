'use client'

import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Wallet, 
  Sparkles, 
  CloudRain, 
  Thermometer, 
  Compass,
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';

const LOADING_STEPS = [
  "Geocoding coordinates with Open-Meteo...", 
  "Fetching live weather forecasts...", 
  "Consulting Gemini AI for local hidden gems...", 
  "Calculating daily budget breakdowns...", 
  "Finalizing your personalized itinerary..." 
];

export default function Home() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('mid-range'); 
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [result, setResult] = useState(''); 
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const isDisabled = loading || !destination || !origin;

  useEffect(() => { 
    let interval; 
    if (loading) { 
      setLoadingStep(0); 
      interval = setInterval(() => { 
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length); 
      }, 2200); 
    } 
    return () => clearInterval(interval);
  }, [loading]); 

  const handleGenerate = async (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    setResult(''); 
    setLocation(null); 
    setWeather(null); 

    try { 
      const response = await fetch('/api/itinerary', { 
        method: 'POST', 
        headers: { 'Content-type': 'application/json' }, 
        body: JSON.stringify({ destination, days, budget, origin }), 
      }); 

      const data = await response.json(); 
      if (data.success) { 
        setResult(data.plan); 
        setLocation(data.location); 
        setWeather(data.weather); 
      } else {
        setResult('Failed to connect to the server!'); 
      } 
    } catch (error) { 
      setResult('Something went wrong generating your trip'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20 pt-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI Travel Assistant
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-3">
            Journey
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Smart itineraries tailored with real-time weather integration.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 mb-12"
        >
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Origin */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Starting from</label>
                <div className="relative">
                  <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. London"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Going to</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="e.g. Paris"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Budget Level</label>
                <div className="relative">
                  <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="budget">Backpacker / Budget</option>
                    <option value="mid-range">Mid-Range / Comfort</option>
                    <option value="luxury">Luxury / Premium</option>
                  </select>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isDisabled ? 1 : 1.01 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              type="submit"
              disabled={isDisabled}
              className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                isDisabled
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-indigo-500/25 cursor-pointer'
              }`}
            >
              {loading ? "Processing..." : <>Generate Itinerary <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-6 text-center mb-10 backdrop-blur-md"
            >
              <Compass className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-indigo-300 animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Weather Widget */}
            {weather && weather.time && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-indigo-400" /> Live Weather: {destination}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {weather.time.slice(0, Number(days)).map((date, i) => (
                    <div key={date} className="min-w-[110px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center shrink-0">
                      <div className="text-xs text-slate-400">{date.slice(5)}</div>
                      <div className="text-lg font-bold my-1 text-slate-100">{weather.temperature_2m_max[i]}°C</div>
                      <div className="text-xs text-indigo-400 flex items-center justify-center gap-1">
                        <CloudRain className="w-3 h-3" /> 
                        {weather.precipitation_probability_max?.[i] ?? 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Itinerary Body */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><CheckCircle2 className="text-indigo-400 w-5 h-5" /> Your Itinerary</h2>
                
                {/* Custom Markdown Parser */}
                <div className="prose prose-invert prose-indigo max-w-none">
                  {result.split('\n').map((line, i) => {
                    if (line.startsWith('##')) {
                      return <h2 key={i} className="text-2xl font-bold text-indigo-300 mt-8 mb-4 border-b border-slate-800 pb-2">{line.replace(/##\s*/, '')}</h2>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h3 key={i} className="text-xl font-semibold text-slate-200 mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                    }
                    if (line.trim().startsWith('* ')) {
                      const text = line.replace(/^\*\s*/, '');
                      const parts = text.split(/(\*\*.*?\*\*)/).map((part, idx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={idx} className="text-indigo-200">{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                      });
                      return <li key={i} className="ml-4 text-slate-300 mb-2 list-disc">{parts}</li>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-slate-300 leading-relaxed mb-4">{line}</p>;
                  })}
                </div>
              </div>

              {/* Map Widget */}
              {location && (
                <div className="lg:col-span-1">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md sticky top-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-200"><MapPin className="text-indigo-400 w-4 h-4" /> Destination Map</h3>
                    <div className="rounded-xl overflow-hidden bg-slate-800 h-[320px]">
                      <iframe 
                        title="map" 
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.08},${location.latitude - 0.08},${location.longitude + 0.08},${location.latitude + 0.08}&marker=${location.latitude},${location.longitude}`} 
                        className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}