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
  console.log('--- TESTING REAL CLOUDINARY CAPABILITIES ---');
  const testImageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80';

  // Test 1: Standard Upload with Quality Analysis
  console.log('\n--- TEST 1: Standard Upload + quality_analysis ---');
  let uploadRes;
  try {
    uploadRes = await cloudinary.uploader.upload(testImageUrl, {
      folder: 'listready_verification',
      quality_analysis: true,
    });
    console.log('✓ TEST 1 SUCCESS:');
    console.log('  Asset ID:', uploadRes.asset_id);
    console.log('  Public ID:', uploadRes.public_id);
    console.log('  Secure URL:', uploadRes.secure_url);
    console.log('  Quality Analysis:', JSON.stringify(uploadRes.quality_analysis, null, 2));
  } catch (err) {
    console.error('✗ TEST 1 ERROR:', err.message);
    return;
  }

  // Test 2: AI Vision API direct endpoint
  console.log('\n--- TEST 2: Cloudinary AI Vision General Analysis ---');
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  const visionPrompt = `Analyze this product image for e-commerce marketplace compliance:
1. Is there a primary product identifiable?
2. Is there visible external text on the image?
3. Is an external logo or graphic present?
4. Is this a lifestyle scene?
5. Is the product obscured?
6. Is the product cut off at the image borders?
7. Are multiple products present?`;

  try {
    const visionRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
      body: JSON.stringify({
        source: { uri: uploadRes.secure_url },
        analysis_type: 'ai_vision',
        prompts: [visionPrompt],
      }),
    });

    const status = visionRes.status;
    const resText = await visionRes.text();
    console.log(`AI Vision Response (HTTP ${status}):`);
    try {
      console.log(JSON.stringify(JSON.parse(resText), null, 2));
    } catch {
      console.log(resText);
    }
  } catch (err) {
    console.error('✗ TEST 2 ERROR:', err.message);
  }

  // Test 3: OCR / Text Detection
  console.log('\n--- TEST 3: OCR / Text Detection ---');
  try {
    const ocrRes = await cloudinary.uploader.explicit(uploadRes.public_id, {
      type: 'upload',
      ocr: 'adv_ocr',
    });
    console.log('✓ OCR RESULT:', JSON.stringify(ocrRes.info?.ocr, null, 2));
  } catch (err) {
    console.log('✗ OCR ERROR:', err.message);
  }

  // Test 4: Categorization / Auto Tagging
  console.log('\n--- TEST 4: Auto Tagging / Categorization ---');
  try {
    const catRes = await cloudinary.uploader.explicit(uploadRes.public_id, {
      type: 'upload',
      categorization: 'google_tagging',
      auto_tagging: 0.4,
    });
    console.log('✓ TAGGING RESULT:', JSON.stringify(catRes.tags, null, 2));
  } catch (err) {
    console.log('✗ TAGGING ERROR:', err.message);
  }

  // Test 5: Cloudinary AI Background Removal transformation
  console.log('\n--- TEST 5: Cloudinary Background Removal Transformation ---');
  const bgRemovalUrl = uploadRes.secure_url.replace('/upload/', '/upload/e_background_removal/');
  console.log('Background Removal URL:', bgRemovalUrl);
}

runTest();
