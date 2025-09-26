"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ImageUpload } from "./ImageUpload";
import { GridControls } from "./GridControls";
import { GridCanvas } from "./GridCanvas";
import { GridExporter } from "./GridExporter";
import GridMasterIcon from "/gridmaster-icon.png"; // Import the icon

export const GridMasterApp = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });
  const [canvasContainerDimensions, setCanvasContainerDimensions] = useState({ width: 0, height: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#ffffff"); // Default white for dark theme
  const [lineOpacity, setLineOpacity] = useState(100);
  const [labelColor, setLabelColor] = useState("#ffffff");
  const [showRowNumbers, setShowRowNumbers] = useState(false);
  const [showColNumbers, setShowColNumbers] = useState(false);
  const [showDiagonalLines, setShowDiagonalLines] = useState(false);
  const [diagonalLineOpacity, setDiagonalLineOpacity] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 }); // New state for image position
  const [triggerExport, setTriggerExport] = useState(false);
  const [showImage, setShowImage] = useState(true);

  // Effect to get canvas container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasContainerRef.current) {
        setCanvasContainerDimensions({
          width: canvasContainerRef.current.offsetWidth,
          height: canvasContainerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Effect to load image and set original dimensions
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setOriginalImageDimensions({ width: img.width, height: img.height });
        // Reset offset and zoom when new image is loaded
        setImageOffset({ x: 0, y: 0 });
        setZoomLevel(100);
      };
    } else {
      setOriginalImageDimensions({ width: 0, height: 0 });
    }
  }, [imageSrc]);

  const resetGridSettings = useCallback(() => {
    setRows(10);
    setCols(10);
    setLineThickness(2);
    setLineColor("#ffffff");
    setLineOpacity(100);
    setLabelColor("#ffffff");
    setShowRowNumbers(false);
    setShowColNumbers(false);
    setShowDiagonalLines(false);
    setDiagonalLineOpacity(50);
    setZoomLevel(100);
    setImageOffset({ x: 0, y: 0 }); // Reset image offset
    setShowImage(true);
  }, []);

  const handleFitImageToCanvas = useCallback(() => {
    if (!imageSrc || originalImageDimensions.width === 0 || canvasContainerDimensions.width === 0) return;

    const imageRatio = originalImageDimensions.width / originalImageDimensions.height;
    const canvasRatio = canvasContainerDimensions.width / canvasContainerDimensions.height;

    let newZoomLevel;
    let scaledWidth;
    let scaledHeight;

    if (imageRatio > canvasRatio) {
      // Image is wider than canvas, fit by width
      scaledWidth = canvasContainerDimensions.width;
      scaledHeight = scaledWidth / imageRatio;
      newZoomLevel = (scaledWidth / originalImageDimensions.width) * 100;
    } else {
      // Image is taller than canvas, fit by height
      scaledHeight = canvasContainerDimensions.height;
      scaledWidth = scaledHeight * imageRatio;
      newZoomLevel = (scaledHeight / originalImageDimensions.height) * 100;
    }

    setZoomLevel(newZoomLevel);
    setImageOffset({
      x: (canvasContainerDimensions.width - scaledWidth) / 2,
      y: (canvasContainerDimensions.height - scaledHeight) / 2,
    });
  }, [imageSrc, originalImageDimensions, canvasContainerDimensions]);

  const handleCenterImageOnCanvas = useCallback(() => {
    if (!imageSrc || originalImageDimensions.width === 0 || canvasContainerDimensions.width === 0) return;

    const zoomFactor = zoomLevel / 100;
    const currentImageWidth = originalImageDimensions.width * zoomFactor;
    const currentImageHeight = originalImageDimensions.height * zoomFactor;

    setImageOffset({
      x: (canvasContainerDimensions.width - currentImageWidth) / 2,
      y: (canvasContainerDimensions.height - currentImageHeight) / 2,
    });
  }, [imageSrc, originalImageDimensions, canvasContainerDimensions, zoomLevel]);

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
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <img src={GridMasterIcon} alt="GridMaster Icon" className="h-8 w-auto mr-2" />
            GridMaster
          </CardTitle>
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
              labelColor={labelColor}
              setLabelColor={setLabelColor}
              showRowNumbers={showRowNumbers}
              setShowRowNumbers={setShowRowNumbers}
              showColNumbers={showColNumbers}
              setShowColNumbers={setShowColNumbers}
              showDiagonalLines={showDiagonalLines}
              setShowDiagonalLines={setShowDiagonalLines}
              diagonalLineOpacity={diagonalLineOpacity}
              setDiagonalLineOpacity={setDiagonalLineOpacity}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onReset={resetGridSettings}
              onExport={handleExport}
              imageSrc={imageSrc}
              showImage={showImage}
              setShowImage={setShowImage}
              onFitImage={handleFitImageToCanvas}
              onCenterImage={handleCenterImageOnCanvas}
            />
          </div>
          <div
            ref={canvasContainerRef}
            className="lg:w-2/3 relative min-h-[400px] border border-border rounded-md overflow-hidden flex items-center justify-center bg-muted"
          >
            {imageSrc ? (
              <GridCanvas
                imageSrc={imageSrc}
                rows={rows}
                cols={cols}
                lineThickness={lineThickness}
                lineColor={lineColor}
                lineOpacity={lineOpacity}
                labelColor={labelColor}
                showRowNumbers={showRowNumbers}
                showColNumbers={showColNumbers}
                showDiagonalLines={showDiagonalLines}
                diagonalLineOpacity={diagonalLineOpacity}
                imageOffset={imageOffset}
                setImageOffset={setImageOffset}
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
        labelColor={labelColor}
        showRowNumbers={showRowNumbers}
        showColNumbers={showColNumbers}
        showDiagonalLines={showDiagonalLines}
        diagonalLineOpacity={diagonalLineOpacity}
        imageOffset={imageOffset}
        zoomLevel={zoomLevel}
        triggerExport={triggerExport}
        onExportComplete={handleExportComplete}
      />
    </div>
  );
};