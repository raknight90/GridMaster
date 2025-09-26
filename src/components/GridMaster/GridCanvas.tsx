"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GridCanvasProps {
  imageSrc: string;
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
  imageOffset: { x: number; y: number };
  setImageOffset: (offset: { x: number; y: number }) => void; // New prop
  zoomLevel: number;
  showImage: boolean;
}

export const GridCanvas = ({
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
  imageOffset,
  setImageOffset, // Use new prop
  zoomLevel,
  showImage,
}: GridCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragMousePosition, setStartDragMousePosition] = useState({ x: 0, y: 0 });
  const [startImageOffset, setStartImageOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setOriginalImageDimensions({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  const zoomFactor = zoomLevel / 100;
  const currentImageWidth = originalImageDimensions.width * zoomFactor;
  const currentImageHeight = originalImageDimensions.height * zoomFactor;

  const cellWidth = currentImageWidth / cols;
  const cellHeight = currentImageHeight / rows;
  const opacityStyle = { opacity: lineOpacity / 100 };
  const diagonalOpacityStyle = { opacity: diagonalLineOpacity / 100 };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDragMousePosition({ x: e.clientX, y: e.clientY });
    setStartImageOffset({ x: imageOffset.x, y: imageOffset.y });
  }, [imageOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - startDragMousePosition.x;
    const dy = e.clientY - startDragMousePosition.y;

    setImageOffset({
      x: startImageOffset.x + dx,
      y: startImageOffset.y + dy,
    });
  }, [isDragging, startDragMousePosition, startImageOffset, setImageOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouseup listener to stop dragging even if mouse leaves the canvas
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        className="absolute"
        style={{
          left: imageOffset.x,
          top: imageOffset.y,
          width: currentImageWidth,
          height: currentImageHeight,
        }}
        onMouseDown={handleMouseDown}
      >
        {showImage && (
          <img src={imageSrc} alt="Uploaded" className="max-w-none max-h-none" style={{ width: currentImageWidth, height: currentImageHeight }} />
        )}

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none" style={opacityStyle}>
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <div
              key={`h-line-${i}`}
              className="absolute w-full"
              style={{
                top: `${(i / rows) * 100}%`,
                height: lineThickness,
                backgroundColor: lineColor,
              }}
            />
          ))}
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <div
              key={`v-line-${i}`}
              className="absolute h-full"
              style={{
                left: `${(i / cols) * 100}%`,
                width: lineThickness,
                backgroundColor: lineColor,
              }}
            />
          ))}

          {/* Diagonal Lines */}
          {showDiagonalLines &&
            Array.from({ length: rows }).map((_, rIdx) =>
              Array.from({ length: cols }).map((__, cIdx) => (
                <React.Fragment key={`diag-${rIdx}-${cIdx}`}>
                  <div
                    className="absolute"
                    style={{
                      left: cIdx * cellWidth,
                      top: rIdx * cellHeight,
                      width: cellWidth,
                      height: cellHeight,
                      borderTop: `${lineThickness}px solid ${lineColor}`,
                      transformOrigin: "top left",
                      transform: "rotate(45deg) scaleX(1.414)",
                      position: "absolute",
                      pointerEvents: "none",
                      ...diagonalOpacityStyle,
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: cIdx * cellWidth,
                      top: rIdx * cellHeight,
                      width: cellWidth,
                      height: cellHeight,
                      borderTop: `${lineThickness}px solid ${lineColor}`,
                      transformOrigin: "top right",
                      transform: "rotate(-45deg) scaleX(1.414)",
                      position: "absolute",
                      pointerEvents: "none",
                      ...diagonalOpacityStyle,
                    }}
                  />
                </React.Fragment>
              ))
            )}

          {/* Combined A/1 label for the top-left cell */}
          {showRowNumbers && showColNumbers && (
            <div
              key="combined-label-0-0"
              className="absolute text-sm font-semibold flex items-start justify-start p-1"
              style={{
                top: 0,
                left: 0,
                width: cellWidth,
                height: cellHeight,
                opacity: lineOpacity / 100,
                color: labelColor,
              }}
            >
              A/1
            </div>
          )}

          {/* Row Numbers (inside first column, excluding the top-left if combined) */}
          {showRowNumbers && (
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
              {Array.from({ length: rows }).map((_, i) => {
                if (i === 0 && showColNumbers) return null;
                return (
                  <div
                    key={`row-num-${i}`}
                    className="absolute text-sm font-semibold flex items-center justify-start pl-1"
                    style={{
                      top: `${i * cellHeight}px`,
                      left: 0,
                      width: cellWidth,
                      height: cellHeight,
                      opacity: lineOpacity / 100,
                      color: labelColor,
                    }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          )}

          {/* Column Letters (inside first row, excluding the top-left if combined) */}
          {showColNumbers && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {Array.from({ length: cols }).map((_, i) => {
                if (i === 0 && showRowNumbers) return null;
                return (
                  <div
                    key={`col-num-${i}`}
                    className="absolute text-sm font-semibold flex items-start justify-center pt-1"
                    style={{
                      top: 0,
                      left: `${i * cellWidth}px`,
                      width: cellWidth,
                      height: cellHeight,
                      opacity: lineOpacity / 100,
                      color: labelColor,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};