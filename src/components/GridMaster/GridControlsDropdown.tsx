"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";

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
  labelColor: string;
  setLabelColor: (color: string) => void;
  showRowNumbers: boolean;
  setShowRowNumbers: (show: boolean) => void;
  showColNumbers: boolean;
  setShowColNumbers: (show: boolean) => void;
  showDiagonalLines: boolean;
  setShowDiagonalLines: (show: boolean) => void;
  diagonalLineOpacity: number;
  setDiagonalLineOpacity: (opacity: number) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  onReset: () => void;
  onExport: () => void;
  imageSrc: string | null;
  showImage: boolean;
  setShowImage: (show: boolean) => void;
  onFitImage: () => void;
  onCenterImage: () => void;
  imageOffsetX: number;
  setImageOffsetX: (offset: number) => void;
  imageOffsetY: number;
  setImageOffsetY: (offset: number) => void;
  minOffsetX: number;
  maxOffsetX: number;
  minOffsetY: number;
  maxOffsetY: number;
}

export const GridControlsDropdown = ({
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
  labelColor,
  setLabelColor,
  showRowNumbers,
  setShowRowNumbers,
  showColNumbers,
  setShowColNumbers,
  showDiagonalLines,
  setShowDiagonalLines,
  diagonalLineOpacity,
  setDiagonalLineOpacity,
  zoomLevel,
  setZoomLevel,
  onReset,
  onExport,
  imageSrc,
  showImage,
  setShowImage,
  onFitImage,
  onCenterImage,
  imageOffsetX,
  setImageOffsetX,
  imageOffsetY,
  setImageOffsetY,
  minOffsetX,
  maxOffsetX,
  minOffsetY,
  maxOffsetY,
}: GridControlsProps) => {
  const isImageLoaded = !!imageSrc;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Controls
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4 bg-card/60 backdrop-blur-sm" align="start"> {/* Changed to bg-card/60 */}
        <DropdownMenuLabel>Grid Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
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
            {showDiagonalLines && (
              <div className="space-y-2">
                <Label htmlFor="diagonal-line-opacity-slider">Diagonal Line Opacity: {diagonalLineOpacity}%</Label>
                <Slider
                  id="diagonal-line-opacity-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[diagonalLineOpacity]}
                  onValueChange={(val) => setDiagonalLineOpacity(val[0])}
                />
              </div>
            )}
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

            {isImageLoaded && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="image-offset-x-slider">Image X Offset: {imageOffsetX}px</Label>
                  <Slider
                    id="image-offset-x-slider"
                    min={minOffsetX}
                    max={maxOffsetX}
                    step={1}
                    value={[imageOffsetX]}
                    onValueChange={(val) => setImageOffsetX(val[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-offset-y-slider">Image Y Offset: {imageOffsetY}px</Label>
                  <Slider
                    id="image-offset-y-slider"
                    min={minOffsetY}
                    max={maxOffsetY}
                    step={1}
                    value={[imageOffsetY]}
                    onValueChange={(val) => setImageOffsetY(val[0])}
                  />
                </div>
              </>
            )}

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
            <Button onClick={onFitImage} className="w-full mt-2" disabled={!isImageLoaded}>
              Fit Image to Canvas
            </Button>
            <Button onClick={onCenterImage} className="w-full mt-2" disabled={!isImageLoaded}>
              Center Image on Canvas
            </Button>
            <Button onClick={onReset} className="w-full mt-2">
              Reset All Settings
            </Button>
            <Button onClick={onExport} className="w-full mt-2" disabled={!isImageLoaded}>
              Export Image
            </Button>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};