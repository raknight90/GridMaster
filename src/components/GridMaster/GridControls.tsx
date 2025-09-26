"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface GridControlsProps {
  rows: number;
  setRows: (rows: number) => void;
  cols: number;
  setCols: (cols: number) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  showRowNumbers: boolean;
  setShowRowNumbers: (show: boolean) => void;
  showColNumbers: boolean;
  setShowColNumbers: (show: boolean) => void;
  showDiagonalLines: boolean;
  setShowDiagonalLines: (show: boolean) => void;
  zoomLevel: number; // New prop for zoom level
  setZoomLevel: (zoom: number) => void; // New prop for setting zoom level
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
  showRowNumbers,
  setShowRowNumbers,
  showColNumbers,
  setShowColNumbers,
  showDiagonalLines,
  setShowDiagonalLines,
  zoomLevel,
  setZoomLevel,
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
          <Label htmlFor="show-col-numbers">Show Column Numbers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-diagonal-lines"
            checked={showDiagonalLines}
            onCheckedChange={(checked) => setShowDiagonalLines(checked as boolean)}
          />
          <Label htmlFor="show-diagonal-lines">Show Diagonal Lines</Label>
        </div>
      </CardContent>
    </Card>
  );
};