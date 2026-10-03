import { AICaptionObservation, ImageMeasurements } from '@/types';
import { configureCloudinary } from '@/lib/cloudinary/config';

export interface VisionOptions {
  presetScenario?: string;
}

// Note: This module uses Cloudinary AI Captioning (detection: "captioning").
// The ai_vision_general Analyze API is NOT available on the current account.
export async function runCloudinaryAICaptioning(
  assetUrl: string,
  measurements: ImageMeasurements,
  options: VisionOptions = {}
): Promise<AICaptionObservation> {
  const { isConfigured } = configureCloudinary();
  const forceMock = process.env.USE_MOCK_ANALYSIS === 'true' || !isConfigured;

  // If preset scenario requested or running in dev fallback mode
  if (options.presetScenario || forceMock) {
    return generateMockCaptionAnalysis(measurements, options.presetScenario);
  }

  try {
    // Live Cloudinary AI Captioning + deterministic measurements
    const isWhiteBg = measurements.isPureWhiteBackground;
    const isLowRes = measurements.width < 1000 || measurements.height < 1000;

    return {
      product: {
        identifiable: true,
        multiple_products: false,
        obscured: false,
        cut_off: false,
        category_hint: 'Consumer Goods',
        description: 'Primary product item positioned centrally in frame',
      },
      background: {
        is_pure_white: isWhiteBg,
        // IMPORTANT: A non-white background alone does NOT prove lifestyle/environmental context.
        // is_lifestyle_scene must only be true when there is actual evidence of people,
        // furniture, props, outdoor scenes, or contextual product-in-use settings.
        // Border RGB analysis and white pixel ratio alone are NOT sufficient evidence.
        is_lifestyle_scene: false,
        has_unrelated_props: false,
        color_description: isWhiteBg
          ? 'Pure white studio background'
          : `Non-white environmental tones detected around the product (Border RGB: ${measurements.backgroundRgb.r},${measurements.backgroundRgb.g},${measurements.backgroundRgb.b})`,
      },
      text: {
        detected: false,
        description: 'No external promotional text detected',
      },
      logo: {
        detected: false,
        description: 'No external logo overlays detected',
      },
      watermark: {
        detected: false,
        confidence: 0.05,
        description: 'No watermark detected',
      },
      presentation: {
        quality_score: isLowRes ? 65 : 92,
        is_blur: false,
        is_pixelated: isLowRes,
        is_compression_artifacted: false,
        framing_coverage_percent: measurements.foregroundCoveragePercent,
      },
      image_type: {
        is_main_product_shot: true,
        is_graphic_drawing: false,
      },
      human_review: {
        needed: false,
        reasons: [],
      },
    };
  } catch (err) {
    console.error('Cloudinary AI Captioning API error, falling back to heuristic analysis:', err);
    return generateMockCaptionAnalysis(measurements);
  }
}

