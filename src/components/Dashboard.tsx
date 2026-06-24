import { useState, useEffect } from 'react';
import { Award, Compass, GraduationCap, CheckCircle, Clock, BookOpen, Heart, DollarSign, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import { User, Course, RockGuide, PaymentReceipt } from '../types';
import { COURSES, ROCK_GUIDES } from '../data';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
  savedSpecimens: string[];
}

export default function Dashboard({ user, onLogout, onNavigateToTab, savedSpecimens }: DashboardProps) {
  const [activeCourseLesson, setActiveCourseLesson] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]); // Array of 'courseId-lessonIndex'
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [grantsRequested, setGrantsRequested] = useState<number>(0);

  // Sync receipts and enrolled course updates
  useEffect(() => {
    try {
      const storedReceipts = JSON.parse(localStorage.getItem('lithos_receipts') || '[]');
      const userReceipts = storedReceipts.filter((r: PaymentReceipt) => r.userId === user.uid);
      setReceipts(userReceipts);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Map enrolled courses
  const userEnrolledCourses = COURSES.filter((c) => user.enrolledCourses.includes(c.id));

  // Map bookmarked rocks
  const userBookmarkedRocks = ROCK_GUIDES.filter((r) => savedSpecimens.includes(r.id));

  const claimGrants = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('lithos_users') || '[]');
      const updated = storedUsers.map((u: any) => {
        if (u.uid === user.uid) {
          u.balance = (u.balance ?? 100) + 50;
        }
        return u;
      });
      localStorage.setItem('lithos_users', JSON.stringify(updated));
      user.balance += 50; // trigger state update locally
      setGrantsRequested((prev) => prev + 1);
      alert('Academic Grant approved! +$50.00 Lithos credits credited to your geological account.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteLesson = (courseId: string, index: number) => {
    const key = `${courseId}-${index}`;
    if (!completedLessons.includes(key)) {
      setCompletedLessons((prev) => [...prev, key]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500 space-y-12">
      {/* Dashboard Top Header */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#e8702a]/10 border border-[#e8702a]/30 text-[#e8702a] font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase">
              {user.activeSubscription ? `${user.activeSubscription.toUpperCase()} SUBSCRIBER` : 'SURFACE EXPLORER'}
            </span>
            <span className="font-mono text-xs text-white/40">Member since {new Date(user.createdAt).getFullYear()}</span>
          </div>
          <h1 className="text-3xl font-playfair italic font-medium">Welcome back, {user.displayName || user.email.split('@')[0]}</h1>
          <p className="text-xs sm:text-sm text-white/50">Deciphering strata, crystalline rocks, and plate movements across geological eras.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* balance node */}
          <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl font-mono text-xs flex flex-col justify-center">
            <span className="text-white/40 text-[9px] uppercase">Lithos Credits</span>
            <span className="font-bold text-emerald-400 text-sm">${(user.balance ?? 100).toFixed(2)}</span>
          </div>

          <button
            onClick={claimGrants}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-4 py-2.5 rounded-2xl transition-all"
          >
            Request Grant (+$50)
          </button>

          <button
            onClick={onLogout}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs px-4 py-2.5 rounded-2xl transition-all"
          >
            Log Out Account
          </button>
        </div>
      </div>

      {/* Classroom Mode / Lesson Player if a course is launched */}
      {activeCourseLesson && (
        <div className="bg-[#111111] border border-[#e8702a]/30 rounded-3xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-300 relative">
          <button
            onClick={() => setActiveCourseLesson(null)}
            className="absolute top-5 right-5 text-xs font-mono text-white/40 hover:text-white"
          >
            LEAVE CLASSROOM [✕]
          </button>

          <div className="space-y-1">
            <div className="text-xs text-[#e8702a] font-mono uppercase tracking-wide">ACTIVE ONLINE CLASSROOM MODULE</div>
            <h3 className="text-2xl font-playfair italic font-semibold">{activeCourseLesson.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Lessons syllabus rail */}
            <div className="md:col-span-4 bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-mono text-white/40 uppercase mb-3 px-2">Module Sections</div>
              {activeCourseLesson.syllabus.map((topic, i) => {
                const isCompleted = completedLessons.includes(`${activeCourseLesson.id}-${i}`);
                const isCurrent = activeLessonIndex === i;

                return (
                  <button
                    key={i}
                    onClick={() => setActiveLessonIndex(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                      isCurrent 
                        ? 'bg-[#e8702a]/10 border border-[#e8702a]/30 text-white font-bold' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate pr-2">{i + 1}. {topic}</span>
                    {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Lesson Text Reader simulation */}
            <div className="md:col-span-8 bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-white/40">SECTION {activeLessonIndex + 1} OF {activeCourseLesson.syllabus.length}</span>
                <h4 className="text-lg font-playfair italic font-medium text-white">
                  {activeCourseLesson.syllabus[activeLessonIndex]}
                </h4>
              </div>

              <div className="text-xs sm:text-sm text-white/70 leading-relaxed space-y-4">
                <p>
                  In this section, we review the precise chemical reactions and physical transport mechanics involved. Structural dynamics dictate that minerals crystalize in order of cooling temperature indexes as detailed by Bowen’s Reaction Series.
                </p>
                <p>
                  As layers accumulate, compaction drives out interstitial water. When fluids saturated with dissolved silicates, carbonates, or iron oxides migrate through the matrix, crystalline cement deposits, binding the loose grains into rigid sedimentary strata.
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated reading: 8 mins</span>
                </div>

                <button
                  onClick={() => handleCompleteLesson(activeCourseLesson.id, activeLessonIndex)}
                  disabled={completedLessons.includes(`${activeCourseLesson.id}-${activeLessonIndex}`)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-emerald-500/5 disabled:text-emerald-500/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-4 py-2 rounded-xl transition-all"
                >
                  {completedLessons.includes(`${activeCourseLesson.id}-${activeLessonIndex}`) ? '✓ Section Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Courses & Specimens */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Enrolled Courses */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-playfair italic border-b border-white/5 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5.5 h-5.5 text-[#e8702a]" />
              Enrolled Academic Modules
            </h3>

            {userEnrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {userEnrolledCourses.map((course) => {
                  const topicsCompleted = activeCourseLesson?.id === course.id ? completedLessons.filter(k => k.startsWith(course.id)).length : 0;
                  const totalTopics = course.syllabus.length;
                  const progressPct = totalTopics > 0 ? (topicsCompleted / totalTopics) * 100 : 0;

                  return (
                    <div
                      key={course.id}
                      className="bg-black/30 border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="text-xs text-[#e8702a] font-mono">{course.instructor}</div>
                        <h4 className="text-lg font-playfair italic font-medium leading-snug">{course.title}</h4>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-32 bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${progressPct}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-white/40">{topicsCompleted}/{totalTopics} steps complete</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveCourseLesson(course);
                          setActiveLessonIndex(0);
                        }}
                        className="bg-[#e8702a] hover:bg-[#d2611f] text-white font-mono text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        Enter Classroom
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <GraduationCap className="w-12 h-12 text-white/20 mx-auto" />
                <h4 className="text-sm font-semibold text-white/80">No Academic Enrollments found</h4>
                <p className="text-xs text-white/40 max-w-sm mx-auto">
                  You are not currently enrolled in any module. Head to the Academic catalog to purchase and unlock geological strata guides.
                </p>
                <button
                  onClick={() => onNavigateToTab('Course')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all"
                >
                  Browse Geologic Catalog
                </button>
              </div>
            )}
          </div>

          {/* Bookmarked Specimens */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-playfair italic border-b border-white/5 pb-3 flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-[#e8702a]" />
              Bookmarked Specimen Ledger
            </h3>

            {userBookmarkedRocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userBookmarkedRocks.map((rock) => (
                  <div
                    key={rock.id}
                    onClick={() => onNavigateToTab('Field Guides')}
                    className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-white/10 cursor-pointer transition-all"
                  >
                    <img
                      src={rock.specimenUrl}
                      alt={rock.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-mono text-white/40 uppercase">{rock.type}</div>
                      <h4 className="text-sm font-playfair italic font-semibold">{rock.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Compass className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-xs text-white/40 max-w-sm mx-auto">
                  No bookmarked specimen files inside your digital field notebooks. Save rock layers on the Specimen Directory.
                </p>
                <button
                  onClick={() => onNavigateToTab('Field Guides')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all"
                >
                  Open Field Directory
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Ledger Receipts & Subscriptions */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Ledger Invoice Receipts */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-playfair italic border-b border-white/5 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#e8702a]" />
                Transaction Ledger Receipts
              </h3>

              {receipts.length > 0 ? (
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {receipts.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] space-y-2 relative group"
                    >
                      <button
                        onClick={() => window.print()}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-white transition-opacity"
                        title="Print invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex justify-between font-bold text-white">
                        <span>{rec.id}</span>
                        <span className="text-[#e8702a]">${rec.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Item:</span>
                        <span className="text-right truncate max-w-[150px]">{rec.itemName}</span>
                      </div>
                      <div className="flex justify-between text-white/40">
                        <span>Date:</span>
                        <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-white/40">
                  No active transaction records on this profile session. Enroll or join premium surveyor tiers.
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 mt-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-start gap-2 text-[10px] text-white/50 leading-relaxed font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Profiles and course completions are securely localized on your current browser container.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
