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

const jsonSchema = {
  type: 'object',
  properties: {
    has_primary_product: { type: 'boolean' },
    has_external_text: { type: 'boolean' },
    has_external_logo: { type: 'boolean' },
    has_watermark: { type: 'boolean' },
    is_lifestyle_scene: { type: 'boolean' },
    is_obscured: { type: 'boolean' },
    is_cut_off: { type: 'boolean' },
    has_multiple_products: { type: 'boolean' },
  },
  required: ['has_primary_product', 'has_external_text', 'has_external_logo', 'has_watermark', 'is_lifestyle_scene', 'is_obscured', 'is_cut_off', 'has_multiple_products'],
};

const endpoints = [
  `https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`,
  `https://api.cloudinary.com/v1_1/${cloudName}/image/analyze`,
  `https://api.cloudinary.com/v2/${cloudName}/analysis/analyze`,
  `https://api.cloudinary.com/v1_1/${cloudName}/analysis`,
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/analyze`,
];

async function runEndpointsTest() {
  console.log('=== TESTING CLOUDINARY REST ENDPOINTS FOR AI VISION GENERAL ===');

  for (const url of endpoints) {
    console.log(`\nTrying URL: ${url}...`);

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
          json_schema: jsonSchema,
        }),
      });

      const status = res.status;
      const statusText = res.statusText;
      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();

      console.log(`HTTP ${status} ${statusText} (Content-Type: ${contentType})`);
      if (contentType.includes('application/json')) {
        console.log('JSON Payload:', JSON.stringify(JSON.parse(text), null, 2));
      } else {
        console.log('Non-JSON Output length:', text.length, 'sample:', text.slice(0, 200).replace(/\s+/g, ' '));
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  }
}

runEndpointsTest();
