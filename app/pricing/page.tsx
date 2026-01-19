'use client';

import { PricingSection } from '@/components/PricingSection';
import { LandingPageHeader } from '@/components/LandingPageHeader';
import { Footer } from '@/components/Footer';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black">
            <LandingPageHeader />
            <main className="pt-20">
                <PricingSection />

                {/* Extra value section for dedicated page */}
                <div className="max-w-7xl mx-auto px-6 pb-24 text-center">
                    <h2 className="font-serif text-3xl text-white mb-12">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                        <div>
                            <h3 className="text-white font-bold mb-2">How do credits work?</h3>
                            <p className="text-gray-400 text-sm">Each credit allows you to perform one full analysis of a startup idea, including market data fetching and competitor analysis.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">What is lifetime access?</h3>
                            <p className="text-gray-400 text-sm">Pay once, use forever. You'll get all future updates to the dashboard and analysis models without ever paying a subscription.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">Is my data secure?</h3>
                            <p className="text-gray-400 text-sm">We take IP seriously. Your ideas are stored securely and never used to train public models or shared with third parties.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">Can I get a refund?</h3>
                            <p className="text-gray-400 text-sm">Since we provide instant access to AI analysis credits, we generally don't offer refunds once credits are used. If you have issues, contact support.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
