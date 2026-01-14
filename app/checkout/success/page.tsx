import Link from 'next/link';
import { CheckCircle2, ArrowRight, Zap, Mail } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            {/* Header */}
            <nav className="border-b border-white/5 bg-gray-950/50 backdrop-blur-sm px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-serif font-black text-xl text-black group-hover:bg-green-500 transition-colors">V</div>
                    <span className="font-serif font-bold text-xl text-white tracking-tight">Verdict.ai</span>
                </Link>
            </nav>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 inline-block">
                        <div className="w-20 h-20 bg-green-600/10 rounded-full flex items-center justify-center border border-green-500/20 relative">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                        Welcome to the <span className="text-green-500 italic">Elite</span>.
                    </h1>
                    <p className="text-gray-400 mb-10 text-lg">
                        Your lifetime access has been activated. We've added 100 analysis credits to your account.
                    </p>

                    <div className="grid gap-4 mb-10">
                        <Link
                            href="/dashboard"
                            className="bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-white font-bold text-sm uppercase tracking-wide">Next Steps</span>
                            </div>
                            <ul className="text-gray-400 text-sm space-y-2 font-mono">
                                <li>1. Submit your first venture idea</li>
                                <li>2. Review the market sentiment data</li>
                                <li>3. Generate your PDF readiness report</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-wider">
                        <Mail className="w-3 h-3" />
                        Check your email for receipt
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center border-t border-white/5">
                <p className="text-gray-600 text-[10px] font-mono leading-relaxed">
                    © {new Date().getFullYear()} VERDICT AI VENTURES. ALL RIGHTS RESERVED.<br />
                    SECURE TRANSACTION PROCESSED BY PADDLE.
                </p>
            </footer>
        </div>
    );
}