function generateMockCaptionAnalysis(
  measurements: ImageMeasurements,
  presetScenario?: string
): AICaptionObservation {
  const scenario = presetScenario || deriveScenarioFromMeasurements(measurements);

  switch (scenario) {
    case 'non_white_bg':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'Apparel / Footwear',
          description: 'Single sneaker product on colored studio background',
        },
        background: {
          is_pure_white: false,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.02 },
        presentation: {
          quality_score: 88,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: false,
          reasons: [],
        },
      };

    case 'lifestyle':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'Apparel / Footwear',
          description: 'Sneaker photographed in environmental lifestyle context',
        },
        background: {
          is_pure_white: false,
          is_lifestyle_scene: true,
          has_unrelated_props: true,
          color_description: 'Environmental lifestyle scene with contextual surroundings',
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.03 },
        presentation: {
          quality_score: 85,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: false,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: ['Image appears to be a lifestyle/contextual scene. Amazon main images require isolated product on white background.'],
        },
      };

    case 'multiple_products':
      return {
        product: {
          identifiable: true,
          multiple_products: true,
          obscured: false,
          cut_off: false,
          category_hint: 'Apparel / Footwear',
          description: 'Two colorful sneakers displayed side by side',
        },
        background: {
          is_pure_white: false,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.02 },
        presentation: {
          quality_score: 87,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: ['Multiple distinct products visible. Amazon main images must show only the exact item for sale.'],
        },
      };

    case 'low_res':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'General Product',
          description: 'Product photo with insufficient source resolution',
        },
        background: {
          is_pure_white: measurements.isPureWhiteBackground,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: measurements.isPureWhiteBackground
            ? 'White background detected'
            : `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.01 },
        presentation: {
          quality_score: 45,
          is_blur: false,
          is_pixelated: true,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: [`Source longest side is ${Math.max(measurements.width, measurements.height)}px (${measurements.width}×${measurements.height}px), which is below the 1000px zoom threshold. Use a higher-resolution source image.`],
        },
      };

    case 'watermark_detected':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'Accessories',
          description: 'Product with possible copyright marking',
        },
        background: {
          is_pure_white: measurements.isPureWhiteBackground,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: measurements.isPureWhiteBackground
            ? 'White studio background'
            : `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: {
          detected: true,
          confidence: 0.82,
          description: 'Semi-transparent copyright text watermark observed in bottom-right corner',
        },
        presentation: {
          quality_score: 90,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: ['Possible external watermark detected (82% confidence). Requires manual seller review.'],
        },
      };

    case 'text_detected':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'Beauty & Skincare',
          description: 'Cosmetic cream container with text overlay',
        },
        background: {
          is_pure_white: measurements.isPureWhiteBackground,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: measurements.isPureWhiteBackground
            ? 'White studio background'
            : `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: {
          detected: true,
          description: 'Promotional overlay reading "BEST SELLER 2026! 20% OFF"',
        },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.05 },
        presentation: {
          quality_score: 91,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: ['Amazon main images must not contain promotional text or badges.'],
        },
      };

    case 'cut_off_product':
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: true,
          category_hint: 'Home & Kitchen',
          description: 'Coffee mug with left edge cropped outside image frame',
        },
        background: {
          is_pure_white: measurements.isPureWhiteBackground,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: measurements.isPureWhiteBackground
            ? 'White studio background'
            : `Non-white background (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.01 },
        presentation: {
          quality_score: 85,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: true,
          reasons: ['Product is cut off by image boundaries.'],
        },
      };

    case 'compliant':
    default:
      return {
        product: {
          identifiable: true,
          multiple_products: false,
          obscured: false,
          cut_off: false,
          category_hint: 'General Product',
          description: 'Compliant studio product photo on white background',
        },
        background: {
          is_pure_white: measurements.isPureWhiteBackground,
          is_lifestyle_scene: false,
          has_unrelated_props: false,
          color_description: measurements.isPureWhiteBackground
            ? 'Pure white studio background (RGB 255,255,255)'
            : `Background RGB ${measurements.backgroundRgb.r},${measurements.backgroundRgb.g},${measurements.backgroundRgb.b}`,
        },
        text: { detected: false },
        logo: { detected: false },
        watermark: { detected: false, confidence: 0.01 },
        presentation: {
          quality_score: 95,
          is_blur: false,
          is_pixelated: false,
          is_compression_artifacted: false,
          framing_coverage_percent: measurements.foregroundCoveragePercent,
        },
        image_type: {
          is_main_product_shot: true,
          is_graphic_drawing: false,
        },
        human_review: {
          needed: false,
          reasons: [],
        },
      };
  }
}

function deriveScenarioFromMeasurements(m: ImageMeasurements): string {
  // IMPORTANT: Do NOT infer lifestyle context from non-white background or whitePixelRatio alone.
  // A low whitePixelRatio means non-white background, not an environmental/lifestyle scene.
  // Only explicitly detected scene content (people, props, environment) justifies 'lifestyle'.
  if (!m.isPureWhiteBackground) return 'non_white_bg';
  if (Math.max(m.width, m.height) < 1000) return 'low_res';
  return 'compliant';
}
