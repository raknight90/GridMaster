"use client";

import React, { useRef, useEffect } from "react";

interface GridExporterProps {
  imageSrc: string | null;
  rows: number;
  cols: number;
  lineThickness: number;
  lineColor: string;
  lineOpacity: number;
  labelColor: string; // New prop for label color
  showRowNumbers: boolean;
  showColNumbers: boolean;
  showDiagonalLines: boolean;
  gridPosition: { x: number; y: number };
  zoomLevel: number;
  triggerExport: boolean;
  onExportComplete: () => void;
}

export const GridExporter = ({
  imageSrc,
  rows,
  cols,
  lineThickness,
  lineColor,
  lineOpacity,
  labelColor, // Destructure labelColor
  showRowNumbers,
  showColNumbers,
  showDiagonalLines,
  gridPosition,
  zoomLevel,
  triggerExport,
  onExportComplete,
}: GridExporterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!triggerExport || !imageSrc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const zoomFactor = zoomLevel / 100;
      const scaledImageWidth = img.width * zoomFactor;
      const scaledImageHeight = img.height * zoomFactor;

      // Set canvas dimensions to match the scaled image
      canvas.width = scaledImageWidth;
      canvas.height = scaledImageHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(img, gridPosition.x, gridPosition.y, scaledImageWidth, scaledImageHeight);

      // Apply line opacity
      ctx.globalAlpha = lineOpacity / 100;

      // Draw grid lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineThickness;

      const cellWidth = scaledImageWidth / cols;
      const cellHeight = scaledImageHeight / rows;

      // Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = gridPosition.x + i * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, gridPosition.y);
        ctx.lineTo(x, gridPosition.y + scaledImageHeight);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = gridPosition.y + i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(gridPosition.x, y);
        ctx.lineTo(gridPosition.x + scaledImageWidth, y);
        ctx.stroke();
      }

      // Diagonal Lines
      if (showDiagonalLines) {
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineThickness;
        ctx.globalAlpha = (lineOpacity / 100) * 0.5; // Apply opacity and match GridCanvas's 0.5 multiplier

        for (let rIdx = 0; rIdx < rows; rIdx++) {
          for (let cIdx = 0; cIdx < cols; cIdx++) {
            const startX = gridPosition.x + cIdx * cellWidth;
            const startY = gridPosition.y + rIdx * cellHeight;

            // Top-left to bottom-right diagonal
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + cellWidth, startY + cellHeight);
            ctx.stroke();

            // Top-right to bottom-left diagonal
            ctx.beginPath();
            ctx.moveTo(startX + cellWidth, startY);
            ctx.lineTo(startX, startY + cellHeight);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      ctx.fillStyle = labelColor; // Use labelColor for numbers
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = lineOpacity / 100; // Apply opacity to text

      // Row Numbers
      if (showRowNumbers) {
        for (let i = 0; i < rows; i++) {
          const y = gridPosition.y + (i + 0.5) * cellHeight;
          ctx.fillText((i + 1).toString(), gridPosition.x - 20, y); // Offset to the left
        }
      }

      // Column Numbers (now letters)
      if (showColNumbers) {
        for (let i = 0; i < cols; i++) {
          const x = gridPosition.x + (i + 0.5) * cellWidth;
          ctx.fillText(String.fromCharCode(65 + i), x, gridPosition.y - 20); // Offset to the top, use letters
        }
      }

      // Reset globalAlpha for the rest of the canvas operations if any
      ctx.globalAlpha = 1;

      // Trigger download
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "gridmaster_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onExportComplete();
    };
  }, [
    triggerExport,
    imageSrc,
    rows,
    cols,
    lineThickness,
    lineColor,
    lineOpacity,
    labelColor, // Add labelColor to dependencies
    showRowNumbers,
    showColNumbers,
    showDiagonalLines,
    gridPosition,
    zoomLevel,
    onExportComplete,
  ]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};