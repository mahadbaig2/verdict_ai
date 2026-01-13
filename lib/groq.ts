import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

// generateEmbedding moved to lib/embeddings.ts

export interface DashboardReport {
    // 1. Executive Verdict Panel
    verdict: {
        status: 'GO' | 'PIVOT' | 'KILL';
        rationale: string; // One sentence rationale
        score: number; // 0-100 overall readiness
    };

    // 2. Market Signal Snapshot
    market_snapshot: {
        pain_intensity: number; // 0-100
        demand_visibility: number; // 0-100
        signal_quality: 'High' | 'Medium' | 'Low'; // Noise vs Signal
        top_signals: Array<{
            source: 'Reddit' | 'HackerNews' | 'Other';
            text: string;
            sentiment: 'complaint' | 'desire' | 'competitor_mention';
            url?: string;
        }>;
    };

    // 3. Competitor Landscape (Split)
    competitors: {
        direct: Array<{
            name: string;
            one_liner: string;
            target_audience: string;
            pricing?: string;
            url?: string;
        }>;
        indirect_substitutes: Array<{
            method: string; // e.g., "Excel Spreadsheet"
            why_good_enough: string;
            switching_friction: 'Low' | 'Medium' | 'High';
        }>;
    };

    // 4. Differentiation Reality Check
    differentiation: {
        reality_check: string; // "Your AI is just a wrapper"
        claims: Array<{
            feature: string;
            is_real_moat: boolean;
            verdict: string; // "Cosmetic only"
        }>;
    };

    // 5. Distribution Levers (NEW)
    distribution: {
        collaborators: Array<{
            name: string;
            type: 'Influencer' | 'Platform' | 'Community' | 'Marketplace';
            leverage_reason: string;
            url?: string;
        }>;
    };

    // 6. Founder-Fit Panel
    founder_fit: {
        score: number;
        strengths_leveraged: string[];
        critical_gaps: string[];
    };

    // 7. Execution Risk Map
    risks: Array<{
        risk_name: string;
        impact: 'Low' | 'Medium' | 'High';
        probability: 'Low' | 'Medium' | 'High';
        description: string;
    }>;

    // 8. 30-Day Action Plan
    action_plan: {
        week_1: string[];
        week_2: string[];
        week_3: string[];
        week_4: string[];
        success_criteria: string[];
        anti_goals: string[]; // What NOT to do
    };
}

export async function generateVerdict(
    ideaSummary: string,
    targetCustomer: string,
    geography: string,
    pricing: string,
    founderBackground: string,
    marketContext: string[]
): Promise<DashboardReport> {
    const prompt = buildVerdictPrompt(
        ideaSummary,
        targetCustomer,
        geography,
        pricing,
        founderBackground,
        marketContext
    );

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'moonshotai/kimi-k2-instruct-0905',
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
        throw new Error('No response from Groq API');
    }

    return JSON.parse(response) as DashboardReport;
}

const SYSTEM_PROMPT = `You are a Lead Venture Partner at a top-tier VC firm generating a Startup Readiness Dashboard. analyze the idea specifically for: 1. Direct vs Indirect competition (e.g. Excel). 2. Distribution channels (who to partner with). 3. Execution risks.

CRITICAL INSTRUCTIONS:
- **Verdict**: Decisive GO/PIVOT/KILL.
- **Competition**: Distinguish between "Another SaaS info tool" (Direct) and "Manual Spreadsheet" (Indirect).
- **Differentiation**: Be skeptical. Most "AI" features are cosmetic.
- **Distribution**: Name specific types of partners (e.g. "Fintech Newsletters", "HubSpot Marketplace").
- **Action Plan**: Detailed weekly steps.

Output the strict JSON schema for DashboardReport:
{
  "verdict": {
    "status": "GO" | "PIVOT" | "KILL",
    "rationale": "One sentence rational",
    "score": 0-100
  },
  "market_snapshot": {
    "pain_intensity": 0-100,
    "demand_visibility": 0-100,
    "signal_quality": "High" | "Medium" | "Low",
    "top_signals": [
      { "source": "Reddit", "text": "...", "sentiment": "complaint" }
    ]
  },
  "competitors": {
    "direct": [{ "name": "...", "one_liner": "...", "target_audience": "..." }],
    "indirect_substitutes": [{ "method": "Excel", "why_good_enough": "...", "switching_friction": "High" }]
  },
  "differentiation": {
    "reality_check": "...",
    "claims": [{ "feature": "...", "is_real_moat": boolean, "verdict": "..." }]
  },
  "distribution": {
    "collaborators": [{ "name": "...", "type": "Influencer", "leverage_reason": "..." }]
  },
  "founder_fit": {
    "score": 0-100,
    "strengths_leveraged": ["..."],
    "critical_gaps": ["..."]
  },
  "risks": [{ "risk_name": "...", "impact": "High", "probability": "High", "description": "..." }],
  "action_plan": {
    "week_1": ["..."],
    "week_2": ["..."],
    "week_3": ["..."],
    "week_4": ["..."],
    "success_criteria": ["..."],
    "anti_goals": ["..."]
  }
}`;

function buildVerdictPrompt(
    ideaSummary: string,
    targetCustomer: string,
    geography: string,
    pricing: string,
    founderBackground: string,
    marketContext: string[]
): string {
    return `Generate a Startup Readiness Report for this deal.

DEAL MEMO INPUTS:
----------------
Idea: ${ideaSummary}
Target Customer: ${targetCustomer}
Geography: ${geography}
Pricing Model: ${pricing}
Founder Background: ${founderBackground}

MARKET INTELLIGENCE REPORTS (Reddit/HN):
---------------------------------------
${marketContext.map((ctx, i) => `${i + 1}. ${ctx}`).join('\n')}

Based on the above, write the Deal Memo JSON.`;
}
