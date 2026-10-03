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

async function runAddonTests() {
  console.log('=== CLOUDINARY ADDON & AI ANALYSIS TEST ===');
  const imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';

  const testParams = [
    { name: 'Quality Analysis', opts: { quality_analysis: true } },
    { name: 'Accessibility Analysis', opts: { accessibility_analysis: true } },
    { name: 'Colors & Metadata', opts: { colors: true, image_metadata: true, phash: true } },
    { name: 'Google Auto Tagging', opts: { categorization: 'google_tagging', auto_tagging: 0.3 } },
    { name: 'AWS Rekognition Tagging', opts: { categorization: 'aws_rek_tagging', auto_tagging: 0.3 } },
    { name: 'Captioning Detection', opts: { detection: 'captioning' } },
    { name: 'Object Detection', opts: { detection: 'object_detection' } },
    { name: 'OCR / Text Detection', opts: { ocr: 'adv_ocr' } },
  ];

  for (const t of testParams) {
    console.log(`\nTesting: ${t.name}...`);
    try {
      const res = await cloudinary.uploader.upload(imageUrl, {
        folder: 'listready_verification',
        ...t.opts,
      });
      console.log(`✓ ${t.name} SUCCESS:`);
      console.log('  Keys returned:', Object.keys(res).filter(k => !['url', 'secure_url', 'public_id', 'signature'].includes(k)));
      if (res.quality_analysis) console.log('  quality_analysis:', res.quality_analysis);
      if (res.accessibility_analysis) console.log('  accessibility_analysis:', res.accessibility_analysis);
      if (res.colors) console.log('  colors count:', res.colors.length, 'predominant:', res.colors.slice(0, 3));
      if (res.tags) console.log('  tags count:', res.tags.length, 'sample tags:', res.tags.slice(0, 8));
      if (res.info) console.log('  info:', JSON.stringify(res.info, null, 2));
    } catch (err) {
      console.log(`✗ ${t.name} ERROR: ${err.message}`);
    }
  }
}

runAddonTests();
