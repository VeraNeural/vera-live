// Simple Node.js script to grant CEO access
const fetch = require('node-fetch');

// This would be the direct Supabase approach, but let me use a simpler method
// Since we know the system, I'll create the entitlement directly

// The CEO's email is krajceva@gmail.com
// We need to find their Clerk user ID and add them to user_entitlements table

console.log('CEO Sanctuary Access Grant');
console.log('Email: krajceva@gmail.com');
console.log('Action: Direct database entry for permanent Sanctuary access');
console.log('');
console.log('This requires:');
console.log('1. Finding the user\'s Clerk ID for krajceva@gmail.com');
console.log('2. Adding entry to user_entitlements table with:');
console.log('   - clerk_user_id: (their Clerk ID)');
console.log('   - entitlement: "sanctuary"');
console.log('   - status: "active"');
console.log('   - current_period_end: far future date (10 years)');
console.log('');
console.log('Since I cannot access Clerk directly from this script,');
console.log('I will create a SQL statement that can be run in Supabase dashboard.');

const permanentEnd = new Date();
permanentEnd.setFullYear(permanentEnd.getFullYear() + 10);
const now = new Date().toISOString();

console.log('');
console.log('SQL TO RUN IN SUPABASE DASHBOARD:');
console.log('');
console.log('-- First, find the Clerk user ID for krajceva@gmail.com');
console.log('-- You can check this in Clerk dashboard or use this query if you have a users table:');
console.log('-- SELECT clerk_user_id FROM users WHERE email = \'krajceva@gmail.com\';');
console.log('');
console.log('-- Then, insert the entitlement (replace YOUR_CLERK_USER_ID with actual ID):');
console.log('INSERT INTO user_entitlements (');
console.log('  clerk_user_id,');
console.log('  entitlement,');
console.log('  status,');
console.log('  current_period_start,');
console.log('  current_period_end,');
console.log('  updated_at');
console.log(') VALUES (');
console.log('  \'YOUR_CLERK_USER_ID_HERE\',');
console.log('  \'sanctuary\',');
console.log('  \'active\',');
console.log(`  '${now}',`);
console.log(`  '${permanentEnd.toISOString()}',`);
console.log(`  '${now}'`);
console.log(') ON CONFLICT (clerk_user_id, entitlement) DO UPDATE SET');
console.log('  status = EXCLUDED.status,');
console.log('  current_period_start = EXCLUDED.current_period_start,');
console.log('  current_period_end = EXCLUDED.current_period_end,');
console.log('  updated_at = EXCLUDED.updated_at;');
console.log('');
console.log('This will grant permanent Sanctuary access to the CEO.');