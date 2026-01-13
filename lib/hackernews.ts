/**
 * Hacker News API Integration for Market Intelligence
 * 
 * Uses the official Firebase-based HN API
 * No authentication required, generous rate limits
 * Docs: https://github.com/HackerNews/API
 */

export interface HNItem {
    id: number;
    type: 'story' | 'comment' | 'ask' | 'show';
    by: string;
    time: number;
    text?: string;
    title?: string;
    url?: string;
    score?: number;
    descendants?: number; // number of comments
}

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const ALGOLIA_SEARCH_BASE = 'https://hn.algolia.com/api/v1';

/**
 * Search Hacker News for relevant discussions
 * Uses Algolia HN Search API for better search
 */
export async function searchHackerNews(
    query: string,
    tags: string = 'story',
    numResults: number = 20
): Promise<{ items: HNItem[]; insights: string[] }> {
    try {
        const searchQuery = encodeURIComponent(query);
        const url = `${ALGOLIA_SEARCH_BASE}/search?query=${searchQuery}&tags=${tags}&hitsPerPage=${numResults}`;

        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`HN Search API returned ${response.status}`);
            return { items: [], insights: [] };
        }

        const data = await response.json();
        const items: HNItem[] = data.hits.map((hit: any) => ({
            id: hit.objectID,
            type: hit._tags?.includes('story') ? 'story' : 'comment',
            by: hit.author,
            time: hit.created_at_i,
            text: hit.comment_text || hit.story_text,
            title: hit.title || hit.story_title,
            url: hit.url,
            score: hit.points,
            descendants: hit.num_comments,
        }));

        // Extract insights from HN posts
        const insights: string[] = items
            .filter(item => item.text && item.text.length > 50)
            .map(item => {
                const prefix = item.title ? `[${item.title}]` : '[HN Comment]';
                return `${prefix} ${item.text?.slice(0, 250)}...`;
            });

        return { items, insights };
    } catch (error) {
        console.error('Hacker News API error:', error);
        return { items: [], insights: [] };
    }
}

/**
 * Get recent Ask HN posts about startup validation
 */
export async function getAskHNStartupQuestions(): Promise<string[]> {
    try {
        const { insights } = await searchHackerNews('startup idea validation', 'ask_hn', 15);
        return insights;
    } catch (error) {
        console.error('Error fetching Ask HN:', error);
        return [];
    }
}

/**
 * Search for Show HN posts in a category
 */
export async function getShowHNProjects(category: string): Promise<string[]> {
    try {
        const { insights } = await searchHackerNews(category, 'show_hn', 10);
        return insights;
    } catch (error) {
        console.error('Error fetching Show HN:', error);
        return [];
    }
}

/**
 * Get comments from a specific HN item
 */
export async function getItemComments(itemId: number): Promise<string[]> {
    try {
        const response = await fetch(`${HN_API_BASE}/item/${itemId}.json`);

        if (!response.ok) {
            return [];
        }

        const item = await response.json();
        const comments: string[] = [];

        // Recursively fetch comment text
        if (item.kids && item.kids.length > 0) {
            // Only fetch first 5 comments to avoid too many requests
            for (const kidId of item.kids.slice(0, 5)) {
                const commentResponse = await fetch(`${HN_API_BASE}/item/${kidId}.json`);
                if (commentResponse.ok) {
                    const comment = await commentResponse.json();
                    if (comment.text) {
                        comments.push(comment.text);
                    }
                }
                // Small delay to respect rate limits
                await delay(100);
            }
        }

        return comments;
    } catch (error) {
        console.error('Error fetching HN comments:', error);
        return [];
    }
}

/**
 * Analyze market trends from HN discussions
 */
export async function analyzeMarketTrends(industry: string): Promise<string[]> {
    try {
        const queries = [
            `${industry} market`,
            `${industry} startup`,
            `building ${industry} product`,
        ];

        const allInsights: string[] = [];

        for (const query of queries) {
            const { insights } = await searchHackerNews(query, 'story', 8);
            allInsights.push(...insights);
            await delay(200); // Respect rate limits
        }

        return allInsights;
    } catch (error) {
        console.error('Error analyzing market trends:', error);
        return [];
    }
}

/**
 * Get technical feasibility insights from HN
 */
export async function getTechnicalFeasibility(techStack: string): Promise<string[]> {
    try {
        const { insights } = await searchHackerNews(`${techStack} experience`, 'comment', 15);
        return insights;
    } catch (error) {
        console.error('Error fetching technical insights:', error);
        return [];
    }
}

/**
 * Rate limit helper
 */
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
