import { supabaseAdmin } from './supabase';
import { generateEmbedding } from './embeddings';

export interface MarketSignal {
    source: 'reddit' | 'competitor' | 'pricing';
    content: string;
    metadata?: Record<string, any>;
}

/**
 * Step 1: Collect market signals from various sources
 */
export async function collectMarketSignals(
    ideaSummary: string,
    targetCustomer: string
): Promise<MarketSignal[]> {
    const signals: MarketSignal[] = [];

    // Collect Reddit signals (complaints, questions, discussions)
    const redditSignals = await fetchRedditSignals(ideaSummary, targetCustomer);
    signals.push(...redditSignals);

    // Collect competitor information
    const competitorSignals = await fetchCompetitorSignals(ideaSummary);
    signals.push(...competitorSignals);

    // Collect pricing data
    const pricingSignals = await fetchPricingSignals(ideaSummary);
    signals.push(...pricingSignals);

    return signals;
}

/**
 * Step 2: Store market signals with embeddings
 */
export async function storeMarketSignals(signals: MarketSignal[]): Promise<void> {
    for (const signal of signals) {
        try {
            const embedding = await generateEmbedding(signal.content);

            await supabaseAdmin.from('market_documents').insert({
                source: signal.source,
                content: signal.content,
                embedding: embedding,
                metadata: signal.metadata || {},
            });
        } catch (error) {
            console.error('Error storing market signal:', error);
            // Continue with other signals even if one fails
        }
    }
}

/**
 * Step 3: Retrieve relevant market documents using vector similarity search
 */
export async function retrieveRelevantContext(
    ideaSummary: string,
    topK: number = 10
): Promise<string[]> {
    try {
        // Generate embedding for the idea summary
        const queryEmbedding = await generateEmbedding(ideaSummary);

        // Perform vector similarity search
        const { data, error } = await supabaseAdmin.rpc('match_market_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.7,
            match_count: topK,
        });

        if (error) {
            console.error('Error retrieving context:', error);
            return [];
        }

        return data?.map((doc: any) => doc.content) || [];
    } catch (error) {
        console.error('Error in retrieveRelevantContext:', error);
        return [];
    }
}

/**
 * Fetch Reddit signals - REAL API INTEGRATION
 * Uses Reddit's official JSON API
 */
async function fetchRedditSignals(
    ideaSummary: string,
    targetCustomer: string
): Promise<MarketSignal[]> {
    const signals: MarketSignal[] = [];

    try {
        // Import Reddit service
        const { searchReddit, getStartupPainPoints } = await import('./reddit');

        // Search for relevant discussions about the idea
        const { insights: ideaInsights } = await searchReddit(ideaSummary, 15);

        ideaInsights.forEach(insight => {
            signals.push({
                source: 'reddit' as const,
                content: insight,
                metadata: { type: 'idea_discussion', query: ideaSummary },
            });
        });

        // Get pain points for target customer
        const painPoints = await getStartupPainPoints(targetCustomer);

        painPoints.forEach(painPoint => {
            signals.push({
                source: 'reddit' as const,
                content: painPoint,
                metadata: { type: 'pain_point', customer: targetCustomer },
            });
        });

        console.log(`✓ Fetched ${signals.length} real Reddit signals`);
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        // Fallback to empty array if API fails
    }

    return signals;
}

/**
 * Fetch competitor/market signals - REAL HACKER NEWS API
 * Uses official HN API + Algolia search
 */
async function fetchCompetitorSignals(ideaSummary: string): Promise<MarketSignal[]> {
    const signals: MarketSignal[] = [];

    try {
        // Import Hacker News service
        const { searchHackerNews, analyzeMarketTrends } = await import('./hackernews');

        // Search for relevant HN discussions
        const { insights: hnInsights } = await searchHackerNews(ideaSummary, 'story', 10);

        hnInsights.forEach(insight => {
            signals.push({
                source: 'competitor' as const, // Using competitor as market intelligence
                content: `[Hacker News] ${insight}`,
                metadata: { platform: 'hackernews', query: ideaSummary },
            });
        });

        // Extract industry keywords for trend analysis
        const industryMatch = ideaSummary.match(/\b(SaaS|AI|crypto|fintech|edtech|healthtech|e-commerce|analytics|automation)\b/i);
        if (industryMatch) {
            const trends = await analyzeMarketTrends(industryMatch[0]);
            trends.slice(0, 5).forEach(trend => {
                signals.push({
                    source: 'competitor' as const,
                    content: `[HN Market Trend] ${trend}`,
                    metadata: { platform: 'hackernews', type: 'market_trend' },
                });
            });
        }

        console.log(`✓ Fetched ${signals.length} real Hacker News signals`);
    } catch (error) {
        console.error('Error fetching Hacker News data:', error);
    }

    return signals;
}

/**
 * Fetch pricing signals - simulated for MVP
 * In production, scrape pricing pages or use pricing intelligence APIs
 */
async function fetchPricingSignals(ideaSummary: string): Promise<MarketSignal[]> {
    const mockPricingData = [
        {
            source: 'pricing' as const,
            content: `Market research tools in this space typically charge $99-$499 per report. SaaS models range from $29/mo (basic) to $299/mo (enterprise).`,
            metadata: { category: 'market_research' },
        },
    ];

    return mockPricingData;
}

/**
 * Complete RAG pipeline: collect, store, and retrieve
 */
export async function runRAGPipeline(
    ideaSummary: string,
    targetCustomer: string
): Promise<string[]> {
    // Step 1: Collect market signals
    const signals = await collectMarketSignals(ideaSummary, targetCustomer);

    // Step 2: Store signals with embeddings
    await storeMarketSignals(signals);

    // Step 3: Retrieve relevant context
    const relevantContext = await retrieveRelevantContext(ideaSummary, 10);

    return relevantContext;
}
