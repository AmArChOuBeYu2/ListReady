import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary/uploader';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadToCloudinary(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: uploadResult,
    });
  } catch (err: any) {
    console.error('Upload API error:', err);
    return NextResponse.json(
      { error: err.message || 'Image upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
