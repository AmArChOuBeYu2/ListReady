import {
  AICaptionObservation,
  ComplianceCheck,
  ComplianceResult,
  ComplianceSummary,
  ImageMeasurements,
  MarketplaceConfig,
  OverallComplianceStatus,
} from '@/types';

export const AMAZON_MARKETPLACE_CONFIG: MarketplaceConfig = {
  id: 'amazon',
  name: 'Amazon Marketplace',
  logoText: 'Amazon Main Image Policy (2026)',
  isSupported: true,
  minWidth: 1000,
  minHeight: 1000,
  recommendedWidth: 2000,
  recommendedHeight: 2000,
  requiresPureWhiteBg: true,
};

export function evaluateAmazonCompliance(
  measurements: ImageMeasurements,
  aiObservations: AICaptionObservation,
  assetUrl: string,
  publicId?: string
): ComplianceResult {
  const checks: ComplianceCheck[] = [];

  // 1. Background Whiteness (RGB 255,255,255)
  const bgObserved = measurements.isPureWhiteBackground
    ? `Pure white background (RGB ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`
    : `Non-white background detected (Border RGB: ${measurements.backgroundRgb.r}, ${measurements.backgroundRgb.g}, ${measurements.backgroundRgb.b})`;

  if (measurements.isPureWhiteBackground && !aiObservations.background.is_lifestyle_scene) {
    checks.push({
      id: 'bg-white',
      name: 'Background RGB Whiteness',
      category: 'background',
      status: 'PASS',
      observed: bgObserved,
      required: 'Pure white background (RGB 255, 255, 255)',
      reason: 'Image background satisfies the pure white threshold requirement.',
      autoFixAvailable: false,
    });
  } else {
    checks.push({
      id: 'bg-white',
      name: 'Background RGB Whiteness',
      category: 'background',
      status: 'AUTO_FIX',
      observed: bgObserved,
      required: 'Pure white background (RGB 255, 255, 255)',
      reason: 'Background contains non-white tones or ambient environment. Amazon main images require pure white (RGB 255,255,255).',
      autoFixAvailable: true,
      fixDescription: 'Apply Cloudinary AI Background Removal (`e_background_removal`) and replace canvas with pure white (`b_rgb:FFFFFF`).',
    });
  }

  // 2. Source Image Resolution vs Delivery Dimensions
  // Amazon zoom threshold: the LONGEST side must reach 1000px.
  // Canvas padding/upscaling does NOT restore source detail — only flag source resolution here.
  const longestSide = Math.max(measurements.width, measurements.height);
  const resObserved = `${measurements.width} × ${measurements.height} px (longest side: ${longestSide}px)`;
  const resRequired = '≥ 1000 px on longest side for Amazon detail page zoom';

  if (longestSide >= 1000) {
    checks.push({
      id: 'resolution-source',
      name: 'Source Image Resolution',
      category: 'resolution',
      status: 'PASS',
      observed: resObserved,
      required: resRequired,
      reason: `Source longest side is ${longestSide}px, which meets the Amazon 1000px zoom threshold.`,
      autoFixAvailable: false,
    });
  } else {
    // Insufficient source resolution -> HUMAN_REVIEW
    // Canvas padding or upscaling does NOT restore lost source detail.
    checks.push({
      id: 'resolution-source',
      name: 'Source Image Resolution',
      category: 'resolution',
      status: 'HUMAN_REVIEW',
      observed: resObserved,
      required: resRequired,
      reason: `Observed Evidence: The longest image side is ${longestSide}px.\n\nReview Reason: This is below the 1000px zoom threshold required by Amazon. Canvas expansion or padding does not restore missing source detail — a higher-resolution source image is required.`,
      autoFixAvailable: false,
      fixDescription: 'Use a higher-resolution source image with the longest side ≥ 1000px.',
    });
  }

  // 3. File Format Standard
  // Note: We verify format via Sharp metadata. Color-space (sRGB ICC profile)
  // is not independently measured — Amazon recommends JPEG as the required format.
  const formatObserved = measurements.fileType;
  const formatRequired = 'JPEG format (Amazon standard)';

  if (measurements.fileType === 'JPEG' || measurements.fileType === 'JPG') {
    checks.push({
      id: 'file-format',
      name: 'File Format Standard',
      category: 'format',
      status: 'PASS',
      observed: formatObserved,
      required: formatRequired,
      reason: 'Image format is JPEG, which meets the Amazon main image format requirement.',
      autoFixAvailable: false,
    });
  } else {
    checks.push({
      id: 'file-format',
      name: 'File Format Standard',
      category: 'format',
      status: 'AUTO_FIX',
      observed: formatObserved,
      required: formatRequired,
      reason: `Image format is ${measurements.fileType}. Amazon requires JPEG format for main images.`,
      autoFixAvailable: true,
      fixDescription: 'Convert to JPEG format with quality optimization (`f_jpg,q_auto`).',
    });
  }

  // 4. Product Framing Coverage
  const framingObserved = `${measurements.foregroundCoveragePercent}% frame area`;
  const framingRequired = 'Product must occupy 85% or more of frame area (≥ 85.0%)';

  if (measurements.foregroundCoveragePercent >= 85.0) {
    checks.push({
      id: 'framing-coverage',
      name: 'Product Framing Coverage',
      category: 'framing',
      status: 'PASS',
      observed: framingObserved,
      required: framingRequired,
      reason: 'Product framing satisfies the ≥85% canvas coverage policy.',
      autoFixAvailable: false,
    });
  } else {
    checks.push({
      id: 'framing-coverage',
      name: 'Product Framing Coverage',
      category: 'framing',
      status: 'AUTO_FIX',
      observed: framingObserved,
      required: framingRequired,
      reason: `Product occupies ~${measurements.foregroundCoveragePercent}% of canvas, leaving excess empty border padding.`,
      autoFixAvailable: true,
      fixDescription: 'Re-center product and adjust canvas padding to achieve 85%+ coverage (`c_pad,w_2000,h_2000,b_white`).',
    });
  }

  // 5. Lifestyle Scene / Environment Context
  // IMPORTANT: A non-white background alone does NOT prove environmental/lifestyle context.
  // Only flag HUMAN_REVIEW when the AI observation provides meaningful evidence of a contextual
  // scene (e.g. people, furniture, outdoor environment, unrelated props, product-in-use).
  // is_lifestyle_scene must be set by the analyzer only on explicit contextual evidence.
  if (aiObservations.background.is_lifestyle_scene) {
    checks.push({
      id: 'lifestyle-scene',
      name: 'Lifestyle & Environmental Context',
      category: 'lifestyle',
      status: 'HUMAN_REVIEW',
      observed: `Observed Evidence: ${aiObservations.background.color_description}`,
      required: 'Main product image must display item alone without environmental context or lifestyle props',
      reason: `Review Reason: The background analysis indicates a potential contextual scene (e.g. people, furniture, props, or environmental setting). Background removal alone may not be sufficient — the transformed image should be manually verified to confirm only the product is visible.`,
      autoFixAvailable: false,
      fixDescription: 'Manually verify the transformed image shows only the product without leftover environment artifacts.',
    });
  } else if (!measurements.isPureWhiteBackground && !aiObservations.background.is_lifestyle_scene) {
    // Non-white background without lifestyle evidence -> AUTO_FIX only (background whiteness check handles this)
    // Do not add a separate lifestyle check. Suppress to PASS with accurate wording.
    checks.push({
      id: 'lifestyle-scene',
      name: 'Lifestyle & Environmental Context',
      category: 'lifestyle',
      status: 'PASS',
      observed: 'No lifestyle or environmental scene evidence detected',
      required: 'No environmental context on main image',
      reason: 'Background color does not constitute evidence of lifestyle context. No people, furniture, props, or environmental scene detected.',
      autoFixAvailable: false,
    });
  } else {
    checks.push({
      id: 'lifestyle-scene',
      name: 'Lifestyle & Environmental Context',
      category: 'lifestyle',
      status: 'PASS',
      observed: 'Studio product framing without environmental context',
      required: 'No environmental context on main image',
      reason: 'Product image appears to be a studio shot without lifestyle context.',
      autoFixAvailable: false,
    });
  }

  // 6. Text & Promotional Badges
  if (aiObservations.text.detected) {
    checks.push({
      id: 'text-overlay',
      name: 'Promotional Text & Badges',
      category: 'text',
      status: 'HUMAN_REVIEW',
      observed: aiObservations.text.description || 'Promotional text or writing observed in AI Caption',
      required: 'No text, logos, or graphic overlays on main product image',
      reason: 'AI Captioning observed text or writing. Amazon policy prohibits promotional text or badges on main images.',
      autoFixAvailable: false,
      fixDescription: 'Inspect original photo and remove external text overlays.',
    });
  } else {
    checks.push({
      id: 'text-overlay',
      name: 'Promotional Text & Badges',
      category: 'text',
      status: 'PASS',
      observed: 'No promotional text observed',
      required: 'No text overlays on main image',
      reason: 'Main image is clear of external text overlays.',
      autoFixAvailable: false,
    });
  }

  // 7. Watermarks & Copyright Markings
  if (aiObservations.watermark.detected) {
    checks.push({
      id: 'watermark-check',
      name: 'Watermarks & Seller Markings',
      category: 'watermark',
      status: 'HUMAN_REVIEW',
      observed: aiObservations.watermark.description || 'Possible watermark or seller text observed in AI Caption',
      required: 'Zero watermarks, logos, or web links',
      reason: 'Possible watermark or copyright text observed. Honest AI policy routes ambiguous watermark cases to seller human review.',
      autoFixAvailable: false,
      fixDescription: 'Human review required to verify absence of watermarks.',
    });
  } else {
    checks.push({
      id: 'watermark-check',
      name: 'Watermarks & Seller Markings',
      category: 'watermark',
      status: 'PASS',
      observed: 'No watermarks observed',
      required: 'Zero watermarks or web links',
      reason: 'No watermark markings detected.',
      autoFixAvailable: false,
    });
  }

  // 8. Product Boundary Cutoff
  if (aiObservations.product.cut_off) {
    checks.push({
      id: 'cutoff-check',
      name: 'Product Boundary Cutoff',
      category: 'cutoff',
      status: 'HUMAN_REVIEW',
      observed: 'Product extends beyond image border in AI Caption observation',
      required: 'Entire product must be fully framed within boundaries',
      reason: 'Product edges appear cropped off at border. Amazon mandates the full item is visible.',
      autoFixAvailable: false,
      fixDescription: 'Re-photograph product so complete item is framed within boundaries.',
    });
  }

  // 9. Multiple Items / Unrelated Props
  if (aiObservations.product.multiple_products || aiObservations.background.has_unrelated_props) {
    checks.push({
      id: 'props-check',
      name: 'Multiple Products & Unrelated Props',
      category: 'props',
      status: 'HUMAN_REVIEW',
      observed: aiObservations.product.multiple_products
        ? 'Multiple distinct product items observed in AI Caption'
        : 'Unrelated props or accessories observed',
      required: 'Main image must show ONLY the exact product for sale',
      reason: 'Multiple products or props observed. Amazon main images must display only the item offered.',
      autoFixAvailable: false,
    });
  }

  // Calculate Summary Counts & Overall Compliance Status
  const passCount = checks.filter((c) => c.status === 'PASS').length;
  const autoFixCount = checks.filter((c) => c.status === 'AUTO_FIX').length;
  const humanReviewCount = checks.filter((c) => c.status === 'HUMAN_REVIEW').length;

  let overallStatus: OverallComplianceStatus = 'READY';

  if (humanReviewCount > 0) {
    // Rule: Any HUMAN_REVIEW issue -> MANUAL_REVIEW_REQUIRED (Never READY_AFTER_FIX)
    overallStatus = 'MANUAL_REVIEW_REQUIRED';
  } else if (autoFixCount > 0) {
    overallStatus = 'FIXES_AVAILABLE';
  }

  return {
    checks,
    summary: {
      passCount,
      autoFixCount,
      humanReviewCount,
      overallStatus,
    },
    measurements,
    aiObservations,
    assetUrl,
    publicId,
  };
}
