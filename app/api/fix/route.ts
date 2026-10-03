import { NextResponse } from 'next/server';
import { generateCloudinaryFix } from '@/lib/transformations/cloudinaryFix';
import { ComplianceCheck } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assetUrl, checks, publicId } = body as {
      assetUrl: string;
      checks: ComplianceCheck[];
      publicId?: string;
    };

    if (!assetUrl || !checks) {
      return NextResponse.json(
        { error: 'Missing assetUrl or compliance checks' },
        { status: 400 }
      );
    }

    const transformationResult = await generateCloudinaryFix(assetUrl, checks, publicId);

    return NextResponse.json({
      success: true,
      data: transformationResult,
    });
  } catch (err: any) {
    console.error('Fix API error:', err);
    return NextResponse.json(
      { error: err.message || 'Auto-fix pipeline failed' },
      { status: 500 }
    );
  }
}
