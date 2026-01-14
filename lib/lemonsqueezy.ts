import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Configure Lemon Squeezy SDK
 */
export function setupLemonSqueezy() {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
        console.error('Missing LEMON_SQUEEZY_API_KEY');
        return;
    }

    lemonSqueezySetup({
        apiKey,
        onError: (error) => {
            console.error('Lemon Squeezy Error:', error);
        },
    });
}

/**
 * Verify Lemon Squeezy webhook signature
 */
export async function verifyLemonSqueezyWebhook(
    rawBody: string,
    signature: string | null
): Promise<boolean> {
    if (!signature || !process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
        return false;
    }

    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(rawBody).digest('hex');

    return signature === digest;
}
