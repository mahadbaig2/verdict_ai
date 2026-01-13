import { DashboardReport } from '@/lib/groq';
import { VerdictHeader } from './dashboard/VerdictHeader';
import { MarketSignalCard } from './dashboard/MarketSignalCard';
import { CompetitorTable } from './dashboard/CompetitorTable';
import { DistributionGrid } from './dashboard/DistributionGrid';
import { RiskMatrix } from './dashboard/RiskMatrix';
import { ActionPlanTimeline } from './dashboard/ActionPlanTimeline';
import { User, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReadinessReportProps {
    report: DashboardReport;
    ideaSummary: string;
}

export default function ReadinessReportView({ report, ideaSummary }: ReadinessReportProps) {
    return (
        <div className="max-w-6xl mx-auto px-4 pb-20">

            {/* 1. Executive Verdict Panel */}
            <VerdictHeader
                verdict={report.verdict.status}
                rationale={report.verdict.rationale}
                score={report.verdict.score}
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Column (Left specific modules) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 2. Market Market Signal Snapshot */}
                    <MarketSignalCard
                        pain_intensity={report.market_snapshot.pain_intensity}
                        demand_visibility={report.market_snapshot.demand_visibility}
                        signal_quality={report.market_snapshot.signal_quality}
                        signals={report.market_snapshot.top_signals}
                    />

                    {/* 3. Competitor Landscape */}
                    <CompetitorTable
                        direct={report.competitors.direct}
                        indirect={report.competitors.indirect_substitutes}
                    />

                    {/* 4. Differentiation Reality Check */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" /> Differentiation Reality Check
                        </h2>
                        <div className="mb-6 p-4 bg-white/5 border-l-2 border-green-500 rounded-r-lg">
                            <p className="text-gray-300 italic">"{report.differentiation.reality_check}"</p>
                        </div>
                        <div className="space-y-3">
                            {report.differentiation.claims.map((claim, i) => (
                                <div key={i} className="flex items-start justify-between bg-white/[0.02] p-4 rounded-lg border border-white/5">
                                    <div>
                                        <span className="text-sm font-bold text-white block mb-1">{claim.feature}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${claim.is_real_moat ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-400 border border-gray-600'
                                            }`}>
                                            {claim.is_real_moat ? 'Defensible Moat' : 'Cosmetic Feature'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 text-right max-w-[150px] leading-relaxed ml-4">{claim.verdict}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Distribution Levers */}
                    <DistributionGrid collaborators={report.distribution.collaborators} />

                    {/* 8. Action Plan */}
                    <ActionPlanTimeline plan={report.action_plan} />

                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">

                    {/* 6. Founder Fit Panel */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" /> Founder-Fit
                        </h2>
                        <div className="text-center mb-6 py-4 bg-white/[0.02] rounded-lg border border-white/5">
                            <div className="text-5xl font-serif text-white mb-1">{report.founder_fit.score}</div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Fit Score</div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-3 border-b border-white/5 pb-1">Strengths Leveraged</span>
                                {report.founder_fit.strengths_leveraged.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-300 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span className="leading-snug">{s}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-3 border-b border-white/5 pb-1">Critical Gaps</span>
                                {report.founder_fit.critical_gaps.map((g, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-300 mb-2">
                                        <span className="text-red-500 font-bold text-lg leading-none mt-[-2px]">×</span>
                                        <span className="leading-snug">{g}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 7. Risk Matrix */}
                    <RiskMatrix risks={report.risks} />

                    {/* Pivot Suggestion (if applicable) */}
                    {(report.verdict.status === 'PIVOT' || report.verdict.status === 'KILL') && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <AlertTriangle className="w-24 h-24 text-yellow-500" />
                            </div>
                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block mb-2 relative z-10">Strategic Order</span>
                            <p className="text-yellow-200 font-serif text-lg leading-relaxed relative z-10">"{report.verdict.rationale}"</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 text-center text-gray-600 text-[10px] uppercase tracking-widest font-mono border-t border-white/5 pt-8">
                Generated by Verdict AI • {new Date().getFullYear()} • Confidential & Proprietary
            </footer>
        </div>
    );
}
