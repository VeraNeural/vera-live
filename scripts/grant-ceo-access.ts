// Direct script to grant CEO Sanctuary access
import { clerkClient } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

async function grantCEOAccess() {
  const email = 'krajceva@gmail.com';
  
  try {
    console.log('Finding user in Clerk...');
    
    const client = await clerkClient();

    // Find user by email in Clerk
    const users = await client.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });

    if (users.totalCount === 0) {
      console.error('User not found in Clerk');
      return;
    }

    const user = users.data[0];
    const clerkUserId = user.id;
    
    console.log(`Found user: ${email} (Clerk ID: ${clerkUserId})`);

    // Grant permanent Sanctuary entitlement
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    
    // Set far future expiration date (10 years from now) for permanent access
    const permanentEnd = new Date();
    permanentEnd.setFullYear(permanentEnd.getFullYear() + 10);
    
    console.log('Granting Sanctuary access...');
    
    const { data, error } = await supabase
      .from('user_entitlements')
      .upsert(
        {
          clerk_user_id: clerkUserId,
          entitlement: 'sanctuary',
          status: 'active',
          current_period_start: now,
          current_period_end: permanentEnd.toISOString(),
          updated_at: now,
        },
        {
          onConflict: 'clerk_user_id,entitlement',
        }
      )
      .select();

    if (error) {
      console.error('Failed to grant Sanctuary access:', error.message);
      return;
    }

    console.log('✅ SUCCESS: Sanctuary access granted to CEO');
    console.log('Details:');
    console.log(`  Email: ${email}`);
    console.log(`  Clerk User ID: ${clerkUserId}`);
    console.log(`  Entitlement: sanctuary`);
    console.log(`  Status: active`);
    console.log(`  Expires: ${permanentEnd.toISOString()} (10 years from now)`);
    console.log(`  Storage: user_entitlements table in Supabase`);
    console.log('  Access includes: Unlimited messages, Voice, Images, Memory, Sanctuary rooms');
    
    // Verify the entitlement was created
    const { data: verification } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .eq('entitlement', 'sanctuary')
      .single();
      
    console.log('\n✅ VERIFICATION: Entitlement confirmed in database:', verification);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

grantCEOAccess();