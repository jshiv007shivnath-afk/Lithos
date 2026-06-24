import { useState, useEffect, FormEvent } from 'react';
import { Layers, Compass, GraduationCap, Tv, ArrowRight, Shield, Globe, Hammer, Compass as CompassIcon, Sparkles, Star, MessageSquare, Check, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GEOLOGIC_LAYERS, ROCK_GUIDES, COURSES, LIVE_TOURS } from '../data';
import { GeologicLayer, RockGuide, Course, LiveTourSession, User, SubscriptionPlan } from '../types';
import Plans from './Plans';
import { db, addDoc, getDocs } from '../lib/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

interface HomeDetailsProps {
  onNavigate: (tab: string) => void;
  user: User | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onOpenAuth: () => void;
  activeSubscriptionId?: string;
}

const SEED_RATINGS = [
  {
    id: 'seed-1',
    name: 'Dr. Helen Vance',
    affiliation: 'Principal Sedimentologist, Geological Society of London',
    stars: 5,
    comment: 'The interactive depth penetrometer lets me demonstrate stratigraphic layers in real time to my students. The level of high precision details and visual fidelity is unprecedented.',
    timestamp: '2026-06-20T12:00:00Z'
  },
  {
    id: 'seed-2',
    name: 'Prof. Arthur Sinclair',
    affiliation: 'Chair of Volcanology, ETH Zürich',
    stars: 5,
    comment: 'Lithos has revolutionized how we conduct remote stratigraphy field studies. The live broadcasts from active fissures were stunningly clear and highly interactive.',
    timestamp: '2026-06-21T09:30:00Z'
  },
  {
    id: 'seed-3',
    name: 'Sarah Jenkins',
    affiliation: 'Graduate Research Fellow, Stanford Earth',
    stars: 5,
    comment: 'Using the rock specimen guides for crystalline metamorphism saved me hours of manual lab classifications. Exceptional detail and very accurate.',
    timestamp: '2026-06-22T15:45:00Z'
  }
];

