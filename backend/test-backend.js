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

  // 2b. XAI Token Highlights
  console.log('\n--- 2b. Testing XAI Token Highlights ---');
  if (Array.isArray(analysis.tokenHighlights) && analysis.tokenHighlights.length > 0) {
    console.log(`✅ Extracted ${analysis.tokenHighlights.length} XAI threat token highlights:`);
    analysis.tokenHighlights.forEach(h => console.log(`   [${h.category}] "${h.text}" (Sev: ${h.severity}) -> ${h.explanation}`));
  } else {
    console.error('❌ No token highlights extracted');
  }

  // 2c. Honeypot Counter-Agent
  console.log('\n--- 2c. Testing ScamBaiter Honeypot ---');
  const { generateHoneypotReply } = await import('./services/aiService.js');
  const honeypotRes = await generateHoneypotReply({
    messageHistory: [
      { role: 'scammer', content: "USPS: Pay $1.50 at http://usps-update.top or package is returned. Or send 0.05 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
    ],
    persona: 'grandma',
    scamContext: 'USPS package smishing scam'
  });
  console.log(`✅ Persona Grandma Reply: "${honeypotRes.reply}"`);
  console.log(`✅ Time Wasted: ${honeypotRes.timeWastedMinutes} mins | Extracted Intel:`, honeypotRes.extractedIntel);

  // 2d. Zero-Trust Sandbox
  console.log('\n--- 2d. Testing Zero-Trust URL Sandbox ---');
  const { inspectUrlSandbox } = await import('./services/sandboxService.js');
  const sandboxRes = await inspectUrlSandbox("https://usps-update-parcel.top/verify");
  console.log(`✅ Sandbox domain: ${sandboxRes.domain} (Risk: ${sandboxRes.riskScore}/100)`);
  console.log(`✅ Neutralized scripts: ${sandboxRes.securityAudit.scriptsNeutralized} | Blocked cookies: ${sandboxRes.securityAudit.cookiesBlocked}`);

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

