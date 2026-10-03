export type ComplianceStatus = 'PASS' | 'AUTO_FIX' | 'HUMAN_REVIEW';

export interface AICaptionObservation {
  product: {
    identifiable: boolean;
    multiple_products: boolean;
    obscured: boolean;
    cut_off: boolean;
    category_hint?: string;
    description: string;
  };
  background: {
    is_pure_white: boolean;
    is_lifestyle_scene: boolean;
    has_unrelated_props: boolean;
    color_description: string;
  };
  text: {
    detected: boolean;
    description?: string;
  };
  logo: {
    detected: boolean;
    description?: string;
  };
  watermark: {
    detected: boolean;
    confidence: number;
    description?: string;
  };
  presentation: {
    quality_score: number; // 0 to 100
    is_blur: boolean;
    is_pixelated: boolean;
    is_compression_artifacted: boolean;
    framing_coverage_percent?: number; // 0 to 100
  };
  image_type: {
    is_main_product_shot: boolean;
    is_graphic_drawing: boolean;
  };
  human_review?: {
    needed: boolean;
    reasons: string[];
  };
}

export interface ImageMeasurements {
  width: number;
  height: number;
  aspectRatio: number;
  fileSizeBytes: number;
  fileType: string;
  isPureWhiteBackground: boolean;
  backgroundRgb: { r: number; g: number; b: number };
  whitePixelRatio: number; // 0 to 1
  foregroundCoveragePercent: number; // 0 to 100
}

export interface ComplianceCheck {
  id: string;
  name: string;
  category: 'background' | 'resolution' | 'format' | 'framing' | 'text' | 'watermark' | 'props' | 'quality' | 'cutoff' | 'lifestyle';
  status: ComplianceStatus;
  observed: string;
  required: string;
  reason: string;
  confidence?: number;
  autoFixAvailable: boolean;
  fixDescription?: string;
}

export type OverallComplianceStatus = 'READY' | 'FIXES_AVAILABLE' | 'MANUAL_REVIEW_REQUIRED' | 'NOT_READY';

export interface ComplianceSummary {
  passCount: number;
  autoFixCount: number;
  humanReviewCount: number;
  overallStatus: OverallComplianceStatus;
}

export interface ComplianceResult {
  checks: ComplianceCheck[];
  summary: ComplianceSummary;
  measurements: ImageMeasurements;
  aiObservations: AICaptionObservation;
  assetUrl: string;
  publicId?: string;
}

export interface TransformationResult {
  originalUrl: string;
  transformedUrl: string | null;
  status: 'pending' | 'success' | 'failed';
  appliedFixes: string[];
  cloudinaryTransformations: string[];
  original: {
    width: number;
    height: number;
    bytes?: number;
    hash?: string;
  };
  transformed?: {
    width?: number;
    height?: number;
    bytes?: number;
    hash?: string;
  };
  error?: string;
  isAmazonCompliant?: boolean;
  format?: string;
  dimensions?: { width: number; height: number };
  fileSizeEst?: string;
}

export type MarketplaceId = 'amazon' | 'etsy' | 'shopify' | 'meesho';

export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  logoText: string;
  isSupported: boolean;
  minWidth: number;
  minHeight: number;
  recommendedWidth: number;
  recommendedHeight: number;
  requiresPureWhiteBg: boolean;
}
