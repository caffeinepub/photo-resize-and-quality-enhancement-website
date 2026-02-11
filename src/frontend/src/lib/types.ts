export interface ImageMetadata {
  filename: string;
  size: number;
  type: string;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export interface ProcessingParams {
  width: number;
  height: number;
  maintainAspect: boolean;
  resizeMode: 'contain' | 'cover';
  brightness: number;
  contrast: number;
  saturation: number;
  sharpen: number;
  smoothing: number;
}
