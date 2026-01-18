#!/usr/bin/env node

/**
 * CEO Sanctuary Access Grant Script
 * Grants permanent Sanctuary access to krajceva@gmail.com
 */

async function grantCeoSanctuary() {
  try {
    console.log('🔐 Granting CEO Sanctuary access...\n');

    const response = await fetch('http://localhost:3000/api/admin/grant-sanctuary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'krajceva@gmail.com'
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', result.error);
      if (result.instruction) {
        console.log('\n💡 Alternative approach:');
        console.log(result.instruction);
      }
      if (result.details) {
        console.log('Details:', result.details);
      }
      process.exit(1);
    }

    console.log('✅ Success!');
    console.log('Message:', result.message);
    console.log('\n📊 Grant Details:');
    console.log('- Email:', result.details.email);
    console.log('- Clerk User ID:', result.details.clerkUserId);
    console.log('- Entitlement:', result.details.entitlement);
    console.log('- Status:', result.details.status);
    console.log('- Expires:', result.details.expires);
    console.log('- Storage:', result.details.storage);

    // Verify the grant
    console.log('\n🔍 Verifying access...');
    const verifyResponse = await fetch(
      `http://localhost:3000/api/admin/grant-sanctuary?email=${encodeURIComponent('krajceva@gmail.com')}`
    );
    
    const verifyResult = await verifyResponse.json();
    
    if (verifyResult.hasAccess) {
      console.log('✅ Access verified successfully!');
      console.log('- Has Sanctuary Access:', verifyResult.hasAccess);
      console.log('- Expires:', verifyResult.entitlement?.current_period_end || 'N/A');
    } else {
      console.log('⚠️  Access verification failed');
      console.log(verifyResult);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure the Next.js dev server is running:');
    console.log('   npm run dev');
    process.exit(1);
  }
}

// Run the script
grantCeoSanctuary().catch(console.error);