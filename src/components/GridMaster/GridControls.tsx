"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface GridControlsProps {
  rows: number;
  setRows: (rows: number) => void;
  cols: number;
  setCols: (cols: number) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineOpacity: number;
  setLineOpacity: (opacity: number) => void;
  labelColor: string; // New prop for label color
  setLabelColor: (color: string) => void; // New prop for setting label color
  showRowNumbers: boolean;
  setShowRowNumbers: (show: boolean) => void;
  showColNumbers: boolean;
  setShowColNumbers: (show: boolean) => void;
  showDiagonalLines: boolean;
  setShowDiagonalLines: (show: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  onReset: () => void;
  onResetGridPosition: () => void; // New prop for resetting grid position
  onExport: () => void;
  imageSrc: string | null;
  showImage: boolean;
  setShowImage: (show: boolean) => void;
}

export const GridControls = ({
  rows,
  setRows,
  cols,
  setCols,
  lineThickness,
  setLineThickness,
  lineColor,
  setLineColor,
  lineOpacity,
  setLineOpacity,
  labelColor, // Destructure labelColor
  setLabelColor, // Destructure setLabelColor
  showRowNumbers,
  setShowRowNumbers,
  showColNumbers,
  setShowColNumbers,
  showDiagonalLines,
  setShowDiagonalLines,
  zoomLevel,
  setZoomLevel,
  onReset,
  onResetGridPosition, // Destructure onResetGridPosition
  onExport,
  imageSrc,
  showImage,
  setShowImage,
}: GridControlsProps) => {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl">Grid Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rows-slider">Rows: {rows}</Label>
          <Slider
            id="rows-slider"
            min={1}
            max={50}
            step={1}
            value={[rows]}
            onValueChange={(val) => setRows(val[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cols-slider">Columns: {cols}</Label>
          <Slider
            id="cols-slider"
            min={1}
            max={50}
            step={1}
            value={[cols]}
            onValueChange={(val) => setCols(val[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thickness-slider">Line Thickness: {lineThickness}px</Label>
          <Slider
            id="thickness-slider"
            min={1}
            max={10}
            step={1}
            value={[lineThickness]}
            onValueChange={(val) => setLineThickness(val[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line-color">Line Color</Label>
          <Input
            id="line-color"
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="h-10 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line-opacity-slider">Line Opacity: {lineOpacity}%</Label>
          <Slider
            id="line-opacity-slider"
            min={0}
            max={100}
            step={1}
            value={[lineOpacity]}
            onValueChange={(val) => setLineOpacity(val[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="label-color">Label Color</Label>
          <Input
            id="label-color"
            type="color"
            value={labelColor}
            onChange={(e) => setLabelColor(e.target.value)}
            className="h-10 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zoom-slider">Zoom: {zoomLevel}%</Label>
          <Slider
            id="zoom-slider"
            min={50}
            max={300}
            step={10}
            value={[zoomLevel]}
            onValueChange={(val) => setZoomLevel(val[0])}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-row-numbers"
            checked={showRowNumbers}
            onCheckedChange={(checked) => setShowRowNumbers(checked as boolean)}
          />
          <Label htmlFor="show-row-numbers">Show Row Numbers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-col-numbers"
            checked={showColNumbers}
            onCheckedChange={(checked) => setShowColNumbers(checked as boolean)}
          />
          <Label htmlFor="show-col-numbers">Show Column Letters</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-diagonal-lines"
            checked={showDiagonalLines}
            onCheckedChange={(checked) => setShowDiagonalLines(checked as boolean)}
          />
          <Label htmlFor="show-diagonal-lines">Show Diagonal Lines</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-image"
            checked={showImage}
            onCheckedChange={(checked) => setShowImage(checked as boolean)}
          />
          <Label htmlFor="show-image">Show Image</Label>
        </div>
        <Button onClick={onResetGridPosition} className="w-full mt-4">
          Reset Grid Position
        </Button>
        <Button onClick={onReset} className="w-full mt-2">
          Reset All Settings
        </Button>
        <Button onClick={onExport} className="w-full mt-2" disabled={!imageSrc}>
          Export Image
        </Button>
      </CardContent>
    </Card>
  );
};