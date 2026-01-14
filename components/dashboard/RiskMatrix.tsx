import { AlertTriangle, Flag } from 'lucide-react';

interface Risk {
    risk_name: string;
    impact: 'Low' | 'Medium' | 'High';
    probability: 'Low' | 'Medium' | 'High';
    description: string;
}

export function RiskMatrix({ risks }: { risks: Risk[] }) {
    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Execution Risk Map
            </h2>

            <div className="grid gap-4">
                {risks.map((risk, i) => (
                    <div key={i} className="bg-white/5 rounded-lg border border-red-500/20 p-4 border-l-4 border-l-red-600 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-white/[0.08] transition-colors">
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-1">{risk.risk_name}</h3>
                            <p className="text-sm text-gray-400 font-light leading-relaxed">{risk.description}</p>
                        </div>

                        <div className="flex flex-col gap-2 self-start">
                            <div className="text-center px-4 py-2 bg-white/5 rounded border border-white/10 min-w-[70px]">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Prob</div>
                                <div className={`font-bold ${risk.probability === 'High' ? 'text-red-500' :
                                    risk.probability === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                    }`}>{risk.probability}</div>
                            </div>
                            <div className="text-center px-4 py-2 bg-white/5 rounded border border-white/10 min-w-[70px]">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Impact</div>
                                <div className={`font-bold ${risk.impact === 'High' ? 'text-red-400' :
                                    risk.impact === 'Medium' ? 'text-red-300' : 'text-red-200'
                                    }`}>{risk.impact}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
