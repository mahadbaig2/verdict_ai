import { CalendarCheck, Target, Ban, CheckCircle2 } from 'lucide-react';

interface FullActionPlan {
    week_1: string[];
    week_2: string[];
    week_3: string[];
    week_4: string[];
    success_criteria: string[];
    anti_goals: string[];
}

export function ActionPlanTimeline({ plan }: { plan: FullActionPlan }) {
    return (
        <div className="bg-white/5 text-white rounded-2xl p-8 shadow-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-green-500" /> 30-Day Attack Plan
            </h2>

            <div className="grid md:grid-cols-4 gap-6 mb-8 relative">
                {/* Connecting Line (Mobile Hidden) */}
                <div className="hidden md:block absolute top-4 left-0 w-full h-0.5 bg-white/10 -z-10" />

                {[plan.week_1, plan.week_2, plan.week_3, plan.week_4].map((week, i) => (
                    <div key={i} className="relative group">
                        <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-green-500 flex items-center justify-center font-bold text-green-500 text-sm mb-4 mx-auto md:mx-0 z-10 relative group-hover:bg-green-500 group-hover:text-black transition-colors">
                            W{i + 1}
                        </div>
                        <h3 className="font-bold text-white mb-3 text-center md:text-left">Week {i + 1}</h3>
                        <ul className="space-y-2">
                            {week.map((step, j) => (
                                <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                                    <span className="text-green-500 font-bold mt-0.5">•</span>
                                    <span className="leading-snug">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Target className="w-4 h-4" /> Success Criteria
                    </h4>
                    <ul className="space-y-2 mt-3">
                        {plan.success_criteria.map((crit, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{crit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Ban className="w-4 h-4" /> Anti-Goals (Avoid)
                    </h4>
                    <ul className="space-y-2 mt-3">
                        {plan.anti_goals.map((goal, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-red-500 font-bold shrink-0 text-lg leading-none mt-[-2px]">×</span>
                                <span className="leading-snug">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
