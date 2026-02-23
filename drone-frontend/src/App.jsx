import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Upload,
  Droplets,
  Map as MapIcon,
  Play,
  Download,
  BarChart3,
  Layers,
  Zap,
  Cpu,
  Activity,
  ChevronRight,
  Database,
  CloudRain,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
  Signal,
  Wind
} from 'lucide-react';
import axios from 'axios';

const API_BASE = "http://localhost:8000/api";

const WelcomeView = ({ onInitialize }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] p-6 lg:p-12 animate-in fade-in duration-1000">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)] opacity-40"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>

      {/* HUD Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-4xl w-full z-10">
        <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-8 duration-700">
          <div className="p-5 bg-cyan-500/10 rounded-3xl border border-cyan-500/30 mb-8 relative group">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <Droplets className="text-cyan-400 relative z-10 animate-float" size={56} />
          </div>

          <h1 className="text-7xl font-black tracking-tighter mb-4 gradient-heading leading-tight italic">
            DRONEFLOW <span className="text-white/90">X</span>
          </h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.6em] font-black opacity-60 mb-12 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-slate-800"></span>
            AUTONOMOUS TERRAIN SYNTHESIS
            <span className="w-12 h-[1px] bg-slate-800"></span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 holograph-card group">
              <Activity className="text-cyan-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Sensor Matrix</h3>
              <p className="text-lg font-bold text-slate-200">POINT CLOUD v2.0</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 holograph-card group">
              <Cpu className="text-purple-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Neural Engine</h3>
              <p className="text-lg font-bold text-slate-200">HYBRID DTM-AI</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 holograph-card group">
              <ShieldCheck className="text-emerald-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Protocol Status</h3>
              <p className="text-lg font-bold text-slate-200">SECURE LINK</p>
            </div>
          </div>

          <button
            onClick={onInitialize}
            className="group relative px-12 py-6 bg-white overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 text-black font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors flex items-center gap-4">
              Initialize Mission Control <ChevronRight size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-12 left-12 flex flex-col gap-2 p-4 border-l border-white/10 opacity-40">
        <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-500">
          <Radio size={12} className="text-cyan-500" /> SIGINT: 84%
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-500">
          <Signal size={12} className="text-purple-500" /> LINK: ACTIVE
        </div>
      </div>

      <div className="absolute bottom-12 right-12 text-right opacity-30">
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mb-2">GEOSPATIAL RT CORE</p>
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-600">BUILD: 94X-DELTA</p>
      </div>
    </div>
  );
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [results, setResults] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await axios.post(`${API_BASE}/upload/`, formData);
      setFileId(res.data.file_id);
      setUploading(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Ensure backend is running.");
      setUploading(false);
    }
  };

  const startProcessing = async () => {
    if (!fileId) return;
    setProcessing(true);
    try {
      const res = await axios.get(`${API_BASE}/process/${fileId}`);
      if (res.data && res.data.results) {
        const resultData = res.data.results;
        setResults(resultData);
        // Defensive check for map coordinates
        if (resultData.waterlogging?.features?.[0]?.geometry?.coordinates) {
          const coords = resultData.waterlogging.features[0].geometry.coordinates[0][0];
          if (Array.isArray(coords) && coords.length >= 2) {
            setMapCenter([coords[1], coords[0]]);
          }
        }
        setActiveTab('analysis');
      }
    } catch (err) {
      console.error("Processing error:", err);
      alert("Analysis failed. Please try again or check your file.");
    } finally {
      setProcessing(false);
    }
  };

  if (showWelcome) {
    return <WelcomeView onInitialize={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex bg-[#020617] text-slate-100 h-screen overflow-hidden font-outfit p-4 lg:p-6 gap-6 relative animate-in zoom-in-95 duration-700">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#1e1b4b,transparent)] pointer-events-none opacity-30"></div>

      {/* Sidebar Section */}
      <div className="w-[440px] flex flex-col gap-6 z-20 relative animate-in slide-in-from-left-8 duration-1000">
        <header className="glass-panel rounded-3xl p-8 border-t border-cyan-500/30 group transition-all hover:border-cyan-500/50">
          <div className="flex items-center gap-4 mb-3 cursor-pointer" onClick={() => setShowWelcome(true)}>
            <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/40 relative">
              <div className="absolute inset-0 blur-lg bg-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Droplets className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter gradient-heading leading-tight italic">
                DRONEFLOW <span className="text-white/90">X</span>
              </h1>
              <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-black opacity-60 flex items-center gap-2">
                <Activity size={10} className="text-cyan-500 animate-pulse" /> TERRAIN CO-PROCESSOR v4.0
              </p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-inner overflow-hidden">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Data Ingest
          </button>
          <button
            onClick={() => results && setActiveTab('analysis')}
            disabled={!results}
            className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed'}`}
          >
            Telemetry
          </button>
        </div>

        <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          {activeTab === 'upload' ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <section className="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Database size={64} className="text-cyan-500" />
                </div>

                <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <CloudRain size={16} /> Data Link Interface
                </h2>

                <div
                  className="group/file relative border-2 border-dashed border-slate-700/50 rounded-3xl p-12 text-center cursor-pointer hover:border-cyan-500/50 transition-all bg-slate-950/40 hover:bg-cyan-500/5 mb-8"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover/file:border-cyan-500/30 transition-all group-hover/file:scale-110 shadow-xl">
                    <Upload className="text-slate-500 group-hover/file:text-cyan-400 transition-colors" size={32} />
                  </div>
                  <p className="text-lg font-bold text-slate-200 mb-2 truncate px-4">
                    {file ? file.name : "Select LAS Source"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">LAS / LAZ spatial data streams supported</p>
                  <input id="fileInput" type="file" hidden onChange={handleFileUpload} accept=".las,.laz" />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] active:scale-[0.98] disabled:shadow-none"
                  disabled={!fileId || processing}
                  onClick={startProcessing}
                >
                  {processing ? (
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="tracking-widest text-sm font-black uppercase">Processing Terrain...</span>
                    </div>
                  ) : (
                    <>
                      <Zap size={20} fill="currentColor" />
                      <span className="tracking-widest text-sm font-black uppercase">Compute Hydro-Model</span>
                      <ChevronRight size={20} className="bg-white/20 rounded-full p-1" />
                    </>
                  )}
                </button>
              </section>

              {!results && !processing && (
                <div className="p-8 border border-white/5 rounded-3xl bg-slate-900/20 text-slate-500 text-xs italic leading-relaxed">
                  Welcome to the Next-Gen Drone Analysis Suite. Upload your point cloud to initiate DTM generation, sink identification, and flow accumulation analysis.
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {results && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 group relative overflow-hidden transition-all hover:bg-slate-900/60">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><Navigation size={14} className="text-cyan-400" /></div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Base Datum</p>
                      <p className="text-3xl font-black text-cyan-400 font-mono tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{results.dtm_summary.min_z.toFixed(2)}<span className="text-sm ml-1 text-slate-400">m</span></p>
                      <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-1/3"></div>
                      </div>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 group relative overflow-hidden transition-all hover:bg-slate-900/60">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><Activity size={14} className="text-purple-400" /></div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Peak Datum</p>
                      <p className="text-3xl font-black text-purple-400 font-mono tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">{results.dtm_summary.max_z.toFixed(2)}<span className="text-sm ml-1 text-slate-400">m</span></p>
                      <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-2/3"></div>
                      </div>
                    </div>
                  </div>

                  <section className="glass-panel rounded-3xl p-8 flex flex-col gap-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Layers size={14} className="text-blue-500" /> Analysis Layers
                    </h3>

                    <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                          <CloudRain size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Sinks & Basins</p>
                          <p className="text-[10px] text-slate-500 font-medium">1 identified drainage sink</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                          <MapIcon size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Optimal Network</p>
                          <p className="text-[10px] text-slate-500 font-medium">Gradient-driven flow path</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
                    </div>
                  </section>

                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-4 border border-white/5 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    <Download size={22} className="text-cyan-400" />
                    <span className="text-sm uppercase tracking-widest">Download GIS Bundle</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <footer className="mt-auto px-4 py-6 border-t border-white/5 flex items-center justify-between opacity-50 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-4">
            <span>SERVER: ONLINE</span>
            <span>GPS: LOCKED</span>
          </div>
          <div className="flex items-center gap-1">
            AI ENGINE ACTIVE <ExternalLink size={8} />
          </div>
        </footer>
      </div>

      {/* Main Viewport / Map */}
      <div className="flex-grow glass-panel rounded-[40px] overflow-hidden relative shadow-[0_0_100px_-20px_rgba(2,6,23,1)] border border-white/10 group animate-in slide-in-from-right-12 duration-1000">
        <div className="map-scanner"></div>

        {/* Map Header HUD */}
        <div className="absolute top-8 left-8 z-[1000] flex items-center gap-4 pointer-events-none">
          <div className="bg-[#020617]/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl transition-all">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Spatial Grid</span>
              <span className="text-xs font-bold text-white mt-1">OPERATIONAL MODE: ANALYTIC</span>
            </div>
          </div>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={13}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; Mapbox &copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          {results && (
            <>
              <GeoJSON data={results.waterlogging} style={{ color: '#06b6d4', weight: 4, fillOpacity: 0.6, fillColor: '#06b6d4' }} />
              <GeoJSON data={results.drainage} style={{ color: '#a855f7', weight: 6, dashArray: '15, 20', opacity: 0.9 }} />
            </>
          )}
        </MapContainer>

        {/* Map Controls / Widgets */}
        <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-3">
          <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Depression Fill: YES</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Flow Network: ACCUM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 z-[1000] bg-slate-900/90 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-6 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Map Latency</span>
            <span className="text-xs font-bold text-cyan-400 tracking-tighter">8.2ms / FPS: 60</span>
          </div>
          <div className="w-[1px] h-8 bg-white/5"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coordinates</span>
            <span className="text-xs font-bold text-white tracking-widest">48.8566 / 2.3522</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
