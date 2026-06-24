import { useState } from 'react';
import { Search, GraduationCap, Clock, Star, Users, BookOpen, ChevronDown, CheckCircle } from 'lucide-react';
import { Course, User } from '../types';
import { COURSES } from '../data';

interface CourseHubProps {
  user: User | null;
  onEnroll: (course: Course) => void;
  onOpenAuth: () => void;
  enrolledCourseIds: string[];
}

export default function CourseHub({ user, onEnroll, onOpenAuth, enrolledCourseIds }: CourseHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const toggleSyllabus = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e8702a] font-mono">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>LITHOS ACADEMIC DIRECTORY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
          Decipher the Earth’s Dynamic History
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Enroll in accredited, self-paced geology modules. Journey from surface soil horizons to the molten core with guidance from leading planetary geologists.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-white/10">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search courses, instructors, rock systems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
          />
        </div>

        {/* Level Filters */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLevel === level
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Cover image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
                    
                    {/* Badge */}
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] px-2.5 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <div className="text-xs text-[#e8702a] font-mono">{course.instructor}</div>
                      <h3 className="text-xl sm:text-2xl font-playfair italic font-medium">{course.title}</h3>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Stats bar */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-white/50 font-mono py-2.5 border-y border-white/5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white/40" />
                        {course.studentsCount} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {course.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Accordion Syllabus toggle */}
                    <button
                      onClick={() => toggleSyllabus(course.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-white/60 hover:text-white transition-colors pt-2"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {isExpanded ? 'Hide Module Curriculum' : 'View Module Curriculum'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Syllabus list */}
                    {isExpanded && (
                      <div className="mt-4 space-y-2 bg-white/5 border border-white/5 rounded-2xl p-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="text-xs font-mono text-[#e8702a] mb-2 uppercase tracking-wide">Course Syllabus</div>
                        {course.syllabus.map((topic, index) => (
                          <div key={index} className="flex gap-3 text-xs leading-relaxed text-white/80">
                            <span className="font-mono text-white/30 text-right w-4">{index + 1}.</span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom enrollment action */}
                <div className="p-6 pt-0 mt-auto flex items-center justify-between gap-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Module Tuition</span>
                    <span className="text-2xl font-bold font-mono text-white">${course.price}</span>
                  </div>

                  {isEnrolled ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                      <span>Enrolled & Active</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) {
                          onOpenAuth();
                        } else {
                          onEnroll(course);
                        }
                      }}
                      className="bg-[#e8702a] hover:bg-[#d2611f] text-white font-medium text-xs px-6 py-3 rounded-xl transition-all hover:scale-[1.03] active:scale-95 shadow-md"
                    >
                      Enroll in Module
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 lg:col-span-2 text-center py-20 space-y-4">
            <GraduationCap className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="text-lg font-medium">No sedimentary anomalies found</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              Your query didn’t return any geological modules. Clear your filter criteria or search something else.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
