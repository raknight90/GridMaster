"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ImageUpload } from "./ImageUpload";
import { GridControls } from "./GridControls";
import { GridCanvas } from "./GridCanvas";
import { GridExporter } from "./GridExporter";

export const GridMasterApp = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#ffffff"); // Default white for dark theme
  const [lineOpacity, setLineOpacity] = useState(100);
  const [labelColor, setLabelColor] = useState("#ffffff"); // New state for label color
  const [showRowNumbers, setShowRowNumbers] = useState(false);
  const [showColNumbers, setShowColNumbers] = useState(false);
  const [showDiagonalLines, setShowDiagonalLines] = useState(false);
  const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [triggerExport, setTriggerExport] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const resetGridSettings = useCallback(() => {
    setRows(10);
    setCols(10);
    setLineThickness(2);
    setLineColor("#ffffff");
    setLineOpacity(100);
    setLabelColor("#ffffff"); // Reset label color
    setShowRowNumbers(false);
    setShowColNumbers(false);
    setShowDiagonalLines(false);
    setGridPosition({ x: 0, y: 0 });
    setZoomLevel(100);
    setShowImage(true);
  }, []);

  const resetGridPosition = useCallback(() => {
    setGridPosition({ x: 0, y: 0 });
  }, []);

  const handleExport = () => {
    if (imageSrc) {
      setTriggerExport(true);
    }
  };

  const handleExportComplete = () => {
    setTriggerExport(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">
      <Card className="w-full max-w-6xl bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">GridMaster</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 space-y-6">
            <ImageUpload onImageUpload={setImageSrc} />
            <GridControls
              rows={rows}
              setRows={setRows}
              cols={cols}
              setCols={setCols}
              lineThickness={lineThickness}
              setLineThickness={setLineThickness}
              lineColor={lineColor}
              setLineColor={setLineColor}
              lineOpacity={lineOpacity}
              setLineOpacity={setLineOpacity}
              labelColor={labelColor} // Pass labelColor
              setLabelColor={setLabelColor} // Pass setLabelColor
              showRowNumbers={showRowNumbers}
              setShowRowNumbers={setShowRowNumbers}
              showColNumbers={showColNumbers}
              setShowColNumbers={setShowColNumbers}
              showDiagonalLines={showDiagonalLines}
              setShowDiagonalLines={setShowDiagonalLines}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onReset={resetGridSettings}
              onResetGridPosition={resetGridPosition} // Pass resetGridPosition
              onExport={handleExport}
              imageSrc={imageSrc}
              showImage={showImage}
              setShowImage={setShowImage}
            />
          </div>
          <div className="lg:w-2/3 relative min-h-[400px] border border-border rounded-md overflow-hidden flex items-center justify-center bg-muted">
            {imageSrc ? (
              <GridCanvas
                imageSrc={imageSrc}
                rows={rows}
                cols={cols}
                lineThickness={lineThickness}
                lineColor={lineColor}
                lineOpacity={lineOpacity}
                labelColor={labelColor} // Pass labelColor
                showRowNumbers={showRowNumbers}
                showColNumbers={showColNumbers}
                showDiagonalLines={showDiagonalLines}
                gridPosition={gridPosition}
                setGridPosition={setGridPosition}
                zoomLevel={zoomLevel}
                showImage={showImage}
              />
            ) : (
              <p className="text-muted-foreground">Upload an image to get started!</p>
            )}
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
      <GridExporter
        imageSrc={imageSrc}
        rows={rows}
        cols={cols}
        lineThickness={lineThickness}
        lineColor={lineColor}
        lineOpacity={lineOpacity}
        labelColor={labelColor} // Pass labelColor
        showRowNumbers={showRowNumbers}
        showColNumbers={showColNumbers}
        showDiagonalLines={showDiagonalLines}
        gridPosition={gridPosition}
        zoomLevel={zoomLevel}
        triggerExport={triggerExport}
        onExportComplete={handleExportComplete}
      />
    </div>
  );
};