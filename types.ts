
export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppConfig {
  productImageArea: Rect;
  productNamePosition: Position;
  itemNumberPosition: Position;
  productNameFontSize: number;
  itemNumberFontSize: number;
}
