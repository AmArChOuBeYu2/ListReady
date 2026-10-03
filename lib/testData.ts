export interface SampleImage {
  id: string;
  categoryNumber: number;
  name: string;
  description: string;
  url: string;
  presetScenario: string;
  expectedStatus: 'READY' | 'FIXES_AVAILABLE' | 'MANUAL_REVIEW_REQUIRED' | 'NOT_READY';
}

export const SAMPLE_TEST_IMAGES: SampleImage[] = [
  {
    id: 'sample-1',
    categoryNumber: 1,
    name: '1. Truly Compliant White-BG Product',
    description: 'White sneaker on genuine pure white studio background, high resolution, single product',
    url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&q=80',
    presetScenario: 'compliant',
    expectedStatus: 'READY',
  },
  {
    id: 'sample-2',
    categoryNumber: 2,
    name: '2. Clearly Colored Background',
    description: 'Red sneaker photo on solid red background requiring background removal',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
    presetScenario: 'non_white_bg',
    expectedStatus: 'FIXES_AVAILABLE',
  },
  {
    id: 'sample-3',
    categoryNumber: 3,
    name: '3. Beige/Gray Near-White Background',
    description: 'Over-ear headphones photo on off-white background requiring whiteness correction',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
    presetScenario: 'non_white_bg',
    expectedStatus: 'FIXES_AVAILABLE',
  },
  {
    id: 'sample-4',
    categoryNumber: 4,
    name: '4. Source Resolution Below Threshold',
    description: 'Small 400x267px product photo below 1000px minimum zoom threshold',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    presetScenario: 'low_res',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-5',
    categoryNumber: 5,
    name: '5. Visible External Text',
    description: 'Skincare product photo with external brand overlay text',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
    presetScenario: 'text_detected',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-6',
    categoryNumber: 6,
    name: '6. Possible Watermark',
    description: 'Product photo with possible seller watermark or copyright marking',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80',
    presetScenario: 'watermark_detected',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-7',
    categoryNumber: 7,
    name: '7. Lifestyle/Context Scene',
    description: 'Shoe shot in environmental lifestyle context requiring human review',
    url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80',
    presetScenario: 'lifestyle',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-8',
    categoryNumber: 8,
    name: '8. Multiple Products',
    description: 'Photo displaying two distinct product items in single shot',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80',
    presetScenario: 'multiple_products',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-9',
    categoryNumber: 9,
    name: '9. Low-Quality Image',
    description: '300x200px low-resolution camera shot below minimum source quality',
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=50',
    presetScenario: 'low_res',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
  {
    id: 'sample-10',
    categoryNumber: 10,
    name: '10. Product Cut Off',
    description: 'Coffee mug photo where handle extends beyond image boundaries',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80',
    presetScenario: 'cut_off_product',
    expectedStatus: 'MANUAL_REVIEW_REQUIRED',
  },
];
