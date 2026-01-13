"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound, useParams } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import ReadinessReportView from '@/components/ReadinessReport';
import { DashboardReport } from '@/lib/groq';

export default function VerdictPage() {
    const params = useParams();
    const [data, setData] = useState<{ report: DashboardReport; summary: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVerdict() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch idea and verdict joined
                const { data: idea, error: ideaError } = await supabase
                    .from('ideas')
                    .select(`
            idea_summary,
            verdicts (
              verdict,
              reasoning,
              risks,
              conditions,
              next_steps,
              confidence_scores
            )
          `)
                    .eq('id', params.id as string)
                    .eq('user_id', user.id)
                    .single();

                if (ideaError || !idea) {
                    setError('Verdict not found');
                    return;
                }

                const verdictData = idea.verdicts?.[0] as any;
                if (!verdictData) {
                    setError('Verdict not found');
                    return;
                }

                // Check if this is a new "Dashboard Report" style verdict
                let report: DashboardReport;

                // Use type guard or check structure to determine if it's the new format
                const reasoningData = verdictData.reasoning as any;

                if (reasoningData.market_snapshot && reasoningData.competitors) {
                    // It's the new Dashboard format!
                    report = reasoningData as DashboardReport;
                } else {
                    // Fallback for legacy verdicts - map to new Dashboard structure
                    report = {
                        verdict: {
                            status: (verdictData.verdict as string).toUpperCase() as 'GO' | 'PIVOT' | 'KILL',
                            rationale: verdictData.conditions || "Legacy rationale not available.",
                            score: verdictData.confidence_scores?.overall || 50
                        },
                        market_snapshot: {
                            pain_intensity: verdictData.confidence_scores?.market_demand || 50,
                            demand_visibility: 50,
                            signal_quality: 'Low',
                            top_signals: [{ source: 'Other', text: "Legacy report - signals not captured.", sentiment: 'complaint' }]
                        },
                        competitors: {
                            direct: [],
                            indirect_substitutes: []
                        },
                        differentiation: {
                            reality_check: "Legacy report - run analysis again for differentiation check.",
                            claims: []
                        },
                        distribution: {
                            collaborators: []
                        },
                        founder_fit: {
                            score: verdictData.confidence_scores?.execution_feasibility || 50,
                            strengths_leveraged: [],
                            critical_gaps: []
                        },
                        risks: [{
                            risk_name: "Primary Risk (Legacy)",
                            impact: 'High',
                            probability: 'High',
                            description: verdictData.risks || "No risk data available."
                        }],
                        action_plan: {
                            week_1: verdictData.next_steps as string[] || [],
                            week_2: [],
                            week_3: [],
                            week_4: [],
                            success_criteria: [],
                            anti_goals: []
                        }
                    };
                }

                setData({ report, summary: idea.idea_summary });
            } catch (err) {
                console.error(err);
                setError('Failed to load verdict');
            } finally {
                setLoading(false);
            }
        }

        fetchVerdict();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-center max-w-md">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
                    <p className="text-gray-400 mb-6">Could not find the analysis for this idea.</p>
                    <a href="/dashboard" className="px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium text-sm">
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 py-8">
            <div className="mb-6 max-w-6xl mx-auto px-4">
                <a href="/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    ← Back to Portfolio
                </a>
            </div>

            <ReadinessReportView report={data.report} ideaSummary={data.summary} />
        </div>
    );
}
