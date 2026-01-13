import { ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface VerdictHeaderProps {
    verdict: 'GO' | 'PIVOT' | 'KILL';
    rationale: string;
    score: number;
}

export function VerdictHeader({ verdict, rationale, score }: VerdictHeaderProps) {
    const getStyles = () => {
        switch (verdict.toLowerCase()) {
            case 'go': return { bg: 'bg-green-500', text: 'text-green-900', border: 'border-green-600', hue: 'green' };
            case 'pivot': return { bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500', hue: 'yellow' };
            case 'kill': return { bg: 'bg-red-500', text: 'text-red-900', border: 'border-red-600', hue: 'red' };
            default: return { bg: 'bg-gray-500', text: 'text-gray-900', border: 'border-gray-600', hue: 'gray' };
        }
    };

    const styles = getStyles();

    return (
        <div className={`relative overflow-hidden rounded-2xl p-8 mb-8 text-white shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700`}>
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-30 bg-${styles.hue}-500`} />

            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-white/10 border border-white/20`}>
                            Official Verdict
                        </span>
                        <span className="text-gray-400 text-sm font-mono">CONFIDENTIAL</span>
                    </div>

                    <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 leading-none`}>
                        {verdict}
                    </h1>

                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-200 opacity-90 border-l-4 border-white/20 pl-4">
                        "{rationale}"
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 w-full md:w-auto min-w-[200px] flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Readiness Score</span>
                    <div className="relative">
                        <div className={`text-6xl font-bold text-${styles.hue}-400`}>
                            {score}
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
                        <div className={`h-full bg-${styles.hue}-400`} style={{ width: `${score}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
