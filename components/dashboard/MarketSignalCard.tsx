import { TrendingUp, Users, MessageSquare, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Signal {
    source: 'Reddit' | 'HackerNews' | 'Other';
    text: string;
    sentiment: 'complaint' | 'desire' | 'competitor_mention';
    url?: string;
}

interface MarketSignalProps {
    pain_intensity: number;
    demand_visibility: number;
    signal_quality: 'High' | 'Medium' | 'Low';
    signals: Signal[];
}

export function MarketSignalCard({ pain_intensity, demand_visibility, signal_quality, signals }: MarketSignalProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Market Reality
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Real-time signals captured from Reddit & Hacker News</p>
                </div>

                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">{pain_intensity}%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pain Score</div>
                    </div>
                    <div className="w-px bg-white/10 h-10" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">{demand_visibility}%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Demand</div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Signal Quality:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${signal_quality === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        signal_quality === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>{signal_quality}</span>
                </div>

                <div className={`space-y-3 transition-all ${expanded ? '' : 'max-h-[300px] overflow-hidden relative'}`}>
                    {signals.map((signal, i) => (
                        <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${signal.source === 'Reddit' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-gray-700 text-gray-300 border border-gray-600'
                                    }`}>
                                    {signal.source}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${signal.sentiment === 'complaint' ? 'text-red-400' :
                                    signal.sentiment === 'desire' ? 'text-green-400' : 'text-blue-400'
                                    }`}>
                                    {signal.sentiment}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed italic border-l-2 border-white/10 pl-3 my-2">
                                "{signal.text}"
                            </p>
                            {signal.url && (
                                <a href={signal.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 hover:underline mt-2 transition-colors">
                                    View thread <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    ))}

                    {!expanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" />
                    )}
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                    {expanded ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>View All Signals <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
