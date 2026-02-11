import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { ImageMetadata } from '../lib/types';
import { useEffect, useState } from 'react';

interface ImagePreviewProps {
  canvas: HTMLCanvasElement | null;
  metadata: ImageMetadata | null;
  isProcessing: boolean;
}

export default function ImagePreview({ canvas, metadata, isProcessing }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (canvas) {
      const url = canvas.toDataURL();
      setPreviewUrl(url);
    }
  }, [canvas]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-muted/20 min-h-[400px] flex items-center justify-center">
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing image...</p>
              </div>
            </div>
          )}
          
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[600px] object-contain"
            />
          )}
        </div>

        {metadata && canvas && (
          <div className="p-4 border-t border-border/40 bg-card/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Filename</p>
                <p className="font-medium truncate">{metadata.filename}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Dimensions</p>
                <p className="font-medium">{canvas.width} × {canvas.height}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Original Size</p>
                <p className="font-medium">{formatFileSize(metadata.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Format</p>
                <p className="font-medium uppercase">{metadata.type.split('/')[1]}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
