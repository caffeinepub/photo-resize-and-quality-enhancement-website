import { useState, useCallback, useEffect } from 'react';
import ImageDropzone from './components/ImageDropzone';
import ResizeControls from './components/ResizeControls';
import EnhancementControls from './components/EnhancementControls';
import ExportControls from './components/ExportControls';
import ImagePreview from './components/ImagePreview';
import { processImage } from './lib/imageProcessing';
import type { ImageMetadata, ProcessingParams } from './lib/types';
import { SiCoffeescript } from 'react-icons/si';

function App() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [processingParams, setProcessingParams] = useState<ProcessingParams>({
    width: 0,
    height: 0,
    maintainAspect: true,
    resizeMode: 'contain',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpen: 0,
    smoothing: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback((image: HTMLImageElement, meta: ImageMetadata) => {
    setOriginalImage(image);
    setMetadata(meta);
    setProcessingParams({
      width: meta.width,
      height: meta.height,
      maintainAspect: true,
      resizeMode: 'contain',
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpen: 0,
      smoothing: 0,
    });
    // Initial render
    const canvas = document.createElement('canvas');
    canvas.width = meta.width;
    canvas.height = meta.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      setProcessedCanvas(canvas);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (originalImage && metadata) {
      setProcessingParams({
        width: metadata.width,
        height: metadata.height,
        maintainAspect: true,
        resizeMode: 'contain',
        brightness: 0,
        contrast: 0,
        saturation: 0,
        sharpen: 0,
        smoothing: 0,
      });
      // Reset to original
      const canvas = document.createElement('canvas');
      canvas.width = metadata.width;
      canvas.height = metadata.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(originalImage, 0, 0);
        setProcessedCanvas(canvas);
      }
    }
  }, [originalImage, metadata]);

  const applyProcessing = useCallback(async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    try {
      const canvas = await processImage(originalImage, processingParams);
      setProcessedCanvas(canvas);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, processingParams]);

  const updateParams = useCallback((updates: Partial<ProcessingParams>) => {
    setProcessingParams(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/bg-texture.dim_1600x900.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '800px 450px',
        }}
      />
      
      {/* Header */}
      <header className="relative border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/logo-photo-resizer.dim_512x512.png" 
              alt="Photo Resizer" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Photo Resizer</h1>
              <p className="text-xs text-muted-foreground">Resize & enhance your images</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative container mx-auto px-4 py-8">
        {!originalImage ? (
          <div className="max-w-2xl mx-auto">
            <ImageDropzone onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Preview area */}
            <div className="space-y-4">
              <ImagePreview 
                canvas={processedCanvas} 
                metadata={metadata}
                isProcessing={isProcessing}
              />
            </div>

            {/* Controls sidebar */}
            <div className="space-y-4">
              <ResizeControls
                params={processingParams}
                originalWidth={metadata?.width || 0}
                originalHeight={metadata?.height || 0}
                onParamsChange={updateParams}
                onApply={applyProcessing}
                isProcessing={isProcessing}
              />

              <EnhancementControls
                params={processingParams}
                onParamsChange={updateParams}
                onApply={applyProcessing}
                onReset={handleReset}
                isProcessing={isProcessing}
              />

              <ExportControls
                canvas={processedCanvas}
                originalFilename={metadata?.filename || 'image'}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Photo Resizer. All processing happens in your browser.</p>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'photo-resizer')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              Built with <SiCoffeescript className="w-4 h-4 text-amber-600" /> using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
