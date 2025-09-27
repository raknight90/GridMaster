"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ImageUpload } from "./ImageUpload";
import { GridCanvas } from "./GridCanvas";
import { GridExporter } from "./GridExporter";
import { GridControlsDropdown } from "./GridControlsDropdown";
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
  const [imageOffsetX, setImageOffsetX] = useState(0); // Separate X offset state
  const [imageOffsetY, setImageOffsetY] = useState(0); // Separate Y offset state
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
        setImageOffsetX(0);
        setImageOffsetY(0);
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
    setImageOffsetX(0); // Reset image X offset
    setImageOffsetY(0); // Reset image Y offset
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

    setZoomLevel(newZoomLevel); // Set the new zoom level
    setImageOffsetX((canvasContainerDimensions.width - scaledWidth) / 2);
    setImageOffsetY((canvasContainerDimensions.height - scaledHeight) / 2);
  }, [imageSrc, originalImageDimensions, canvasContainerDimensions]);

  const handleCenterImageOnCanvas = useCallback(() => {
    if (!imageSrc || originalImageDimensions.width === 0 || canvasContainerDimensions.width === 0) return;

    const zoomFactor = zoomLevel / 100;
    const currentImageWidth = originalImageDimensions.width * zoomFactor;
    const currentImageHeight = originalImageDimensions.height * zoomFactor;

    setImageOffsetX((canvasContainerDimensions.width - currentImageWidth) / 2);
    setImageOffsetY((canvasContainerDimensions.height - currentImageHeight) / 2);
  }, [imageSrc, originalImageDimensions, canvasContainerDimensions, zoomLevel]);

  const handleExport = () => {
    if (imageSrc) {
      setTriggerExport(true);
    }
  };

  const handleExportComplete = () => {
    setTriggerExport(false);
  };

  // Calculate dynamic slider bounds for image offset
  const zoomFactor = zoomLevel / 100;
  const currentImageWidth = originalImageDimensions.width * zoomFactor;
  const currentImageHeight = originalImageDimensions.height * zoomFactor;

  // Allow image to be moved fully off-screen in any direction
  const minOffsetX = -currentImageWidth;
  const maxOffsetX = canvasContainerDimensions.width;
  const minOffsetY = -currentImageHeight;
  const maxOffsetY = canvasContainerDimensions.height;


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">
      <Card className="w-full max-w-6xl bg-card text-card-foreground shadow-lg flex flex-col flex-1">
        <CardHeader className="flex flex-row items-center justify-center lg:justify-start">
          <CardTitle className="text-3xl font-bold flex items-center">
            <img src={GridMasterIcon} alt="GridMaster Icon" className="h-8 w-auto mr-2" />
            GridMaster
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-6 flex-1">
          <div className="lg:w-1/3 space-y-6">
            <ImageUpload onImageUpload={setImageSrc} />
            <GridControlsDropdown
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
              imageOffsetX={imageOffsetX}
              setImageOffsetX={setImageOffsetX}
              imageOffsetY={imageOffsetY}
              setImageOffsetY={setImageOffsetY}
              minOffsetX={minOffsetX}
              maxOffsetX={maxOffsetX}
              minOffsetY={minOffsetY}
              maxOffsetY={maxOffsetY}
            />
          </div>
          <div
            ref={canvasContainerRef}
            className="lg:w-2/3 relative min-h-[400px] border border-border rounded-md overflow-auto bg-muted flex-1"
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
                imageOffset={{ x: imageOffsetX, y: imageOffsetY }}
                zoomLevel={zoomLevel}
                showImage={showImage}
              />
            ) : (
              <p className="text-muted-foreground absolute inset-0 flex items-center justify-center">Upload an image to get started!</p>
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
        zoomLevel={zoomLevel}
        triggerExport={triggerExport}
        onExportComplete={handleExportComplete}
      />
    </div>
  );
};