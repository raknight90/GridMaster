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
  imageOffset: { x: number; y: number }; // Changed from gridPosition
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
  imageOffset, // Use new prop
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
      ctx.drawImage(img, imageOffset.x, imageOffset.y, scaledImageWidth, scaledImageHeight); // Use imageOffset

      // Apply line opacity
      ctx.globalAlpha = lineOpacity / 100;

      // Draw grid lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineThickness;

      const cellWidth = scaledImageWidth / cols;
      const cellHeight = scaledImageHeight / rows;

      // Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = imageOffset.x + i * cellWidth; // Use imageOffset
        ctx.beginPath();
        ctx.moveTo(x, imageOffset.y); // Use imageOffset
        ctx.lineTo(x, imageOffset.y + scaledImageHeight); // Use imageOffset
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = imageOffset.y + i * cellHeight; // Use imageOffset
        ctx.beginPath();
        ctx.moveTo(imageOffset.x, y); // Use imageOffset
        ctx.lineTo(imageOffset.x + scaledImageWidth, y); // Use imageOffset
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
            const startX = imageOffset.x + cIdx * cellWidth; // Use imageOffset
            const startY = imageOffset.y + rIdx * cellHeight; // Use imageOffset

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
        const x = imageOffset.x + padding; // Use imageOffset
        const y = imageOffset.y + padding; // Use imageOffset
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
          const y = imageOffset.y + (i * cellHeight) + (cellHeight / 2); // Use imageOffset
          const x = imageOffset.x + padding; // Use imageOffset
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
          const x = imageOffset.x + (i * cellWidth) + (cellWidth / 2); // Use imageOffset
          const y = imageOffset.y + padding; // Use imageOffset
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
    imageOffset, // Include in dependency array
    zoomLevel,
    onExportComplete,
  ]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};