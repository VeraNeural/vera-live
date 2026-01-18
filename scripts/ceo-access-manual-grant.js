/**
 * CEO Sanctuary Access - Manual Grant Instructions
 * 
 * Since the automated approach has environment issues, here's the manual process
 * to grant permanent Sanctuary access to krajceva@gmail.com:
 * 
 * STEP 1: Find the Clerk User ID
 * ================================
 * 1. Go to the Clerk Dashboard (https://dashboard.clerk.com)
 * 2. Navigate to Users section
 * 3. Search for "krajceva@gmail.com"
 * 4. Copy the User ID (starts with "user_")
 * 
 * STEP 2: Grant Access via Supabase
 * ==================================
 * 1. Go to Supabase Dashboard
 * 2. Navigate to SQL Editor
 * 3. Run this SQL query (replace YOUR_CLERK_USER_ID with actual ID):
 */

const clerkUserId = 'YOUR_CLERK_USER_ID_HERE'; // Replace with actual ID from Clerk

const sqlQuery = `
-- Grant CEO Sanctuary Access
INSERT INTO user_entitlements (
  clerk_user_id,
  entitlement,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  '${clerkUserId}',
  'sanctuary',
  'active',
  NOW(),
  NOW() + INTERVAL '10 years',
  NOW(),
  NOW()
)
ON CONFLICT (clerk_user_id, entitlement) 
DO UPDATE SET
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '10 years',
  updated_at = NOW();
`;

console.log('🔐 CEO SANCTUARY ACCESS GRANT INSTRUCTIONS');
console.log('==========================================\n');

console.log('1. Find Clerk User ID for krajceva@gmail.com in Clerk Dashboard');
console.log('2. Replace YOUR_CLERK_USER_ID_HERE in the SQL below');
console.log('3. Run the SQL in Supabase Dashboard\n');

console.log('SQL TO RUN:');
console.log('----------');
console.log(sqlQuery);

console.log('\n✅ This will grant permanent Sanctuary access (10 years)');
console.log('📊 Access stored in user_entitlements table');
console.log('🔒 Server-authoritative entitlement system');

console.log('\n🔍 VERIFICATION:');
console.log('After running the SQL, verify with:');
console.log(`
SELECT 
  clerk_user_id,
  entitlement,
  status,
  current_period_end,
  created_at
FROM user_entitlements 
WHERE clerk_user_id = '${clerkUserId}' 
  AND entitlement = 'sanctuary';
`);