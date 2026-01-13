/**
 * Reddit API Integration for Market Intelligence
 * 
 * Uses Reddit's official JSON API (no auth required for public data)
 * Rate limit: ~60 requests per minute
 */

export interface RedditPost {
    title: string;
    selftext: string;
    author: string;
    score: number;
    num_comments: number;
    created_utc: number;
    url: string;
    subreddit: string;
}

export interface RedditComment {
    body: string;
    author: string;
    score: number;
    created_utc: number;
}

const RELEVANT_SUBREDDITS = [
    'startups',
    'Entrepreneur',
    'SaaS',
    'smallbusiness',
    'business',
    'marketing',
    'webdev',
    'cscareerquestions',
];

/**
 * Search Reddit for posts and comments related to an idea
 */
export async function searchReddit(
    query: string,
    limit: number = 25
): Promise<{ posts: RedditPost[]; insights: string[] }> {
    const insights: string[] = [];
    const allPosts: RedditPost[] = [];

    try {
        // Search across multiple relevant subreddits
        for (const subreddit of RELEVANT_SUBREDDITS.slice(0, 3)) { // Limit to 3 subreddits to avoid rate limits
            const posts = await fetchSubredditPosts(subreddit, query, 10);
            allPosts.push(...posts);

            // Extract insights from posts
            posts.forEach(post => {
                if (post.selftext && post.selftext.length > 50) {
                    insights.push(`[r/${subreddit}] ${post.title}: ${post.selftext.slice(0, 200)}...`);
                }
            });
        }

        return { posts: allPosts, insights };
    } catch (error) {
        console.error('Reddit API error:', error);
        return { posts: [], insights: [] };
    }
}

/**
 * Fetch posts from a specific subreddit with search query
 */
async function fetchSubredditPosts(
    subreddit: string,
    query: string,
    limit: number
): Promise<RedditPost[]> {
    const searchQuery = encodeURIComponent(query);
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${searchQuery}&restrict_sr=1&limit=${limit}&sort=relevance`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'VerdictAI/1.0 (Startup validation tool)',
            },
        });

        if (!response.ok) {
            console.warn(`Reddit API returned ${response.status} for r/${subreddit}`);
            return [];
        }

        const data = await response.json();
        const posts: RedditPost[] = data.data?.children?.map((child: any) => ({
            title: child.data.title,
            selftext: child.data.selftext,
            author: child.data.author,
            score: child.data.score,
            num_comments: child.data.num_comments,
            created_utc: child.data.created_utc,
            url: `https://reddit.com${child.data.permalink}`,
            subreddit: child.data.subreddit,
        })) || [];

        return posts;
    } catch (error) {
        console.error(`Error fetching from r/${subreddit}:`, error);
        return [];
    }
}

/**
 * Get top complaints and pain points from relevant subreddits
 */
export async function getStartupPainPoints(
    targetCustomer: string,
    industry?: string
): Promise<string[]> {
    const painPoints: string[] = [];

    try {
        // Search for common pain point keywords
        const keywords = [
            `${targetCustomer} problems`,
            `${targetCustomer} challenges`,
            `${targetCustomer} frustrated`,
            `${targetCustomer} need`,
        ];

        for (const keyword of keywords.slice(0, 2)) { // Limit to 2 searches
            const { insights } = await searchReddit(keyword, 5);
            painPoints.push(...insights);
        }

        return painPoints;
    } catch (error) {
        console.error('Error fetching pain points:', error);
        return [];
    }
}

/**
 * Analyze competitor mentions on Reddit
 */
export async function analyzeCompetitorMentions(
    productCategory: string
): Promise<string[]> {
    const mentions: string[] = [];

    try {
        const { posts } = await searchReddit(`${productCategory} tool`, 15);

        posts.forEach(post => {
            if (post.selftext.length > 100) {
                mentions.push(`${post.title}: ${post.selftext.slice(0, 300)}`);
            }
        });

        return mentions;
    } catch (error) {
        console.error('Error analyzing competitors:', error);
        return [];
    }
}

/**
 * Rate limit helper - add delay between requests
 */
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
