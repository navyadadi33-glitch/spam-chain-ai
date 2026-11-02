import http from 'http';
import { spawn } from 'child_process';

console.log('🚀 Launching backend server for end-to-end integration test...');
const server = spawn('node', ['server.js'], { cwd: process.cwd() });

server.stdout.on('data', (d) => process.stdout.write(`[Server] ${d}`));
server.stderr.on('data', (d) => process.stderr.write(`[Server Err] ${d}`));

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  await wait(2000); // Give server 2 seconds to bind to port 5000

  // 1. Health check
  console.log('\n--- Checking GET /api/health ---');
  const healthRes = await fetch('http://127.0.0.1:5050/api/health');
  const healthJson = await healthRes.json();
  console.log('Health Response:', healthJson);

  // 2. Analyze API check
  console.log('\n--- Checking POST /api/analyze ---');
  const analyzeRes = await fetch('http://127.0.0.1:5050/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token'
    },
    body: JSON.stringify({
      message: "URGENT: Fraudulent charge of $980.00 detected on your card. Call 1-800-492-0192 immediately."
    })
  });

  const analyzeJson = await analyzeRes.json();
  console.log('Analyze Status:', analyzeRes.status);
  console.log('Scan ID:', analyzeJson.scan?.id);
  console.log('Risk Level:', analyzeJson.scan?.risk_level);
  console.log('Risk Score:', analyzeJson.scan?.risk_score);
  console.log('Category:', analyzeJson.scan?.category);
  console.log('Spam Chain Steps:', Object.keys(analyzeJson.scan?.spam_chain || {}));

  // 3. User Scans History check
  console.log('\n--- Checking GET /api/scans ---');
  const scansRes = await fetch('http://127.0.0.1:5050/api/scans', {
    headers: { 'Authorization': 'Bearer demo-token' }
  });
  const scansJson = await scansRes.json();
  console.log('User Scans Count:', scansJson.count);

  // 4. Community Feed check
  console.log('\n--- Checking GET /api/community ---');
  const commRes = await fetch('http://127.0.0.1:5050/api/community');
  const commJson = await commRes.json();
  console.log('Community Feed Count:', commJson.count);

  server.kill('SIGTERM');
  console.log('\n✨ End-to-end integration test completed successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  server.kill('SIGTERM');
  process.exit(1);
});
