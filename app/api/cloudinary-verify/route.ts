import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    let uploadResult: any;

    // Step 1: Real Cloudinary Upload
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'listready_ai_vision_verify',
            quality_analysis: true,
            colors: true,
            detection: 'captioning',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    } else if (imageUrl) {
      uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: 'listready_ai_vision_verify',
        quality_analysis: true,
        colors: true,
        detection: 'captioning',
      });
    } else {
      return NextResponse.json({ error: 'No file or imageUrl provided' }, { status: 400 });
    }

    const publicId = uploadResult.public_id;
    const secureUrl = uploadResult.secure_url;
    const assetId = uploadResult.asset_id;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // JSON Schema requested by prompt
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

    // Step 2: Attempt official Cloudinary AI Vision General Analyze API call
    const endpointUrl = `https://api.cloudinary.com/v1_1/${cloudName}/analysis/analyze`;
    const requestPayload = {
      source: { uri: secureUrl },
      analysis_type: 'ai_vision_general',
      prompts: promptsList,
      json_schema: jsonSchema,
    };

    let aiVisionGeneralStatus = 0;
    let aiVisionGeneralResponseRaw: any = null;
    let aiVisionGeneralError: any = null;

    try {
      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(requestPayload),
      });

      aiVisionGeneralStatus = res.status;
      const responseText = await res.text();

      try {
        aiVisionGeneralResponseRaw = JSON.parse(responseText);
      } catch {
        aiVisionGeneralResponseRaw = responseText;
      }

      if (!res.ok) {
        aiVisionGeneralError = {
          http_status: res.status,
          status_text: res.statusText,
          response: aiVisionGeneralResponseRaw,
        };
      }
    } catch (err: any) {
      aiVisionGeneralError = {
        message: err.message,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        asset_id: assetId,
        public_id: publicId,
        secure_url: secureUrl,
        cloud_name: cloudName,
        ai_vision_general_execution: {
          endpoint_used: endpointUrl,
          http_status: aiVisionGeneralStatus,
          request_payload: requestPayload,
          raw_cloudinary_response: aiVisionGeneralResponseRaw,
          error_logged: aiVisionGeneralError,
        },
        raw_cloudinary_upload_response: uploadResult,
      },
    });
  } catch (err: any) {
    console.error('Cloudinary AI Vision Verification Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Cloudinary verification failed',
      },
      { status: 500 }
    );
  }
}
