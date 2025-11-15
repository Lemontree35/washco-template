
import { AppConfig } from './types';

// A4 landscape aspect ratio is 1.414, often simplified to 16:11 or similar for screens.
// For web display, using a resolution like 1122x794 pixels (96 DPI for A4) is reasonable.
export const CANVAS_WIDTH = 1122;
export const CANVAS_HEIGHT = 794;

export const DEFAULT_APP_CONFIG: AppConfig = {
  productImageArea: { x: 300, y: 150, width: 500, height: 400 }, // Centered roughly
  productNamePosition: { x: 100, y: 100 },
  itemNumberPosition: { x: 100, y: 650 },
  productNameFontSize: 36,
  itemNumberFontSize: 24,
};

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 72;
