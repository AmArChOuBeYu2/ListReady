const { v2: cloudinary } = require('cloudinary');
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function runEvalTest() {
  console.log('=== TESTING CLOUDINARY EVAL & ANALYSIS PARAMETERS ===');
  const testImageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';

  const uploadRes = await cloudinary.uploader.upload(testImageUrl, {
    folder: 'listready_ai_vision_test',
  });

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

  const payload = {
    analysis_type: 'ai_vision_general',
    json_schema: jsonSchema,
  };

  // Test passing via SDK explicit
  try {
    const res = await cloudinary.uploader.explicit(uploadRes.public_id, {
      type: 'upload',
      analysis: JSON.stringify(payload),
    });
    console.log('Analysis string SDK output:', Object.keys(res));
    if (res.analysis) console.log('res.analysis:', res.analysis);
  } catch (err) {
    console.log('Error:', err.message);
  }
}

runEvalTest();
