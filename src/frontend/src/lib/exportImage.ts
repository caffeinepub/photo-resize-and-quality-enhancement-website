export function exportImage(
  canvas: HTMLCanvasElement,
  originalFilename: string,
  format: 'png' | 'jpeg',
  quality: number
): void {
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const qualityValue = format === 'jpeg' ? quality / 100 : 1;

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        console.error('Failed to create blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename
      const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
      const extension = format === 'png' ? 'png' : 'jpg';
      link.download = `${nameWithoutExt}-processed.${extension}`;
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    mimeType,
    qualityValue
  );
}
