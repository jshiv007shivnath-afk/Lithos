import { Check, Star, Shield, HelpCircle } from 'lucide-react';
import { PLANS } from '../data';
import { SubscriptionPlan, User } from '../types';

interface PlansProps {
  user: User | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onOpenAuth: () => void;
  activeSubscriptionId?: string;
}

export default function Plans({ user, onSelectPlan, onOpenAuth, activeSubscriptionId }: PlansProps) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#e8702a] font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>LITHOS EXPLORATION TIERS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic font-medium leading-tight">
          Choose Your Geological Scope
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Unlock high-resolution crust mapping datasets, certified academic curriculums, and priority streaming seats on active volcanic research field-trips.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {PLANS.map((plan) => {
          const isActive = activeSubscriptionId === plan.id;
          const isFree = plan.price === 0;

          return (
            <div
              key={plan.id}
              className={`bg-[#111111] border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all ${
                plan.popular 
                  ? 'border-[#e8702a] ring-1 ring-[#e8702a] shadow-lg shadow-[#e8702a]/5' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular Tag */}
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e8702a] text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  SURVEYOR FAVORITE
                </span>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-playfair italic font-semibold">{plan.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing Display */}
                <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                  <span className="text-4xl font-bold font-mono text-white">${plan.price}</span>
                  <span className="text-xs text-white/40 font-mono">/ {plan.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 text-xs text-white/70">
                  {plan.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2.5 leading-normal">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action Trigger */}
              <div className="pt-8">
                {isActive ? (
                  <div className="w-full text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs py-3 rounded-xl">
                    Active Subscription Tier
                  </div>
                ) : isFree && !activeSubscriptionId ? (
                  <div className="w-full text-center bg-white/5 border border-white/10 text-white/40 font-mono text-xs py-3 rounded-xl">
                    Default Surface Tier Active
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth();
                      } else {
                        onSelectPlan(plan);
                      }
                    }}
                    className={`w-full font-medium text-xs py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-95 text-center block ${
                      plan.popular
                        ? 'bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="border-t border-white/10 pt-12 max-w-4xl mx-auto space-y-6">
        <h3 className="text-lg font-playfair italic text-center mb-8">Frequently Asked Exploration Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2 bg-[#111111] p-5 rounded-2xl border border-white/5">
            <h4 className="font-semibold text-[#e8702a] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              How are physical specimens shipped?
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              For Core Pioneer subscribers, our curation division wraps and ships a physical hand-specimen rock sample box monthly directly from certified geological reserves around the globe.
            </p>
          </div>
          <div className="space-y-2 bg-[#111111] p-5 rounded-2xl border border-white/5">
            <h4 className="font-semibold text-[#e8702a] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Can I cancel my exploration sub?
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Absolutely. You can terminate or modify your survey membership tier at any given time via your profile dashboard with instant confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
