import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { exportImage } from '../lib/exportImage';

interface ExportControlsProps {
  canvas: HTMLCanvasElement | null;
  originalFilename: string;
}

export default function ExportControls({ canvas, originalFilename }: ExportControlsProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('jpeg');
  const [quality, setQuality] = useState(90);

  const handleDownload = () => {
    if (!canvas) return;
    exportImage(canvas, originalFilename, format, quality);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="w-4 h-4" />
          Export Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select value={format} onValueChange={(value: 'png' | 'jpeg') => setFormat(value)}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (lossless)</SelectItem>
              <SelectItem value="jpeg">JPEG (compressed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {format === 'jpeg' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-xs text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              id="quality"
              min={1}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
            />
          </div>
        )}

        <Button 
          onClick={handleDownload} 
          disabled={!canvas}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
      </CardContent>
    </Card>
  );
}
