export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    first_name: string | null
                    last_name: string | null
                    plan: 'free' | 'pro'
                    credits: number
                    paddle_customer_id: string | null
                    paddle_transaction_id: string | null
                    lemon_squeezy_customer_id: string | null
                    lemon_squeezy_order_id: string | null
                    has_lifetime_access: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name?: string | null
                    last_name?: string | null
                    plan?: 'free' | 'pro'
                    credits?: number
                    paddle_customer_id?: string | null
                    paddle_transaction_id?: string | null
                    lemon_squeezy_customer_id?: string | null
                    lemon_squeezy_order_id?: string | null
                    has_lifetime_access?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string | null
                    last_name?: string | null
                    plan?: 'free' | 'pro'
                    credits?: number
                    paddle_customer_id?: string | null
                    paddle_transaction_id?: string | null
                    lemon_squeezy_customer_id?: string | null
                    lemon_squeezy_order_id?: string | null
                    has_lifetime_access?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            ideas: {
                Row: {
                    id: string
                    user_id: string
                    idea_summary: string
                    target_customer: string
                    geography: string
                    pricing: string
                    founder_background: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    idea_summary: string
                    target_customer: string
                    geography: string
                    pricing: string
                    founder_background: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    idea_summary?: string
                    target_customer?: string
                    geography?: string
                    pricing?: string
                    founder_background?: string
                    created_at?: string
                }
                Relationships: []
            }
            verdicts: {
                Row: {
                    id: string
                    idea_id: string
                    verdict: 'go' | 'pivot' | 'kill'
                    reasoning: Json
                    risks: string
                    conditions: string
                    next_steps: Json
                    confidence_scores: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    idea_id: string
                    verdict: 'go' | 'pivot' | 'kill'
                    reasoning: Json
                    risks: string
                    conditions: string
                    next_steps: Json
                    confidence_scores: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    idea_id?: string
                    verdict?: 'go' | 'pivot' | 'kill'
                    reasoning?: Json
                    risks?: string
                    conditions?: string
                    next_steps?: Json
                    confidence_scores?: Json
                    created_at?: string
                }
                Relationships: []
            }
            market_documents: {
                Row: {
                    id: string
                    source: 'reddit' | 'competitor' | 'pricing'
                    content: string
                    embedding: number[] | null
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    source: 'reddit' | 'competitor' | 'pricing'
                    content: string
                    embedding?: number[] | null
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    source?: 'reddit' | 'competitor' | 'pricing'
                    content?: string
                    embedding?: number[] | null
                    metadata?: Json | null
                    created_at?: string
                }
                Relationships: []
            }
            waitlist: {
                Row: {
                    id: number
                    email: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    email: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    email?: string
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            match_market_documents: {
                Args: {
                    query_embedding: number[]
                    match_threshold?: number
                    match_count?: number
                }
                Returns: Array<{
                    id: string
                    source: 'reddit' | 'competitor' | 'pricing'
                    content: string
                    similarity: number
                }>
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
