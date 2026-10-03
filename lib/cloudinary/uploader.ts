import { configureCloudinary } from './config';

export interface CloudinaryUploadResult {
  assetId: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  qualityAnalysis?: {
    focus?: number;
    noise?: number;
    contrast?: number;
    lighting?: number;
    pixel_score?: number;
    color_score?: number;
    dct_score?: number;
    val_structure_score?: number;
  };
  aiCaption?: string;
  colors?: Array<[string, number]>;
  illustrationScore?: number;
  semiTransparent?: boolean;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string = 'product_image.jpg'
): Promise<CloudinaryUploadResult> {
  const { cloudinary, isConfigured } = configureCloudinary();

  if (!isConfigured) {
    throw new Error('Cloudinary credentials missing in environment.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'listready_uploads',
        resource_type: 'image',
        quality_analysis: true,
        colors: true,
        image_metadata: true,
        detection: 'captioning',
        timeout: 60000,
      },
      (error, result) => {
        if (error || !result) {
          return reject(new Error(error?.message || 'Cloudinary upload failed'));
        }

        const aiCaption = result.info?.detection?.captioning?.data?.caption || '';
        const qualityAnalysis = result.quality_analysis || {};
        const colors = result.colors || [];
        const illustrationScore = result.illustration_score || 0;
        const semiTransparent = result.semi_transparent || false;

        resolve({
          assetId: result.asset_id,
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          qualityAnalysis,
          aiCaption,
          colors,
          illustrationScore,
          semiTransparent,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function uploadUrlToCloudinary(
  imageUrl: string
): Promise<CloudinaryUploadResult> {
  const { cloudinary, isConfigured } = configureCloudinary();

  if (!isConfigured) {
    throw new Error('Cloudinary credentials missing in environment.');
  }

  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'listready_uploads',
    resource_type: 'image',
    quality_analysis: true,
    colors: true,
    image_metadata: true,
    detection: 'captioning',
    timeout: 60000,
  });

  const aiCaption = result.info?.detection?.captioning?.data?.caption || '';
  const qualityAnalysis = result.quality_analysis || {};
  const colors = result.colors || [];
  const illustrationScore = result.illustration_score || 0;
  const semiTransparent = result.semi_transparent || false;

  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    qualityAnalysis,
    aiCaption,
    colors,
    illustrationScore,
    semiTransparent,
  };
}
