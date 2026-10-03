const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
const testImageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';

const v2Endpoints = [
  `https://api.cloudinary.com/v2/${cloudName}/analysis`,
  `https://api.cloudinary.com/v2/${cloudName}/analysis/ai_vision_general`,
  `https://api.cloudinary.com/v2/${cloudName}/analysis/ai_vision`,
  `https://api.cloudinary.com/v2/${cloudName}/analyze`,
  `https://api.cloudinary.com/v2/${cloudName}/media_analysis`,
  `https://api.cloudinary.com/v2/${cloudName}/analysis/jobs`,
];

async function runV2Test() {
  console.log('=== TESTING CLOUDINARY V2 API PATHS ===');
  for (const url of v2Endpoints) {
    console.log(`\nPosting to: ${url}...`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          source: { uri: testImageUrl },
          analysis_type: 'ai_vision_general',
        }),
      });
      const status = res.status;
      const text = await res.text();
      console.log(`HTTP ${status}:`, text);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

runV2Test();
