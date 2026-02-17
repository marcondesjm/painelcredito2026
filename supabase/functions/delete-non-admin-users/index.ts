import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Accept admin user auth OR apikey header with service role
    const authHeader = req.headers.get("Authorization");
    const apiKey = req.headers.get("apikey");
    
    let isAuthorized = false;
    
    // Check if called with service role via apikey
    if (apiKey === serviceRoleKey) {
      isAuthorized = true;
    } else if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (user) {
        const adminClient2 = createClient(supabaseUrl, serviceRoleKey);
        const { data: isAdmin } = await adminClient2.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });
        isAuthorized = !!isAdmin;
      }
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const PROTECTED_ADMIN_ID = "1633e23a-6a48-42b7-92cf-21cd3ec33ca4";

    // Get all non-admin user IDs
    const { data: profiles } = await adminClient
      .from("profiles")
      .select("user_id")
      .neq("user_id", PROTECTED_ADMIN_ID);

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: "No users to delete", deleted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userIds = profiles.map((p: any) => p.user_id);
    let deleted = 0;
    const errors: string[] = [];

    for (const uid of userIds) {
      // Delete related data first
      await adminClient.from("balance_transactions").delete().eq("user_id", uid);
      await adminClient.from("user_balances").delete().eq("user_id", uid);
      await adminClient.from("daily_renewals").delete().eq("user_id", uid);
      await adminClient.from("customers").delete().eq("created_by", uid);
      await adminClient.from("orders").delete().eq("user_id", uid);
      await adminClient.from("landing_pages").delete().eq("user_id", uid);
      await adminClient.from("user_roles").delete().eq("user_id", uid);
      await adminClient.from("profiles").delete().eq("user_id", uid);

      // Delete from auth
      const { error } = await adminClient.auth.admin.deleteUser(uid);
      if (error) {
        errors.push(`${uid}: ${error.message}`);
      } else {
        deleted++;
      }
    }

    return new Response(
      JSON.stringify({ message: `Deleted ${deleted} users`, deleted, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
