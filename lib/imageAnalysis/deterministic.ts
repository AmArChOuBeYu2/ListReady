import sharp from 'sharp';
import { ImageMeasurements } from '@/types';

export async function runDeterministicAnalysis(
  buffer: Buffer,
  declaredFormat?: string
): Promise<ImageMeasurements> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const aspectRatio = height > 0 ? Number((width / height).toFixed(2)) : 1;
  const fileSizeBytes = buffer.length;
  const fileType = (metadata.format || declaredFormat || 'jpeg').toUpperCase();

  let isPureWhiteBackground = false;
  let backgroundRgb = { r: 255, g: 255, b: 255 };
  let whitePixelRatio = 1.0;
  let foregroundCoveragePercent = 85.0;

  try {
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;
    const channels = info.channels;

    let whiteCount = 0;
    let borderRSum = 0;
    let borderGSum = 0;
    let borderBSum = 0;
    let borderSampleCount = 0;

    // Sample border pixels (top 5, bottom 5, left 5, right 5 edge rows/cols)
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const isBorder =
          y < 5 ||
          y >= info.height - 5 ||
          x < 5 ||
          x >= info.width - 5;

        const idx = (y * info.width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // White pixel threshold (near pure white studio RGB 240+)
        if (r >= 240 && g >= 240 && b >= 240) {
          whiteCount++;
        }

        if (isBorder) {
          borderRSum += r;
          borderGSum += g;
          borderBSum += b;
          borderSampleCount++;
        }
      }
    }

    whitePixelRatio = Number((whiteCount / totalPixels).toFixed(2));

    if (borderSampleCount > 0) {
      backgroundRgb = {
        r: Math.round(borderRSum / borderSampleCount),
        g: Math.round(borderGSum / borderSampleCount),
        b: Math.round(borderBSum / borderSampleCount),
      };
    }

    // Pure white background threshold: border average RGB >= 242 in all channels and white ratio >= 0.20
    isPureWhiteBackground =
      backgroundRgb.r >= 242 &&
      backgroundRgb.g >= 242 &&
      backgroundRgb.b >= 242 &&
      whitePixelRatio >= 0.20;

    // Non-white foreground percentage estimate (studio white canvas vs solid background)
    const nonWhitePixelRatio = 1 - whitePixelRatio;
    const multiplier = isPureWhiteBackground ? 3.8 : 1.6;
    foregroundCoveragePercent = Number((Math.min(1.0, Math.max(0.15, nonWhitePixelRatio * multiplier)) * 100).toFixed(1));
  } catch (err) {
    console.warn('Deterministic pixel sampling warning:', err);
  }

  return {
    width,
    height,
    aspectRatio,
    fileSizeBytes,
    fileType,
    isPureWhiteBackground,
    backgroundRgb,
    whitePixelRatio,
    foregroundCoveragePercent,
  };
}
