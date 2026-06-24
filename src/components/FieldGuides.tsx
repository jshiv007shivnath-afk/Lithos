import { useState } from 'react';
import { Search, Compass, ShieldAlert, Heart, Calendar, Layers, Activity } from 'lucide-react';
import { RockGuide, User } from '../types';
import { ROCK_GUIDES } from '../data';

interface FieldGuidesProps {
  user: User | null;
  savedSites: string[];
  onToggleSaveSite: (siteId: string) => void;
  onOpenAuth: () => void;
}

export default function FieldGuides({ user, savedSites, onToggleSaveSite, onOpenAuth }: FieldGuidesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRock, setSelectedRock] = useState<RockGuide | null>(null);

  const filteredRocks = ROCK_GUIDES.filter((rock) => {
    const matchesSearch = 
      rock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rock.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rock.formation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || rock.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e8702a] font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>ROCK & MINERAL SPECIMEN INDEX</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
          Lithic Archive of Global Materials
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Unlock standard microscopic rock profiles. Examine crystallization periods, regional formations, and Mohs scale indexes compiled by field expeditions.
        </p>
      </div>

      {/* Main Grid: List on Left (or full if none selected), Specimen drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Rocks catalog (8-span if rock selected, 12 if none) */}
        <div className={`${selectedRock ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6 transition-all duration-300`}>
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111111] border border-white/10 rounded-2xl p-4">
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search basalt, obsidian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
              />
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
              {['All', 'Igneous', 'Sedimentary', 'Metamorphic'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className={`grid grid-cols-1 ${selectedRock ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'} gap-6`}>
            {filteredRocks.length > 0 ? (
              filteredRocks.map((rock) => {
                const isBookmarked = savedSites.includes(rock.id);
                const isCurrent = selectedRock?.id === rock.id;

                return (
                  <div
                    key={rock.id}
                    onClick={() => setSelectedRock(rock)}
                    className={`bg-[#111111] border rounded-3xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] hover:border-white/20 group flex flex-col justify-between ${
                      isCurrent ? 'ring-2 ring-[#e8702a] border-transparent' : 'border-white/10'
                    }`}
                  >
                    <div>
                      {/* Specimen Thumbnail */}
                      <div className="h-40 relative overflow-hidden">
                        <img
                          src={rock.specimenUrl}
                          alt={rock.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              onOpenAuth();
                            } else {
                              onToggleSaveSite(rock.id);
                            }
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-[#e8702a] transition-colors"
                          aria-label="Bookmark Rock Specimen"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#e8702a] text-[#e8702a]' : ''}`} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-white/40">
                          <span>{rock.type}</span>
                          <span>•</span>
                          <span>{rock.geologicEra}</span>
                        </div>
                        <h3 className="text-lg font-playfair italic font-medium">{rock.name}</h3>
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {rock.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 mt-auto flex justify-between items-center text-[10px] font-mono text-white/40 border-t border-white/5">
                      <span>Hardness: {rock.mohsHardness}</span>
                      <span className="text-[#e8702a] font-sans font-semibold text-[11px] group-hover:translate-x-1 transition-transform">
                        Analyze Specimen &rarr;
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 space-y-4">
                <Compass className="w-12 h-12 text-white/20 mx-auto" />
                <h3 className="text-lg font-medium">No geological crystals matched</h3>
                <p className="text-xs text-white/40 max-w-sm mx-auto">
                  Try clearing your filter fields or search terms.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Specimen Details Side-Drawer (5-span) */}
        {selectedRock && (
          <div className="lg:col-span-5 bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-white animate-in slide-in-from-right duration-300 relative">
            
            {/* Close details */}
            <button
              onClick={() => setSelectedRock(null)}
              className="absolute top-5 right-5 text-xs font-mono text-white/40 hover:text-white transition-colors"
            >
              CLOSE [✕]
            </button>

            {/* Title */}
            <div className="space-y-2">
              <span className="inline-block bg-[#e8702a]/10 border border-[#e8702a]/30 text-[#e8702a] font-mono text-[10px] px-2.5 py-1 rounded-full uppercase">
                {selectedRock.type} Rock System
              </span>
              <h2 className="text-3xl font-playfair italic font-semibold leading-none">{selectedRock.name}</h2>
            </div>

            {/* Visual Header */}
            <div className="h-48 rounded-2xl overflow-hidden border border-white/10 relative">
              <img
                src={selectedRock.specimenUrl}
                alt={selectedRock.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-white/40 uppercase tracking-wider">Historical geological report</h4>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                {selectedRock.description}
              </p>
            </div>

            {/* Details table / grid */}
            <div className="border-t border-white/10 pt-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="flex items-center gap-2 text-white/40">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  Estimated Age:
                </span>
                <span className="text-right">{selectedRock.age}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="flex items-center gap-2 text-white/40">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  Primary Formation:
                </span>
                <span className="text-right max-w-[200px] line-clamp-2 leading-tight">{selectedRock.formation}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-white/40">
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  Mohs Hardness:
                </span>
                <span>{selectedRock.hardness}</span>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth();
                } else {
                  onToggleSaveSite(selectedRock.id);
                }
              }}
              className={`w-full py-3 rounded-xl border font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                savedSites.includes(selectedRock.id)
                  ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              {savedSites.includes(selectedRock.id) ? 'Remove from Private Notebook' : 'Add to Private Notebook'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
