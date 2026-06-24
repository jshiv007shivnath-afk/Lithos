import { useState, useEffect, useRef, FormEvent } from 'react';
import { Calendar, Users, MapPin, Play, Tv, Send, ShieldCheck, RefreshCw } from 'lucide-react';
import { LIVE_TOURS } from '../data';
import { LiveTourSession, User } from '../types';

interface LiveTourProps {
  user: User | null;
  onOpenAuth: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isStaff?: boolean;
}

export default function LiveTour({ user, onOpenAuth }: LiveTourProps) {
  const [tours, setTours] = useState<LiveTourSession[]>(LIVE_TOURS);
  const [activeStreamTour, setActiveStreamTour] = useState<LiveTourSession | null>(null);
  const [userMsg, setUserMsg] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    { id: '1', sender: 'Prof. Marcus Sterling', text: 'Welcome to Krafla! We are currently looking at a newly split basalt fracture along the North American tectonic plate boundary.', time: '2:31 PM', isStaff: true },
    { id: '2', sender: 'Gemma_Rocks', text: 'This resolution is incredible! Are we seeing steam venting or is that sulfuric gas?', time: '2:32 PM' },
    { id: '3', sender: 'FieldExpeditions', text: 'It is a combination. Atmospheric moisture meeting boiling meteoric groundwaters mixed with H2S gas.', time: '2:32 PM', isStaff: true },
    { id: '4', sender: 'RockyRoads', text: 'Is it safe to get that close to the basalt flows?', time: '2:33 PM' }
  ]);

  const [rsvpList, setRsvpList] = useState<string[]>([]); // Tour IDs user RSVP'd to
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom when logs update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);

  // Simulate active chat feed if stream is active
  useEffect(() => {
    if (!activeStreamTour) return;

    const botComments = [
      { sender: 'GeologyJane', text: 'Wow, look at those column joint patterns in the basalt!' },
      { sender: 'Dr. Evelyn Moss', text: 'Those columns are formed by contraction during slow thermal cooling.', isStaff: true },
      { sender: 'BasaltBounty', text: 'Is the Krafla caldera still inflation-deflation cycling?' },
      { sender: 'Prof. Marcus Sterling', text: 'Yes, satellite geodesy shows steady inflation rates indicating magma chamber replenishment.', isStaff: true },
      { sender: 'DiggingDeep', text: 'Fascinating. I registered for the West Australia Iron tour as well!' }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < botComments.length) {
        const comment = botComments[index];
        setChatLogs((prev) => [
          ...prev,
          {
            id: 'bot-' + Math.random().toString(36).substring(2, 9),
            sender: comment.sender,
            text: comment.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStaff: comment.isStaff
          }
        ]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [activeStreamTour]);

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      sender: user?.displayName || user?.email.split('@')[0] || 'Explorer',
      text: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatLogs((prev) => [...prev, newMsg]);
    setUserMsg('');

    // Simulate guide reply
    setTimeout(() => {
      setChatLogs((prev) => [
        ...prev,
        {
          id: 'reply-' + Math.random().toString(36).substring(2, 9),
          sender: 'Prof. Marcus Sterling',
          text: `Excellent query, ${newMsg.sender}! We are recording that exact data parameter on our geochemical probes right now.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStaff: true
        }
      ]);
    }, 2000);
  };

  const handleRsvp = (tourId: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (rsvpList.includes(tourId)) {
      alert('You have already reserved a seat for this virtual field trip!');
      return;
    }

    setRsvpList((prev) => [...prev, tourId]);
    setTours((prevTours) =>
      prevTours.map((t) => {
        if (t.id === tourId && t.spotsLeft > 0) {
          return { ...t, spotsLeft: t.spotsLeft - 1 };
        }
        return t;
      })
    );
    alert('RSVP Confirmed! A calendar link and secure streaming pass have been saved to your account.');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e8702a] font-mono">
          <Tv className="w-3.5 h-3.5" />
          <span>VIRTUAL FIELD SESSIONS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
          Active Expedition Broadcasts
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Broadcasting live from global tectonic nodes. Access multi-camera feeds, join remote research vessels, and ask questions to guides in real-time.
        </p>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Broadcast Feed (if active), otherwise general scheduled tours list */}
        <div className="lg:col-span-8 space-y-8">
          {activeStreamTour ? (
            /* Active Live Stream Theater */
            <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Fake Live Video stream container */}
              <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/10 group">
                {/* Simulated landscape with active geology dikes */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504893524553-ac55fce698be?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 filter saturate-150 brightness-75 transition-all group-hover:scale-105 duration-1000" />
                
                {/* Camera Overlay indicators */}
                <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                  <span>STREAM 01: THERMAL CANOPY FEED</span>
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono border border-white/10">
                  LAT: 65.7142° N | LON: 16.7824° W
                </div>

                <div className="z-10 text-center space-y-4 max-w-md p-6">
                  <div className="w-16 h-16 rounded-full bg-[#e8702a]/90 backdrop-blur-md flex items-center justify-center text-white mx-auto shadow-lg shadow-[#e8702a]/20">
                    <Tv className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-playfair italic font-medium drop-shadow">Iceland Krafla Fissures</h3>
                  <p className="text-xs text-white/80 leading-relaxed drop-shadow">
                    Streaming active basalt cooling cracks, steam venting vents, and lava structures in real-time.
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono bg-black/50 p-2.5 rounded-xl backdrop-blur-sm">
                  <span>EXPEDITION CAPTAIN: MARCUS STERLING</span>
                  <span>GEOTHERMAL FLOW: 480 mW/m²</span>
                </div>
              </div>

              {/* Stream Title Bar */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      ACTIVE EXPEDITION BROADCAST
                    </span>
                    <h3 className="text-2xl font-playfair italic font-medium">{activeStreamTour.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveStreamTour(null)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-3.5 py-1.5 rounded-xl font-mono"
                  >
                    LEAVE THEATER [✕]
                  </button>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {activeStreamTour.description}
                </p>
              </div>
            </div>
          ) : (
            /* General Sessions List */
            <div className="space-y-6">
              <h3 className="text-xl font-playfair italic border-b border-white/5 pb-3">Available Field Trips</h3>
              
              {tours.map((tour) => {
                const isLive = tour.status === 'Live';
                const hasRsvpd = rsvpList.includes(tour.id);

                return (
                  <div
                    key={tour.id}
                    className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1.5">
                        <span className={`inline-block font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          isLive 
                            ? 'bg-red-500/15 border border-red-500/30 text-red-400 animate-pulse' 
                            : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                        }`}>
                          {tour.status === 'Live' ? '● BROADCASTING ACTIVE' : 'UPCOMING EXPEDITION'}
                        </span>
                        <h4 className="text-2xl font-playfair italic font-medium leading-tight">
                          {tour.title}
                        </h4>
                      </div>

                      <p className="text-sm text-white/70 leading-relaxed">
                        {tour.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50 font-mono">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-white/30" />
                          {tour.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-white/30" />
                          {tour.dateTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-white/30" />
                          {tour.spotsLeft} seats left
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      {isLive ? (
                        <button
                          onClick={() => setActiveStreamTour(tour)}
                          className="w-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-medium text-xs px-6 py-3 rounded-xl transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#e8702a]/10"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Join Live Broadcast</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRsvp(tour.id)}
                          className={`w-full font-medium text-xs px-6 py-3 rounded-xl transition-all ${
                            hasRsvpd
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:scale-[1.02]'
                          }`}
                        >
                          {hasRsvpd ? '✓ Seat Reserved' : 'RSVP Free Seat'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Chat Feed (if active), otherwise generic Info banner */}
        <div className="lg:col-span-4 h-full">
          {activeStreamTour ? (
            /* Live Stream Chat Log Container */
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-5 flex flex-col h-[500px] text-white">
              <div className="border-b border-white/10 pb-3 mb-4 flex justify-between items-center shrink-0">
                <span className="text-xs font-mono font-bold tracking-wider">LIVE RECON FEED CHAT</span>
                <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/50">
                  {chatLogs.length} nodes active
                </span>
              </div>

              {/* Chat Messages Scrolling Box */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin">
                {chatLogs.map((chat) => (
                  <div key={chat.id} className="text-xs space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`font-semibold ${chat.isStaff ? 'text-[#e8702a]' : 'text-white/80'}`}>
                        {chat.sender}
                        {chat.isStaff && (
                          <span className="ml-1 text-[8px] font-mono bg-[#e8702a]/10 border border-[#e8702a]/20 px-1 py-0.2 rounded font-normal">
                            GUIDE
                          </span>
                        )}
                      </span>
                      <span className="text-[8px] font-mono text-white/30 shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-white/70 leading-normal font-sans break-words bg-white/5 p-2 rounded-xl border border-white/5">
                      {chat.text}
                    </p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Message Composer Form */}
              <form onSubmit={handleSendChat} className="mt-auto flex gap-2 pt-3 border-t border-white/10 shrink-0">
                <input
                  type="text"
                  placeholder={user ? "Ask a geological question..." : "Log in to join broadcast chat"}
                  disabled={!user}
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8702a] disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={!user || !userMsg.trim()}
                  className="bg-[#e8702a] hover:bg-[#d2611f] disabled:bg-white/5 disabled:text-white/30 text-white p-2.5 rounded-xl transition-all hover:scale-[1.03]"
                  aria-label="Send Chat Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* General Broadcast Info */
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <h4 className="text-lg font-playfair italic border-b border-white/5 pb-3">Virtual Expedition Tech</h4>
              
              <div className="space-y-4 text-xs leading-relaxed text-white/70">
                <p>
                  Our expeditions use high-altitude satellite transmitters paired with stereoscopic multi-angle lenses to transmit 360° environment layouts live from extreme geological zones.
                </p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2.5 font-mono">
                  <div className="text-[10px] text-[#e8702a] uppercase font-bold">Hardware Specs</div>
                  <div className="flex justify-between border-b border-white/5 pb-1 text-white/60">
                    <span>Uplink Node:</span>
                    <span>Tectonic-8 SAT</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1 text-white/60">
                    <span>Resolution:</span>
                    <span>UHD stereoscopic</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Latency:</span>
                    <span>&lt; 180ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