export default function HomeDetails({
  onNavigate,
  user,
  onSelectPlan,
  onOpenAuth,
  activeSubscriptionId,
}: HomeDetailsProps) {
  const reduce = useReducedMotion();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(GEOLOGIC_LAYERS[0].id);

  const activeLayer = GEOLOGIC_LAYERS.find((l) => l.id === selectedLayerId) || GEOLOGIC_LAYERS[0];

  // Pick first 3 rocks for our custom asymmetric bento grid
  const bentoRocks = ROCK_GUIDES.slice(0, 3);

  // Ratings section state
  const [customRatings, setCustomRatings] = useState<any[]>([]);
  const [ratingName, setRatingName] = useState('');
  const [ratingAffiliation, setRatingAffiliation] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingHoverStars, setRatingHoverStars] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-fill user's name if they sign in later
  useEffect(() => {
    if (user && user.displayName) {
      setRatingName(user.displayName);
    }
  }, [user]);

  // Load custom ratings from Firestore
  const fetchRatings = async () => {
    try {
      const q = query(collection(db, 'ratings'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: any[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCustomRatings(items);
    } catch (err) {
      console.warn("Firestore ratings load failed or collection doesn't exist yet:", err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleSubmitRating = async (e: FormEvent) => {
    e.preventDefault();
    if (!ratingName.trim() || !ratingComment.trim()) {
      alert('Please fill out your Name and Review Comment!');
      return;
    }

    setSubmittingRating(true);
    try {
      const newRating = {
        name: ratingName,
        affiliation: ratingAffiliation || 'Verified Student / Geologist',
        stars: ratingStars,
        comment: ratingComment,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'ratings'), newRating);
      setRatingComment('');
      setRatingAffiliation('');
      setSubmitSuccess(true);
      fetchRatings();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting review to Firestore:', err);
      alert('Could not submit your review. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const allRatings = [...customRatings, ...SEED_RATINGS];
  const totalStarsCount = allRatings.reduce((sum, r) => sum + r.stars, 0);
  const averageRating = allRatings.length > 0 ? (totalStarsCount / allRatings.length).toFixed(1) : '5.0';

  return (
    <div id="home-details" className="bg-[#070707] text-white">
      
      {/* SECTION: ACADEMIC & RESEARCH LOGO WALL */}
      <motion.section 
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border-y border-white/5 bg-black/30 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <span className="text-xs uppercase tracking-wider text-white/50 font-mono">
            Quietly trusted by leading academic and survey institutes:
          </span>
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            {/* USGS-style Monogram */}
            <div className="flex items-center gap-1.5 cursor-default group">
              <span className="font-playfair italic text-lg font-bold text-white group-hover:text-[#e8702a] transition-colors">USGS</span>
              <span className="text-[10px] tracking-tight font-mono text-white/40">Survey</span>
            </div>
            {/* NASA-style Monogram */}
            <div className="flex items-center gap-1.5 cursor-default group">
              <span className="font-playfair italic text-lg font-bold text-white group-hover:text-[#e8702a] transition-colors">NASA</span>
              <span className="text-[10px] tracking-tight font-mono text-white/40">Earth</span>
            </div>
            {/* BGS-style Monogram */}
            <div className="flex items-center gap-1.5 cursor-default group">
              <span className="font-playfair italic text-lg font-bold text-white group-hover:text-[#e8702a] transition-colors">BGS</span>
              <span className="text-[10px] tracking-tight font-mono text-white/40">London</span>
            </div>
            {/* EGU-style Monogram */}
            <div className="flex items-center gap-1.5 cursor-default group">
              <span className="font-playfair italic text-lg font-bold text-white group-hover:text-[#e8702a] transition-colors">EGU</span>
              <span className="text-[10px] tracking-tight font-mono text-white/40">Munich</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 1: DEEP CRUSTAL EXCAVATION (STRATIGRAPHY COLUMN) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Header left (5 columns) */}
          <motion.div 
            initial={reduce ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
              Deep crustal excavation
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-[45ch]">
              Sedimentary layers reveal chronological archives of tectonic cycles and climates. Hover over the geological stack to examine target deposits and mineral potential.
            </p>
            
            {/* Highlight Panel for selected layer */}
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#e8702a]">
                    {activeLayer.era}
                  </span>
                  <h4 className="text-lg font-semibold mt-1">{activeLayer.name}</h4>
                </div>
                <span className="bg-white/5 border border-white/10 text-white px-3 py-1 rounded-full text-xs font-mono">
                  {activeLayer.depthRange}
                </span>
              </div>
              
              <div className="space-y-3 text-xs text-white/80">
                <p>
                  <strong className="text-white">Composition:</strong> {activeLayer.composition}
                </p>
                <p className="leading-relaxed">
                  {activeLayer.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#e8702a]">
                  <span>Potential: {activeLayer.mineralPotential}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('Geology')}
              className="bg-white text-gray-950 hover:bg-gray-100 text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Launch Sandbox</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </button>
          </motion.div>

          {/* Interactive Stack Right (7 columns) */}
          <motion.div 
            initial={reduce ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex gap-4 sm:gap-6 items-stretch min-h-[460px]"
          >
            {/* Graphical Stratigraphy Strip */}
            <div className="w-20 bg-black/40 border border-white/5 rounded-3xl p-2 flex flex-col justify-between items-stretch">
              {GEOLOGIC_LAYERS.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className="flex-1 rounded-xl transition-all relative group flex items-center justify-center overflow-hidden my-1 cursor-pointer"
                    style={{ 
                      backgroundColor: layer.color,
                      opacity: isSelected ? 1 : 0.65,
                      filter: isSelected ? 'none' : 'brightness(0.7) grayscale(0.2)'
                    }}
                    title={layer.name}
                  >
                    {/* Ripple on hover */}
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute text-[10px] font-mono font-bold text-white/90 drop-shadow-md rotate-90">
                      {layer.depthRange.split(' ')[2] || layer.depthRange}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Layer List */}
            <div className="flex-1 flex flex-col justify-between gap-3">
              {GEOLOGIC_LAYERS.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onMouseEnter={() => setSelectedLayerId(layer.id)}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`flex-1 rounded-2xl border p-4.5 transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'bg-[#111111] border-[#e8702a] shadow-md shadow-[#e8702a]/5'
                        : 'bg-transparent border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                        {layer.depthRange}
                      </span>
                      <h5 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#e8702a]' : 'text-white'}`}>
                        {layer.name}
                      </h5>
                    </div>
                    <span className="text-xs font-mono text-white/50">
                      {layer.era.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

          </motion.div>

        </div>
      </section>

      {/* SECTION 2: BENTO GRID OF FEATURED SPECIMENS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="space-y-12">
          
          <motion.div 
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#e8702a] block">
              PRIMARY SPECIMENS
            </span>
            <h2 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
              Crystalline ribbons & volcanic glass
            </h2>
          </motion.div>

          {/* Asymmetric Bento Grid (Exactly 3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* CARD 1: OBSIDIAN - Wide Card (Spans 8 cols on desktop) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-8 bg-[#111111] border border-white/10 rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="inline-block bg-[#e8702a]/10 border border-[#e8702a]/20 text-[#e8702a] font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {bentoRocks[0].type.toUpperCase()} SPECIMEN
                  </span>
                  <h3 className="text-2xl font-semibold font-playfair italic">
                    {bentoRocks[0].name}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {bentoRocks[0].description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>Age: {bentoRocks[0].age}</span>
                  <button 
                    onClick={() => onNavigate('Field Guides')}
                    className="text-[#e8702a] hover:text-[#d2611f] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>View guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="w-full sm:w-80 h-64 sm:h-auto relative overflow-hidden bg-black border-t sm:border-t-0 sm:border-l border-white/10">
                <img 
                  src={bentoRocks[0].specimenUrl} 
                  alt={bentoRocks[0].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* CARD 2: BANDED IRON FORMATION - Tall/Standard Card (Spans 4 cols on desktop) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 bg-[#111111] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="h-48 relative overflow-hidden bg-black border-b border-white/10">
                <img 
                  src={bentoRocks[1].specimenUrl} 
                  alt={bentoRocks[1].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#e8702a] font-mono text-[10px] font-semibold uppercase">
                      {bentoRocks[1].type}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {bentoRocks[1].geologicEra}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold font-playfair italic">
                    {bentoRocks[1].name}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-4">
                    {bentoRocks[1].description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>Hardness: {bentoRocks[1].mohsHardness} Mohs</span>
                  <button 
                    onClick={() => onNavigate('Field Guides')}
                    className="text-[#e8702a] hover:text-[#d2611f] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>View guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: GNEISS - Full Width / Dynamic layout (Spans 12 cols on desktop) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-12 bg-[#111111] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black border-b md:border-b-0 md:border-r border-white/10">
                <img 
                  src={bentoRocks[2].specimenUrl} 
                  alt={bentoRocks[2].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e8702a]/10 border border-[#e8702a]/20 text-[#e8702a] font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {bentoRocks[2].type.toUpperCase()} FORMATION
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Era: {bentoRocks[2].geologicEra}
                    </span>
                  </div>
                  <h3 className="text-3xl font-semibold font-playfair italic">
                    {bentoRocks[2].name}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                    {bentoRocks[2].description}
                  </p>
                  
                  {/* Highlight scientific facts of metamorphism */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <span className="text-[10px] font-mono text-white/40 block uppercase">Formation mechanism</span>
                      <p className="text-xs text-white/80 mt-1 font-sans">
                        Subjected to immense heat and directional stress inside continental collision zones.
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <span className="text-[10px] font-mono text-white/40 block uppercase">Structural style</span>
                      <p className="text-xs text-white/80 mt-1 font-sans">
                        Crystalline ribbons segregate into high-contrast mineral bands of feldspar and quartz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>Age: {bentoRocks[2].age}</span>
                  <button 
                    onClick={() => onNavigate('Field Guides')}
                    className="bg-[#e8702a] hover:bg-[#d2611f] text-white font-sans text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all hover:scale-[1.03]"
                  >
                    <span>Browse All Field Guides</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 3: DUAL CARD EXPEDITION & ACADEMIC SPOTLIGHT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="space-y-12">
          
          <motion.div 
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
              Our next active live tours
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Expedition guides broadcast directly from active geological rift zones and deep formations. RSVP to secure an interactive chat feed seat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Card Left: Active Live Tour (Krafla Fissure) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="bg-[#e8702a] text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full animate-pulse">
                    LIVE STREAM BROADCAST
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    Spots left: {LIVE_TOURS[1].spotsLeft}
                  </span>
                </div>
                
                <h3 className="text-2xl font-semibold font-playfair italic">
                  {LIVE_TOURS[1].title}
                </h3>
                
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-sans">
                  {LIVE_TOURS[1].description}
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-white/80">
                    <Globe className="w-4 h-4 text-[#e8702a]" />
                    <span>{LIVE_TOURS[1].location}</span>
                  </div>
                  <span className="text-white/50">Guide: {LIVE_TOURS[1].guideName}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-[#e8702a] font-bold">
                  {LIVE_TOURS[1].dateTime}
                </span>
                <button
                  onClick={() => onNavigate('Live Tour')}
                  className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-[1.03]"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Join Live Feed</span>
                </button>
              </div>
            </motion.div>

            {/* Card Right: Academic Curriculum (Sedimentology & Stratigraphy) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-xl hover:border-white/20 transition-all group"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="bg-white/10 text-white border border-white/10 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full">
                    FEATURED CURRICULUM
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    Students: {COURSES[0].studentsCount}+
                  </span>
                </div>

                <h3 className="text-2xl font-semibold font-playfair italic">
                  {COURSES[0].title}
                </h3>

                <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-sans">
                  {COURSES[0].description}
                </p>

                {/* Short Syllabus Highlights */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-white/40 block uppercase">Syllabus Highlights:</span>
                  <div className="flex flex-wrap gap-2">
                    {COURSES[0].syllabus.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 text-white/80 rounded-xl px-3 py-1.5 text-[11px] font-sans">
                        {topic.length > 28 ? topic.slice(0, 25) + '...' : topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-[#e8702a] font-bold">
                  Price: {COURSES[0].price === 0 ? 'Free' : `$${COURSES[0].price}`} · {COURSES[0].duration}
                </span>
                <button
                  onClick={() => onNavigate('Course')}
                  className="bg-white text-gray-950 hover:bg-gray-100 text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-[1.03]"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Study Syllabus</span>
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 3.5: EXPLORATION PLANS & PRICING */}
      <section id="homepage-plans" className="border-t border-white/5 bg-[#0a0a0a]/80 py-16">
        <Plans
          user={user}
          onSelectPlan={onSelectPlan}
          onOpenAuth={onOpenAuth}
          activeSubscriptionId={activeSubscriptionId}
        />
      </section>

      {/* SECTION 4: INTEGRATED RATING & FEEDBACK SYSTEM */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 space-y-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          
          {/* Header left */}
          <motion.div 
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md space-y-4"
          >
            <span className="bg-[#e8702a]/10 border border-[#e8702a]/20 text-[#e8702a] font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Student & Academic Ledger
            </span>
            <h2 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
              What the geological community says
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Real verified reviews synced to our decentralized ledger database. Join academic institutes worldwide in grading our courses and active field guides.
            </p>

            {/* Average rating counter */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6 shadow-md"
            >
              <div className="text-center">
                <span className="text-5xl font-playfair italic font-bold text-white block">
                  {averageRating}
                </span>
                <span className="text-[10px] font-mono text-white/40 block mt-1">OUT OF 5.0</span>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${s <= Math.round(parseFloat(averageRating)) ? 'fill-[#e8702a] text-[#e8702a]' : 'text-white/20'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-white/60 font-sans">
                  Based on <span className="font-semibold text-white">{allRatings.length}</span> community audits
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form to submit review */}
          <motion.div 
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8702a]/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#e8702a]" />
              <h3 className="text-xl font-semibold font-playfair italic text-white">Write a Certified Review</h3>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={ratingName}
                    onChange={(e) => setRatingName(e.target.value)}
                    placeholder="e.g. Prof. Marie Tharp"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Affiliation / Title</label>
                  <input
                    type="text"
                    value={ratingAffiliation}
                    onChange={(e) => setRatingAffiliation(e.target.value)}
                    placeholder="e.g. Stanford University (Optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Your Audit Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingStars(s)}
                      onMouseEnter={() => setRatingHoverStars(s)}
                      onMouseLeave={() => setRatingHoverStars(null)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          s <= (ratingHoverStars ?? ratingStars) 
                            ? 'fill-[#e8702a] text-[#e8702a]' 
                            : 'text-white/20'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs text-white/40 font-mono ml-2">
                    ({ratingStars} / 5 stars)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Audit Comments</label>
                <textarea
                  required
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your experience studying stratigraphic layers or browsing the rock guides..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all resize-none"
                />
              </div>

              {submitSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center text-emerald-400 text-xs font-sans flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Review successfully compiled and synced to Lithos ledger!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-full bg-[#e8702a] hover:bg-[#d2611f] disabled:opacity-50 text-white font-medium text-xs py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                >
                  {submittingRating ? (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Commit Audit Feedback</span>
                </button>
              )}
            </form>
          </motion.div>
        </div>

        {/* Dynamic Reviews Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {allRatings.map((rating, idx) => (
            <motion.div 
              key={rating.id || idx}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-white/20">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3.5 h-3.5 ${s <= rating.stars ? 'fill-[#e8702a] text-[#e8702a]' : 'text-white/10'}`} 
                    />
                  ))}
                </div>
                <p className="text-white/80 text-xs sm:text-sm italic font-sans leading-relaxed">
                  "{rating.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white/90 block">
                    {rating.name}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono block">
                    {rating.affiliation}
                  </span>
                </div>
                <span className="text-[9px] text-white/30 font-mono">
                  {new Date(rating.timestamp).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black py-12 px-4 sm:px-6 lg:px-8 text-white/40 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-white/40" viewBox="0 0 256 256">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white/60 font-playfair italic text-lg font-medium">Lithos</span>
          </div>
          <div className="flex items-center gap-6">
            <span>License: MIT License</span>
            <span>Copyright 2026 Lithos Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
