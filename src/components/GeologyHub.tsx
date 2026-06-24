import { useState, useMemo } from 'react';
import { Hammer, Sliders, Layers, RefreshCw, FileText, Download, ShieldCheck, Thermometer } from 'lucide-react';
import { GEOLOGIC_LAYERS } from '../data';
import { GeologicLayer, User } from '../types';

interface GeologyHubProps {
  user: User | null;
  onOpenAuth: () => void;
}

export default function GeologyHub({ user, onOpenAuth }: GeologyHubProps) {
  const [depth, setDepth] = useState<number>(350); // initial 350 meters
  const [drilling, setDrilling] = useState<boolean>(false);
  const [drillProgress, setDrillProgress] = useState<number>(0);
  const [showDrillReport, setShowDrillReport] = useState<boolean>(false);

  // Determine active layer based on selected depth
  const activeLayer = useMemo<GeologicLayer>(() => {
    if (depth <= 50) return GEOLOGIC_LAYERS[0];
    if (depth <= 500) return GEOLOGIC_LAYERS[1];
    if (depth <= 1500) return GEOLOGIC_LAYERS[2];
    if (depth <= 3000) return GEOLOGIC_LAYERS[3];
    return GEOLOGIC_LAYERS[4];
  }, [depth]);

  // Estimate temperature based on geothermal gradient (~25 C per km + 15 C surface)
  const estimatedTemp = useMemo(() => {
    const tempCelsius = 15 + (depth / 1000) * 25;
    return tempCelsius.toFixed(1);
  }, [depth]);

  // Execute drill sequence
  const executeCoreDrill = () => {
    setDrilling(true);
    setDrillProgress(0);
    setShowDrillReport(false);

    const interval = setInterval(() => {
      setDrillProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDrilling(false);
          setShowDrillReport(true);
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  // Compile active report up to current depth
  const drillReportDetails = useMemo(() => {
    const encountered: GeologicLayer[] = [];
    if (depth > 0) encountered.push(GEOLOGIC_LAYERS[0]);
    if (depth > 50) encountered.push(GEOLOGIC_LAYERS[1]);
    if (depth > 500) encountered.push(GEOLOGIC_LAYERS[2]);
    if (depth > 1500) encountered.push(GEOLOGIC_LAYERS[3]);
    if (depth > 3000) encountered.push(GEOLOGIC_LAYERS[4]);
    return encountered;
  }, [depth]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e8702a] font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>VIRTUAL CRUSTAL DRILL SANDBOX</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
          Peel Back the Earth’s Stratification
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Slide the core penetrator to descend through layers of lithified sediment, evaporate basins, and crystalline basement rock. Uncover pre-historic ages and mineral resource potential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Core Slicing Sandbox Controls & Slices (Column Left) */}
        <div className="lg:col-span-8 bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-playfair italic flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#e8702a]" />
                Penetrometer Depth Settings
              </h3>
              <span className="font-mono text-[#e8702a] font-bold text-lg bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                {depth} meters
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="5000"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full accent-[#e8702a] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>0m (Surface)</span>
                <span>1000m</span>
                <span>2000m</span>
                <span>3000m</span>
                <span>4000m</span>
                <span>5000m (Basement Gneiss)</span>
              </div>
            </div>

            {/* Quick depth jump shortcuts */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] text-white/40 font-mono flex items-center">Preset targets:</span>
              {[
                { label: 'Soil Bed (25m)', val: 25 },
                { label: 'Carbonates (280m)', val: 280 },
                { label: 'Dino Shales (900m)', val: 900 },
                { label: 'Salt Beds (2200m)', val: 2200 },
                { label: 'Precambrian Granite (4100m)', val: 4100 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setDepth(preset.val)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] px-2.5 py-1 rounded-full font-mono transition-all text-white/80 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliced Layer Dashboard */}
          <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-white/40 font-mono uppercase tracking-wider">Active Sliced Horizon</div>
                <h4 className="text-2xl font-playfair italic font-semibold" style={{ color: activeLayer.color }}>
                  {activeLayer.name}
                </h4>
              </div>

              <div className="space-y-3 font-sans text-sm text-white/70 leading-relaxed">
                <p>{activeLayer.description}</p>
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40">Composition:</span>
                  <span className="text-white text-right font-medium max-w-[180px] truncate" title={activeLayer.composition}>
                    {activeLayer.composition}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech details panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <div className="text-xs text-[#e8702a] uppercase border-b border-white/5 pb-2">Stratigraphic Metadata</div>
              
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Geologic Era:</span>
                <span>{activeLayer.era}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Lithology Depth Range:</span>
                <span style={{ color: activeLayer.color }}>{activeLayer.depthRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Mineral Potential:</span>
                <span className="text-emerald-400 text-right">{activeLayer.mineralPotential}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/40 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Estimated Temperature:
                </span>
                <span className="text-red-300 font-sans">{estimatedTemp}°C</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-xs text-white/50 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Calibrated core extraction model initialized. Ready to execute.</span>
            </div>

            <button
              onClick={executeCoreDrill}
              disabled={drilling}
              className="w-full sm:w-auto bg-[#e8702a] hover:bg-[#d2611f] disabled:bg-white/10 disabled:text-white/40 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#e8702a]/10"
            >
              {drilling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>Drilling Core ({drillProgress}%)</span>
                </>
              ) : (
                <>
                  <Hammer className="w-4 h-4 shrink-0" />
                  <span>Execute Core Drill Extraction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Graphic Columns & Drill Reports (Right Column) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          
          {/* Stratigraphic Graphic Column */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col flex-1">
            <h4 className="text-xs font-mono text-white/40 uppercase mb-4 tracking-wider">Crust Cross Section (Scale)</h4>
            
            <div className="flex-1 relative flex gap-4 h-72 sm:h-96">
              {/* Graphic Column Stack */}
              <div className="flex-1 rounded-2xl overflow-hidden flex flex-col border border-white/10 h-full">
                {GEOLOGIC_LAYERS.map((layer, index) => {
                  const isActive = activeLayer.id === layer.id;
                  let heightPercent = '20%';
                  if (index === 0) heightPercent = '5%';  // 0-50m
                  else if (index === 1) heightPercent = '15%'; // 50-500m
                  else if (index === 2) heightPercent = '25%'; // 500-1500m
                  else if (index === 3) heightPercent = '25%'; // 1500-3000m
                  else if (index === 4) heightPercent = '30%'; // 3000-5000m

                  return (
                    <div
                      key={layer.id}
                      style={{ height: heightPercent, backgroundColor: layer.color }}
                      className={`relative transition-all duration-300 flex items-center justify-center ${
                        isActive ? 'brightness-125 saturate-150 ring-2 ring-white ring-inset' : 'opacity-80 brightness-75'
                      }`}
                    >
                      <span className="absolute text-[9px] font-mono font-bold text-white tracking-tighter bg-black/50 px-1 py-0.5 rounded pointer-events-none">
                        {layer.depthRange}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Depth Slicer Needle Indicator */}
              <div className="w-2 relative h-full">
                {/* Needle */}
                <div
                  className="absolute w-3 h-3 bg-white border border-black rounded-full shadow-lg -left-1 transition-all duration-200"
                  style={{ top: `${(depth / 5000) * 100}%`, transform: 'translateY(-50%)' }}
                />
                {/* Visual Scale bar */}
                <div className="absolute inset-y-0 w-0.5 bg-white/20 left-0" />
              </div>
            </div>

            <div className="mt-4 text-[10px] font-mono text-white/40 leading-relaxed text-center">
              Active drilling slicing through <strong>{activeLayer.era}</strong> horizons.
            </div>
          </div>

          {/* Drill Report Box */}
          {showDrillReport && (
            <div className="bg-[#111111] border border-emerald-500/20 rounded-3xl p-6 space-y-4 animate-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-mono font-bold">CORE EXTRACTION SUCCEEDED</span>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-semibold font-playfair italic">Borehole Report Log Generated</h5>
                <p className="text-[11px] text-white/60 leading-normal font-mono">
                  Sample encountered {drillReportDetails.length} layer horizons down to {depth}m.
                </p>
              </div>

              {/* Core summary nodes */}
              <div className="space-y-1.5 pt-1">
                {drillReportDetails.map((layer) => (
                  <div key={layer.id} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1">
                    <span className="text-white/50">{layer.name.slice(0, 22)}...</span>
                    <span style={{ color: layer.color }}>{layer.depthRange}</span>
                  </div>
                ))}
              </div>

              {/* Download drill button */}
              <button
                onClick={() => {
                  alert(`Saving Core Drill Report down to ${depth}m to your personal Lithos geological binder.`);
                }}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Sync Log to Notebook
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
