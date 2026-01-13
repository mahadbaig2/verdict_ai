import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateVerdict } from '@/lib/groq';
import { runRAGPipeline } from '@/lib/rag';

export async function POST(request: NextRequest) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract JWT token
        const token = authHeader.replace('Bearer ', '');

        // Verify user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const {
            idea_summary,
            target_customer,
            geography,
            pricing,
            founder_background,
        } = body;

        // Validate required fields
        if (!idea_summary || !target_customer || !geography || !pricing || !founder_background) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check user credits
        // database.types.ts compatibility issue causes 'never' inference
        const supabase = supabaseAdmin as any;

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credits, plan')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userData.credits <= 0) {
            return NextResponse.json(
                { error: 'Insufficient credits', credits: 0 },
                { status: 402 }
            );
        }

        // Step 1: Collect market data and run RAG pipeline
        console.log('Running RAG pipeline...');
        const marketContext = await runRAGPipeline(idea_summary, target_customer);

        // Step 2: Generate verdict using Groq API
        console.log('Generating verdict...');
        const verdictResponse = await generateVerdict(
            idea_summary,
            target_customer,
            geography,
            pricing,
            founder_background,
            marketContext
        );

        // Step 3: Save idea to database
        const { data: ideaData, error: ideaError } = await supabase
            .from('ideas')
            .insert({
                user_id: user.id,
                idea_summary,
                target_customer,
                geography,
                pricing,
                founder_background,
            })
            .select()
            .single();

        if (ideaError || !ideaData) {
            console.error('Error saving idea:', ideaError);
            return NextResponse.json(
                { error: 'Failed to save idea' },
                { status: 500 }
            );
        }

        // Step 4: Save verdict to database
        // We are strictly mapping the new ReadinessReport structure to the existing schema
        // to avoid database migrations.
        const { data: verdictData, error: verdictError } = await supabase
            .from('verdicts')
            .insert({
                idea_id: ideaData.id,
                verdict: verdictResponse.verdict.status.toLowerCase(), // 'go' | 'pivot' | 'kill'
                // Storing the entire comprehensive report in the 'reasoning' JSONB column
                // This gives the frontend access to everything.
                reasoning: verdictResponse as any,
                // Mapping specific fields to existing columns for easier querying if needed
                risks: verdictResponse.risks?.[0]?.description || "See detailed risk report",
                conditions: verdictResponse.verdict.rationale, // Hijacking 'conditions' for the one-liner
                next_steps: verdictResponse.action_plan.week_1,
                // Constructing a compatible confidence score object
                confidence_scores: {
                    market_demand: verdictResponse.market_snapshot.demand_visibility,
                    competitive_moat: verdictResponse.founder_fit.score, // approximate mapping
                    execution_feasibility: verdictResponse.verdict.score,
                    overall: verdictResponse.verdict.score
                },
            })
            .select()
            .single();

        if (verdictError || !verdictData) {
            console.error('Error saving verdict:', verdictError);
            return NextResponse.json(
                { error: 'Failed to save verdict' },
                { status: 500 }
            );
        }

        // Step 5: Decrement user credits
        const { error: creditError } = await supabase
            .from('users')
            .update({ credits: userData.credits - 1 })
            .eq('id', user.id);

        if (creditError) {
            console.error('Error updating credits:', creditError);
            // Don't fail the request if credit update fails
        }

        // Return success response
        return NextResponse.json({
            success: true,
            idea_id: ideaData.id,
            verdict_id: verdictData.id,
            verdict: verdictResponse,
            credits_remaining: userData.credits - 1,
        });
    } catch (error) {
        console.error('Error in analyze endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
