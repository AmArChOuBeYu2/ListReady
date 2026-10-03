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

async function runTest() {
  console.log('--- TESTING SDK METHOD SYNTAX FOR AI VISION GENERAL ---');
  const testImageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';

  const uploadRes = await cloudinary.uploader.upload(testImageUrl, {
    folder: 'listready_ai_vision_test',
  });
  const publicId = uploadRes.public_id;
  console.log('Public ID:', publicId);

  const prompts = [
    'Is there a clearly identifiable primary product?',
    'Does the image contain visible text outside the physical product?',
    'Is there an external logo or graphic overlay?',
    'Is there a possible watermark?',
    'Is this a lifestyle scene?',
    'Is the primary product partially obscured?',
    'Is the primary product cut off by the image boundaries?',
    'Are multiple distinct products visible?',
  ];

  const tests = [
    { name: '1. detection: ai_vision_general', opts: { detection: 'ai_vision_general' } },
    { name: '2. detection: ai_vision', opts: { detection: 'ai_vision' } },
    { name: '3. ai_vision parameter object', opts: { ai_vision: { prompts } } },
    { name: '4. ai_vision_general parameter object', opts: { ai_vision_general: { prompts } } },
    { name: '5. analysis parameter string', opts: { analysis: 'ai_vision_general' } },
    { name: '6. visual_search', opts: { visual_search: true } },
  ];

  for (const t of tests) {
    console.log(`\nTesting ${t.name}...`);
    try {
      const res = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        ...t.opts,
      });
      console.log(`✓ ${t.name} SUCCESS:`);
      console.log('  Keys returned:', Object.keys(res));
      if (res.info) console.log('  Info:', JSON.stringify(res.info, null, 2));
      if (res.analysis) console.log('  Analysis:', JSON.stringify(res.analysis, null, 2));
      if (res.ai_vision) console.log('  AI Vision:', JSON.stringify(res.ai_vision, null, 2));
    } catch (err) {
      console.log(`✗ ${t.name} ERROR:`, err.message);
    }
  }
}

runTest();
