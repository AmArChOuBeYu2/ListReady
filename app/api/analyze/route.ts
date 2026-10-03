import { NextResponse } from 'next/server';
import { uploadToCloudinary, uploadUrlToCloudinary } from '@/lib/cloudinary/uploader';
import { runDeterministicAnalysis } from '@/lib/imageAnalysis/deterministic';
import { evaluateAmazonCompliance } from '@/rules/amazon';
import { AICaptionObservation } from '@/types';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let filename = 'product_image.jpg';
    let assetUrl: string | undefined;
    let uploadResult: any;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
      }

      filename = file.name;
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary with quality_analysis & detection: "captioning"
      uploadResult = await uploadToCloudinary(buffer, filename);
      assetUrl = uploadResult.secureUrl;
    } else {
      const json = await request.json();

      if (json.assetUrl) {
        assetUrl = json.assetUrl as string;

        // SSRF protection: only allow known safe image delivery hostnames
        const allowedHostnames = ['res.cloudinary.com', 'images.unsplash.com'];
        let parsedHostname = '';
        try {
          parsedHostname = new URL(assetUrl).hostname;
        } catch {
          return NextResponse.json({ error: 'Invalid asset URL format.' }, { status: 400 });
        }
        if (!allowedHostnames.includes(parsedHostname)) {
          return NextResponse.json({ error: 'Asset URL hostname is not permitted.' }, { status: 400 });
        }

        const res = await fetch(assetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const arrayBuf = await res.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        try {
          uploadResult = await uploadUrlToCloudinary(assetUrl);
        } catch (urlErr) {
          console.warn('uploadUrlToCloudinary failed, falling back to buffer upload:', urlErr);
          uploadResult = await uploadToCloudinary(buffer, 'image.jpg');
        }
        assetUrl = uploadResult.secureUrl;
      } else if (json.imageBase64) {
        const base64Clean = json.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        buffer = Buffer.from(base64Clean, 'base64');
        uploadResult = await uploadToCloudinary(buffer, 'uploaded_image.jpg');
        assetUrl = uploadResult.secureUrl;
      } else {
        return NextResponse.json({ error: 'Missing image data or assetUrl' }, { status: 400 });
      }
    }

    if (!buffer) {
      return NextResponse.json({ error: 'Could not process image buffer' }, { status: 400 });
    }

    console.log('[DEBUG LOG - UPLOAD]', {
      sourceType: contentType.includes('multipart/form-data') ? 'manual_upload' : 'preset_url',
      originalFileName: filename,
      cloudinaryAssetId: uploadResult.assetId,
      originalUrl: assetUrl,
    });

    // 1. Sharp Deterministic Analysis
    const measurements = await runDeterministicAnalysis(buffer, filename.split('.').pop());

    // 2. Real Cloudinary AI Captioning + Quality Analysis + Color Histogram
    const aiCaption = uploadResult.aiCaption || '';
    const captionLower = aiCaption.toLowerCase();
    const qualityFocus = uploadResult.qualityAnalysis?.focus ?? 1;

    const aiObservations: AICaptionObservation = {
      product: {
        identifiable: Boolean(aiCaption && !captionLower.includes('empty') && !captionLower.includes('blurry')),
        multiple_products: Boolean(
          captionLower.includes('two ') ||
          captionLower.includes('three ') ||
          captionLower.includes('four ') ||
          captionLower.includes('multiple ') ||
          captionLower.includes('group of') ||
          captionLower.includes('several ') ||
          captionLower.includes('collection of') ||
          (captionLower.includes('pairs') && !captionLower.includes('a pair') && !captionLower.includes('one pair'))
        ),
        obscured: Boolean(captionLower.includes('behind') || captionLower.includes('hidden') || captionLower.includes('partially')),
        cut_off: Boolean(captionLower.includes('cropped') || captionLower.includes('cut off')),
        category_hint: 'General Product',
        description: aiCaption || 'Product photo analyzed via Cloudinary AI Captioning',
      },
      background: {
        is_pure_white: measurements.isPureWhiteBackground,
        is_lifestyle_scene: Boolean(
          !measurements.isPureWhiteBackground &&
          (captionLower.includes('table') || captionLower.includes('grass') || captionLower.includes('room') || captionLower.includes('surface') || captionLower.includes('wood') || captionLower.includes('wall') || captionLower.includes('velvet'))
        ),
        has_unrelated_props: Boolean(captionLower.includes('cube') || captionLower.includes('hand') || captionLower.includes('cream') || captionLower.includes('resting on')),
        color_description: measurements.isPureWhiteBackground
          ? 'Pure white studio background (RGB 255, 255, 255)'
          : `Non-white background (Border average RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
      },
      text: {
        detected: Boolean(captionLower.includes('text') || captionLower.includes('writing') || captionLower.includes('label')),
        description: captionLower.includes('text') ? 'Text or brand writing observed in AI Caption' : undefined,
      },
      logo: {
        detected: Boolean(captionLower.includes('logo') || captionLower.includes('swoosh') || uploadResult.illustrationScore > 0.5),
        description: captionLower.includes('swoosh') || captionLower.includes('logo') ? 'Brand logo or graphic observed' : undefined,
      },
      watermark: {
        detected: Boolean(captionLower.includes('watermark') || captionLower.includes('copyright')),
        confidence: 0.80,
        description: captionLower.includes('watermark') ? 'Watermark phrase observed in AI Caption' : undefined,
      },
      presentation: {
        quality_score: Math.round(qualityFocus * 100),
        is_blur: qualityFocus < 0.4,
        is_pixelated: measurements.width < 1000 || measurements.height < 1000,
        is_compression_artifacted: false,
      },
      image_type: {
        is_main_product_shot: true,
        is_graphic_drawing: Boolean(uploadResult.illustrationScore > 0.5),
      },
    };

    // 3. Amazon Rule Engine
    const complianceResult = evaluateAmazonCompliance(
      measurements,
      aiObservations,
      assetUrl!,
      uploadResult.publicId
    );

    console.log('[DEBUG LOG - ANALYSIS]', {
      analysisStatus: complianceResult.summary.overallStatus,
      qualityResult: uploadResult.qualityAnalysis,
      aiCaption: uploadResult.aiCaption,
      deterministicMeasurements: {
        width: measurements.width,
        height: measurements.height,
        isPureWhiteBackground: measurements.isPureWhiteBackground,
        foregroundCoveragePercent: measurements.foregroundCoveragePercent,
      },
    });

    return NextResponse.json({
      success: true,
      data: complianceResult,
    });
  } catch (err: any) {
    console.error('Analysis API error:', err);
    return NextResponse.json(
      { error: err.message || 'Image analysis could not be completed. Please try again.' },
      { status: 500 }
    );
  }
}
