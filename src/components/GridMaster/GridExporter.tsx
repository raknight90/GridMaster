"use client";

import React, { useRef, useEffect } from "react";

interface GridExporterProps {
  imageSrc: string | null;
  rows: number;
  cols: number;
  lineThickness: number;
  lineColor: string;
  lineOpacity: number;
  labelColor: string;
  showRowNumbers: boolean;
  showColNumbers: boolean;
  showDiagonalLines: boolean;
  diagonalLineOpacity: number;
  // Removed imageOffset: { x: number; y: number };
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
  labelColor,
  showRowNumbers,
  showColNumbers,
  showDiagonalLines,
  diagonalLineOpacity,
  // Removed imageOffset,
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

      // Draw the image at (0,0) on the export canvas
      ctx.drawImage(img, 0, 0, scaledImageWidth, scaledImageHeight);

      // Apply line opacity
      ctx.globalAlpha = lineOpacity / 100;

      // Draw grid lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineThickness;

      const cellWidth = scaledImageWidth / cols;
      const cellHeight = scaledImageHeight / rows;

      // Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = i * cellWidth; // Draw relative to (0,0)
        ctx.beginPath();
        ctx.moveTo(x, 0); // Draw relative to (0,0)
        ctx.lineTo(x, scaledImageHeight); // Draw relative to (0,0)
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = i * cellHeight; // Draw relative to (0,0)
        ctx.beginPath();
        ctx.moveTo(0, y); // Draw relative to (0,0)
        ctx.lineTo(scaledImageWidth, y); // Draw relative to (0,0)
        ctx.stroke();
      }

      // Diagonal Lines
      if (showDiagonalLines) {
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineThickness;
        ctx.globalAlpha = diagonalLineOpacity / 100;

        for (let rIdx = 0; rIdx < rows; rIdx++) {
          for (let cIdx = 0; cIdx < cols; cIdx++) {
            const startX = cIdx * cellWidth; // Draw relative to (0,0)
            const startY = rIdx * cellHeight; // Draw relative to (0,0)

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

      ctx.fillStyle = labelColor;
      ctx.font = "14px Arial";
      ctx.globalAlpha = lineOpacity / 100;
      const padding = 5;

      // Handle the A/1 combined label
      if (showRowNumbers && showColNumbers) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const x = padding; // Draw relative to (0,0)
        const y = padding; // Draw relative to (0,0)
        ctx.fillText("A/1", x, y);
        ctx.restore();
      }

      // Row Numbers (inside first column, excluding the top-left if combined)
      if (showRowNumbers) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        for (let i = 0; i < rows; i++) {
          if (i === 0 && showColNumbers) continue;
          const y = (i * cellHeight) + (cellHeight / 2); // Draw relative to (0,0)
          const x = padding; // Draw relative to (0,0)
          ctx.fillText((i + 1).toString(), x, y);
        }
        ctx.restore();
      }

      // Column Letters (inside first row, excluding the top-left if combined)
      if (showColNumbers) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let i = 0; i < cols; i++) {
          if (i === 0 && showRowNumbers) continue;
          const x = (i * cellWidth) + (cellWidth / 2); // Draw relative to (0,0)
          const y = padding; // Draw relative to (0,0)
          ctx.fillText(String.fromCharCode(65 + i), x, y);
        }
        ctx.restore();
      }

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
    labelColor,
    showRowNumbers,
    showColNumbers,
    showDiagonalLines,
    diagonalLineOpacity,
    zoomLevel,
    onExportComplete,
  ]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};