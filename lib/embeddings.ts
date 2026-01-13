
const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5';

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!process.env.HUGGINGFACE_API_KEY) {
        throw new Error('HUGGINGFACE_API_KEY is not defined in environment variables');
    }

    // Wait for a random delay to avoid rate limiting
    const delay = Math.floor(Math.random() * 1000);
    await new Promise(resolve => setTimeout(resolve, delay));

    const response = await fetch(HF_API_URL, {
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
        let errorMsg = response.statusText;
        try {
            const error = await response.json();
            errorMsg = error.error || JSON.stringify(error);
        } catch {
            // response was not JSON, likely plain text error like "Not Found" or "Service Unavailable"
            errorMsg = await response.text();
        }
        throw new Error(`Embedding failed (${response.status}): ${errorMsg}`);
    }

    const embedding = await response.json();
    return Array.isArray(embedding) ? embedding : embedding[0];
}
