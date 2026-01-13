import { Shield, Zap, Info, AlertCircle } from 'lucide-react';

interface DirectCompetitor {
    name: string;
    one_liner: string;
    target_audience: string;
    pricing?: string;
    url?: string;
}

interface IndirectSubstitute {
    method: string;
    why_good_enough: string;
    switching_friction: 'Low' | 'Medium' | 'High';
}

interface CompetitorTableProps {
    direct: DirectCompetitor[];
    indirect: IndirectSubstitute[];
}

export function CompetitorTable({ direct, indirect }: CompetitorTableProps) {
    return (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Direct Competitors */}
            <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-red-500/20 bg-red-500/10 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <h2 className="font-bold text-white">Direct Competitors</h2>
                </div>
                <div className="divide-y divide-white/5">
                    {direct.map((comp, i) => (
                        <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-white tracking-wide">{comp.name}</h3>
                                {comp.pricing && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-medium uppercase tracking-wider">{comp.pricing}</span>}
                            </div>
                            <p className="text-sm text-gray-400 mb-2 font-light">{comp.one_liner}</p>
                            <div className="text-xs text-gray-500">
                                <span className="font-medium mr-1 text-gray-400">Target:</span> {comp.target_audience}
                            </div>
                        </div>
                    ))}
                    {direct.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No direct competitors identified.</div>
                    )}
                </div>
            </div>

            {/* Indirect Substitutes (The Real Killers) */}
            <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-orange-500/20 bg-orange-500/10 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <h2 className="font-bold text-white">The "Good Enough" Alternatives</h2>
                </div>
                <div className="divide-y divide-white/5">
                    {indirect.map((sub, i) => (
                        <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white tracking-wide">{sub.method}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${sub.switching_friction === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    sub.switching_friction === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        'bg-green-500/20 text-green-400 border border-green-500/30'
                                    }`}>
                                    {sub.switching_friction} Friction
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5 italic">
                                "{sub.why_good_enough}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
