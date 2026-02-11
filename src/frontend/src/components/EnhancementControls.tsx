import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import type { ProcessingParams } from '../lib/types';

interface EnhancementControlsProps {
  params: ProcessingParams;
  onParamsChange: (updates: Partial<ProcessingParams>) => void;
  onApply: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export default function EnhancementControls({
  params,
  onParamsChange,
  onApply,
  onReset,
  isProcessing,
}: EnhancementControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-4 h-4" />
          Enhance Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brightness">Brightness</Label>
            <span className="text-xs text-muted-foreground">{params.brightness}</span>
          </div>
          <Slider
            id="brightness"
            min={-100}
            max={100}
            step={1}
            value={[params.brightness]}
            onValueChange={([value]) => onParamsChange({ brightness: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">Contrast</Label>
            <span className="text-xs text-muted-foreground">{params.contrast}</span>
          </div>
          <Slider
            id="contrast"
            min={-100}
            max={100}
            step={1}
            value={[params.contrast]}
            onValueChange={([value]) => onParamsChange({ contrast: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation">Saturation</Label>
            <span className="text-xs text-muted-foreground">{params.saturation}</span>
          </div>
          <Slider
            id="saturation"
            min={-100}
            max={100}
            step={1}
            value={[params.saturation]}
            onValueChange={([value]) => onParamsChange({ saturation: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sharpen">Sharpen</Label>
            <span className="text-xs text-muted-foreground">{params.sharpen}</span>
          </div>
          <Slider
            id="sharpen"
            min={0}
            max={100}
            step={1}
            value={[params.sharpen]}
            onValueChange={([value]) => onParamsChange({ sharpen: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="smoothing">Smoothing</Label>
            <span className="text-xs text-muted-foreground">{params.smoothing}</span>
          </div>
          <Slider
            id="smoothing"
            min={0}
            max={100}
            step={1}
            value={[params.smoothing]}
            onValueChange={([value]) => onParamsChange({ smoothing: value })}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onApply} 
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : 'Apply'}
          </Button>
          <Button 
            onClick={onReset} 
            disabled={isProcessing}
            variant="outline"
            size="icon"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
