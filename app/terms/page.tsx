import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-300 font-sans selection:bg-green-900 selection:text-green-50">
            <nav className="border-b border-white/5 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-serif font-black text-xl text-black group-hover:bg-green-500 transition-colors">V</div>
                        <span className="font-serif font-bold text-xl text-white tracking-tight">Verdict.ai</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-24">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-gray-500 text-sm font-mono mb-12">LAST UPDATED: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-300 mb-8">
                        By using Verdict.ai ("Service"), you agree to be bound by these Terms. If you don't agree, please do not use our Service. We're here to give you honest feedback, not legal headaches, but we need these rules to operate.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">1. Usage & Credits</h3>
                    <p>
                        This is a credit-based service. New accounts may receive free credits to test the service. Additional credits may be purchased. One credit equals one idea analysis. Credits are non-refundable once used.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">2. No Investment Advice</h3>
                    <p>
                        Our AI generates "Verdicts" based on market data patterns. <strong>This is NOT financial or investment advice.</strong> We are a software tool, not a registered investment advisor. Decisions made based on our analysis are your own responsibility.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">3. Content & Intellectual Property</h3>
                    <p>
                        You retain ownership of the ideas you submit. We do not claim ownership of your startup concepts. However, we use the data to process your request and improve our AI models.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">4. Limitation of Liability</h3>
                    <p>
                        To the maximum extent permitted by law, Verdict.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">5. Changes to Terms</h3>
                    <p>
                        We may modify these Terms at any time. If we do, we'll post the changes on this page. Continued use of the Service after changes constitutes acceptance.
                    </p>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <p className="text-gray-500 mb-4">Questions?</p>
                    <a href="mailto:getverdictai@gmail.com" className="text-green-500 hover:text-green-400 font-medium transition-colors">
                        getverdictai@gmail.com
                    </a>
                </div>
            </main>
        </div>
    );
}
