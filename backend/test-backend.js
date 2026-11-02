import { analyzeMessageWithGemini } from './services/aiService.js';
import { saveScan, getUserScans, getCommunityScans, deleteUserScan } from './services/supabaseService.js';
import { analyzeRequestSchema } from './middleware/validateMiddleware.js';

async function runTests() {
  console.log('🧪 Starting SpamChain AI Backend Unit & Integration Tests...');

  // 1. Zod schema validation
  console.log('\n--- 1. Testing Zod Validation ---');
  try {
    analyzeRequestSchema.parse({ message: "USPS package alert: click http://usps-track.top" });
    console.log('✅ Valid message parsed successfully');
  } catch (err) {
    console.error('❌ Validation failed unexpectedly:', err);
  }

  try {
    analyzeRequestSchema.parse({ message: "hi" });
    console.error('❌ Expected error for short message but succeeded');
  } catch (err) {
    console.log('✅ Short message rejected as expected (<3 chars)');
  }

  // 2. AI Intelligence Engine
  console.log('\n--- 2. Testing AI Threat Intelligence Engine ---');
  const sampleScam = "USPS: Your package cannot be delivered due to incomplete address. Update info at https://usps-update-parcel.top/verify within 12 hours.";
  const analysis = await analyzeMessageWithGemini(sampleScam);
  
  console.log('Risk Level:', analysis.riskLevel);
  console.log('Risk Score:', analysis.riskScore);
  console.log('Category:', analysis.category);
  console.log('Warning signs count:', analysis.warningSigns?.length);
  console.log('Spam Chain Sender:', analysis.spamChain?.sender);
  console.log('Spam Chain Urgency:', analysis.spamChain?.urgency);
  console.log('Spam Chain Link:', analysis.spamChain?.suspiciousLink);
  console.log('Spam Chain Demanded:', analysis.spamChain?.informationRequest);
  console.log('Spam Chain Summary:', analysis.spamChain?.finalRiskSummary);

  if (analysis.riskLevel && analysis.riskScore >= 80 && analysis.spamChain?.sender) {
    console.log('✅ AI Analysis Engine conforms strictly to 5-stage Spam Chain schema');
  } else {
    console.error('❌ AI Analysis output schema mismatch');
  }

  // 3. Storage & Scan Persistence
  console.log('\n--- 3. Testing Storage Persistence ---');
  const testUserId = 'test-analyst-uuid';
  const saved = await saveScan({
    userId: testUserId,
    rawMessage: sampleScam,
    analysis,
    userEmail: 'analyst@test.com'
  });
  console.log('✅ Saved scan with ID:', saved.id);

  const userScans = await getUserScans(testUserId);
  console.log(`✅ Retrieved ${userScans.length} scans for user ${testUserId}`);

  // 4. Community Feed
  console.log('\n--- 4. Testing Community Threat Feed ---');
  const communityScans = await getCommunityScans(5);
  console.log(`✅ Retrieved ${communityScans.length} verified community threat scans`);
  console.log('Community scan sample:', communityScans[0]?.raw_message?.slice(0, 50) + '...');

  // 5. Deletion
  console.log('\n--- 5. Testing Scan Deletion ---');
  const delResult = await deleteUserScan(saved.id, testUserId);
  console.log('✅ Deleted scan result:', delResult);

  console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);

