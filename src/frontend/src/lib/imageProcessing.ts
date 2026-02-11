import type { ProcessingParams } from './types';

export async function processImage(
  sourceImage: HTMLImageElement,
  params: ProcessingParams
): Promise<HTMLCanvasElement> {
  // Step 1: Resize
  const resizedCanvas = resizeImage(sourceImage, params);
  
  // Step 2: Apply enhancements
  const enhancedCanvas = applyEnhancements(resizedCanvas, params);
  
  return enhancedCanvas;
}

function resizeImage(
  sourceImage: HTMLImageElement,
  params: ProcessingParams
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) throw new Error('Could not get canvas context');

  const targetWidth = params.width;
  const targetHeight = params.height;
  
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  if (params.resizeMode === 'contain') {
    // Fit image inside target dimensions, maintaining aspect ratio
    const sourceRatio = sourceImage.width / sourceImage.height;
    const targetRatio = targetWidth / targetHeight;
    
    let drawWidth = targetWidth;
    let drawHeight = targetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceRatio > targetRatio) {
      // Image is wider than target
      drawHeight = targetWidth / sourceRatio;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      // Image is taller than target
      drawWidth = targetHeight * sourceRatio;
      offsetX = (targetWidth - drawWidth) / 2;
    }

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(sourceImage, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    // Cover - fill entire target area, crop if needed
    const sourceRatio = sourceImage.width / sourceImage.height;
    const targetRatio = targetWidth / targetHeight;
    
    let drawWidth = targetWidth;
    let drawHeight = targetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceRatio > targetRatio) {
      // Image is wider - crop sides
      drawWidth = targetHeight * sourceRatio;
      offsetX = (targetWidth - drawWidth) / 2;
    } else {
      // Image is taller - crop top/bottom
      drawHeight = targetWidth / sourceRatio;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    ctx.drawImage(sourceImage, offsetX, offsetY, drawWidth, drawHeight);
  }

  return canvas;
}

function applyEnhancements(
  sourceCanvas: HTMLCanvasElement,
  params: ProcessingParams
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(sourceCanvas, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply brightness, contrast, saturation
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    if (params.brightness !== 0) {
      const brightnessFactor = params.brightness * 2.55;
      r += brightnessFactor;
      g += brightnessFactor;
      b += brightnessFactor;
    }

    // Contrast
    if (params.contrast !== 0) {
      const contrastFactor = (259 * (params.contrast + 255)) / (255 * (259 - params.contrast));
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // Saturation
    if (params.saturation !== 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = 1 + params.saturation / 100;
      r = gray + saturationFactor * (r - gray);
      g = gray + saturationFactor * (g - gray);
      b = gray + saturationFactor * (b - gray);
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);

  // Apply sharpen
  if (params.sharpen > 0) {
    applySharpen(ctx, canvas.width, canvas.height, params.sharpen / 100);
  }

  // Apply smoothing
  if (params.smoothing > 0) {
    applySmoothing(ctx, canvas.width, canvas.height, params.smoothing / 100);
  }

  return canvas;
}

function applySharpen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);

  const kernel = [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0
  ];

  applyConvolution(data, output, width, height, kernel);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }

  ctx.putImageData(imageData, 0, 0);
}

function applySmoothing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);

  const kernelSize = 1 / 9;
  const kernel = [
    kernelSize * amount, kernelSize * amount, kernelSize * amount,
    kernelSize * amount, 1 - 8 * kernelSize * amount, kernelSize * amount,
    kernelSize * amount, kernelSize * amount, kernelSize * amount
  ];

  applyConvolution(data, output, width, height, kernel);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyConvolution(
  input: Uint8ClampedArray,
  output: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: number[]
) {
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            sum += input[idx] * kernel[kernelIdx];
          }
        }
        const outputIdx = (y * width + x) * 4 + c;
        output[outputIdx] = Math.max(0, Math.min(255, sum));
      }
    }
  }
}
