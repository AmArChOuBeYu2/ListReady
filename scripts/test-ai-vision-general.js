const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Read .env.local
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

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function testAiVisionGeneral() {
  console.log('====================================================');
  console.log(' TESTING CLOUDINARY AI VISION GENERAL (ai_vision_general)');
  console.log('====================================================');
  console.log('Cloud Name:', cloudName);

  // 1. Upload asset
  const testImageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';
  console.log('\nStep 1: Uploading test asset...');
  const uploadRes = await cloudinary.uploader.upload(testImageUrl, {
    folder: 'listready_ai_vision_test',
  });
  console.log('Asset Uploaded:', uploadRes.secure_url);

  // Define JSON schema
  const jsonSchema = {
    type: 'object',
    properties: {
      has_primary_product: { type: 'boolean', description: 'Is there a clearly identifiable primary product?' },
      has_external_text: { type: 'boolean', description: 'Does the image contain visible text outside the physical product?' },
      has_external_logo: { type: 'boolean', description: 'Is there an external logo or graphic overlay?' },
      has_watermark: { type: 'boolean', description: 'Is there a possible watermark?' },
      is_lifestyle_scene: { type: 'boolean', description: 'Is this a lifestyle scene?' },
      is_obscured: { type: 'boolean', description: 'Is the primary product partially obscured?' },
      is_cut_off: { type: 'boolean', description: 'Is the primary product cut off by the image boundaries?' },
      has_multiple_products: { type: 'boolean', description: 'Are multiple distinct products visible?' },
    },
    required: [
      'has_primary_product',
      'has_external_text',
      'has_external_logo',
      'has_watermark',
      'is_lifestyle_scene',
      'is_obscured',
      'is_cut_off',
      'has_multiple_products',
    ],
  };

  const promptsList = [
    'Is there a clearly identifiable primary product?',
    'Does the image contain visible text outside the physical product?',
    'Is there an external logo or graphic overlay?',
    'Is there a possible watermark?',
    'Is this a lifestyle scene?',
    'Is the primary product partially obscured?',
    'Is the primary product cut off by the image boundaries?',
    'Are multiple distinct products visible?',
  ];

  // Variations of endpoints and payloads to test
  const variations = [
    {
      name: 'Variation A: Analyze API with ai_vision_general + json_schema (Basic Auth)',
      url: `https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
      body: {
        source: { uri: uploadRes.secure_url },
        analysis_type: 'ai_vision_general',
        json_schema: jsonSchema,
      },
    },
    {
      name: 'Variation B: Analyze API with ai_vision_general + prompts (Basic Auth)',
      url: `https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
      body: {
        source: { uri: uploadRes.secure_url },
        analysis_type: 'ai_vision_general',
        prompts: promptsList,
      },
    },
    {
      name: 'Variation C: Analyze API with ai_vision + json_schema (Basic Auth)',
      url: `https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
      body: {
        source: { uri: uploadRes.secure_url },
        analysis_type: 'ai_vision',
        json_schema: jsonSchema,
      },
    },
    {
      name: 'Variation D: Uploader explicit with analysis parameters',
      action: async () => {
        return await cloudinary.uploader.explicit(uploadRes.public_id, {
          type: 'upload',
          analysis: {
            ai_vision_general: {
              prompts: promptsList,
            },
          },
        });
      },
    },
  ];

  for (const v of variations) {
    console.log(`\n----------------------------------------------------`);
    console.log(`RUNNING: ${v.name}`);
    console.log(`----------------------------------------------------`);

    if (v.action) {
      try {
        const res = await v.action();
        console.log('✓ SUCCESS RESPONSE:');
        console.log(JSON.stringify(res, null, 2));
      } catch (err) {
        console.log('✗ ERROR RESPONSE:');
        console.log('  Message:', err.message);
        console.log('  HTTP Code:', err.http_code);
        console.log('  Raw Error:', JSON.stringify(err, null, 2));
      }
    } else {
      console.log('Endpoint URL:', v.url);
      console.log('Request Payload:', JSON.stringify(v.body, null, 2));

      try {
        const res = await fetch(v.url, {
          method: 'POST',
          headers: v.headers,
          body: JSON.stringify(v.body),
        });

        const status = res.status;
        const statusText = res.statusText;
        const text = await res.text();

        console.log(`\nHTTP Status: ${status} ${statusText}`);
        console.log('Raw Cloudinary Response Body:');
        try {
          const parsed = JSON.parse(text);
          console.log(JSON.stringify(parsed, null, 2));
        } catch {
          console.log(text);
        }
      } catch (err) {
        console.error('✗ Fetch Error:', err.message);
      }
    }
  }
}

testAiVisionGeneral();
