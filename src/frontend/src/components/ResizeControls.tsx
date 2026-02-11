import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Link, Unlink } from 'lucide-react';
import type { ProcessingParams } from '../lib/types';

interface ResizeControlsProps {
  params: ProcessingParams;
  originalWidth: number;
  originalHeight: number;
  onParamsChange: (updates: Partial<ProcessingParams>) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export default function ResizeControls({
  params,
  originalWidth,
  originalHeight,
  onParamsChange,
  onApply,
  isProcessing,
}: ResizeControlsProps) {
  const [localWidth, setLocalWidth] = useState(params.width.toString());
  const [localHeight, setLocalHeight] = useState(params.height.toString());

  useEffect(() => {
    setLocalWidth(params.width.toString());
    setLocalHeight(params.height.toString());
  }, [params.width, params.height]);

  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = useCallback((value: string) => {
    setLocalWidth(value);
    const numValue = parseInt(value) || 0;
    
    if (params.maintainAspect && numValue > 0) {
      const newHeight = Math.round(numValue / aspectRatio);
      setLocalHeight(newHeight.toString());
      onParamsChange({ width: numValue, height: newHeight });
    } else {
      onParamsChange({ width: numValue });
    }
  }, [params.maintainAspect, aspectRatio, onParamsChange]);

  const handleHeightChange = useCallback((value: string) => {
    setLocalHeight(value);
    const numValue = parseInt(value) || 0;
    
    if (params.maintainAspect && numValue > 0) {
      const newWidth = Math.round(numValue * aspectRatio);
      setLocalWidth(newWidth.toString());
      onParamsChange({ height: numValue, width: newWidth });
    } else {
      onParamsChange({ height: numValue });
    }
  }, [params.maintainAspect, aspectRatio, onParamsChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Maximize2 className="w-4 h-4" />
          Resize Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              min="1"
              value={localWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              min="1"
              value={localHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="aspect-lock" className="flex items-center gap-2 cursor-pointer">
            {params.maintainAspect ? (
              <Link className="w-4 h-4 text-primary" />
            ) : (
              <Unlink className="w-4 h-4 text-muted-foreground" />
            )}
            Lock aspect ratio
          </Label>
          <Switch
            id="aspect-lock"
            checked={params.maintainAspect}
            onCheckedChange={(checked) => onParamsChange({ maintainAspect: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resize-mode">Resize mode</Label>
          <Select
            value={params.resizeMode}
            onValueChange={(value: 'contain' | 'cover') => onParamsChange({ resizeMode: value })}
          >
            <SelectTrigger id="resize-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contain">Contain (fit inside)</SelectItem>
              <SelectItem value="cover">Cover (fill area)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onApply} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Apply Resize'}
        </Button>
      </CardContent>
    </Card>
  );
}
