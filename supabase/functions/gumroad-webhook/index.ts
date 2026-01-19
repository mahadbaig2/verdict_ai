import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

serve(async (req) => {
    // Log EVERY hit immediately
    console.log("--- Webhook Hit ---");
    console.log("Method:", req.method);
    console.log("Content-Type:", req.headers.get("content-type"));

    try {
        const contentType = req.headers.get("content-type") || "";
        let body: any = {};

        if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            body = Object.fromEntries(formData.entries());
        } else if (contentType.includes("application/json")) {
            body = await req.json();
        } else {
            console.log("Unknown content type, trying as text");
            const text = await req.text();
            console.log("Raw body:", text);
            // Try to parse as form data anyway
            try {
                const params = new URLSearchParams(text);
                body = Object.fromEntries(params.entries());
            } catch (e) {
                console.log("Failed to parse fallback body");
            }
        }

        console.log("Parsed Body:", JSON.stringify(body, null, 2));

        const event = body.event || "sale";
        const email = body.email || body.purchaser_email;
        const saleId = body.sale_id;
        const productId = body.product_id;
        const productName = body.product_name;
        const price = body.price;
        const refunded = body.refunded === "true" || body.refunded === true;

        if (!email) {
            console.error("Missing email in payload");
            return new Response("Missing email", { status: 400 });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        if (event === "sale" || (!body.event && !refunded)) {
            console.log(`Processing sale for ${email}`);

            // 1. Log the purchase
            const { error: pError } = await supabase.from("purchases").upsert({
                gumroad_sale_id: saleId || `gen_${Date.now()}`,
                email,
                product_id: productId,
                product_name: productName,
                price: Number(price) || 0,
                refunded: false,
            }, { onConflict: "gumroad_sale_id" });

            if (pError) console.error("Purchases Table Error:", pError);

            // 2. Grant the entitlement (Universal Key)
            const { error: eError } = await supabase.from("entitlements").upsert({
                email,
                access: true,
            });

            if (eError) console.error("Entitlements Table Error:", eError);

            // 3. Create the actual Auth Account so they can Log In immediately
            console.log(`Creating Auth account for ${email}...`);
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: "VerdictAI2026",
                email_confirm: true,
            });

            if (authError) {
                if (authError.message.includes("already registered")) {
                    console.log("User already has an Auth account. Fetching ID...");

                    // 1. Get the existing user's ID from Auth
                    const { data: searchData, error: searchError } = await supabase.auth.admin.listUsers();
                    const existingUser = searchData?.users?.find(u => u.email === email);

                    if (existingUser) {
                        console.log(`Found existing Auth user: ${existingUser.id}. Upserting profile...`);
                        await supabase.from('users').upsert({
                            id: existingUser.id,
                            email: email,
                            plan: 'pro',
                            credits: 100
                        });
                    } else {
                        console.error("Could not find Auth user after 'already registered' error");
                    }
                } else {
                    console.error("Auth Creation Error:", authError.message);
                }
            } else if (authUser.user) {
                console.log(`New Auth account created: ${authUser.user.id}. Upserting profile...`);
                await supabase.from('users').upsert({
                    id: authUser.user.id,
                    email: email,
                    plan: 'pro',
                    credits: 100
                });
            }

            console.log(`Entitlement and Auth processed successfully for ${email}`);
        }

        if (event === "refund" || refunded) {
            console.log(`Processing refund for ${email}`);
            await supabase.from("purchases").update({ refunded: true }).eq("gumroad_sale_id", saleId);
            await supabase.from("entitlements").update({ access: false }).eq("email", email);
            console.log(`Entitlement revoked for ${email}`);
        }

        return new Response("ok", { status: 200 });
    } catch (error: any) {
        console.error("CRITICAL WEBHOOK ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
