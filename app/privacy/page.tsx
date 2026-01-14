import Link from 'next/link';

export default function PrivacyPage() {
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
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-500 text-sm font-mono mb-12">LAST UPDATED: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-300 mb-8">
                        Your privacy is critical. We are in the business of analyzing ideas, not selling your personal data. Here is how we handle your information.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">1. Data Collection</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, submit an idea for analysis, or contact us. This includes your email address and the details of your startup ideas.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">2. Use of Information</h3>
                    <p>
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-green-500">
                        <li>Provide, maintain, and analyze your submitted ideas.</li>
                        <li>Send you technical notices, updates, and support messages.</li>
                        <li>Improve our AI models and service quality.</li>
                    </ul>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">3. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">4. Third-Party Services</h3>
                    <p>
                        We use third-party providers for specific services (e.g., Supabase for database/auth, Groq/OpenAI for AI processing). We do not sell your data to advertisers.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-12 mb-6">5. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:getverdictai@gmail.com" className="text-white hover:text-green-500 transition-colors underline decoration-green-500/50">getverdictai@gmail.com</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
