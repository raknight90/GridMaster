"use client";

import React, { useRef, useState, useEffect } from "react";
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
  imageOffset: { x: number; y: number }; // Now controlled externally
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
  imageOffset, // Directly use this prop for positioning
  zoomLevel,
  showImage,
}: GridCanvasProps) => {
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });

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

  return (
    <div
      className="relative" // Keep relative for absolute children
      style={{
        left: imageOffset.x,
        top: imageOffset.y,
        width: currentImageWidth,
        height: currentImageHeight,
      }}
    >
      {showImage && (
        <img src={imageSrc} alt="Uploaded" className="max-w-none max-h-none" style={{ width: currentImageWidth, height: currentImageHeight }} />
      )}

      {/* SVG Grid Lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={currentImageWidth}
        height={currentImageHeight}
        style={{ opacity: lineOpacity / 100 }}
      >
          {/* Horizontal Lines */}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line
              key={`h-line-${i}`}
              x1="0"
              y1={i * cellHeight}
              x2={currentImageWidth}
              y2={i * cellHeight}
              stroke={lineColor}
              strokeWidth={lineThickness}
            />
          ))}
          {/* Vertical Lines */}
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line
              key={`v-line-${i}`}
              x1={i * cellWidth}
              y1="0"
              x2={i * cellWidth}
              y2={currentImageHeight}
              stroke={lineColor}
              strokeWidth={lineThickness}
            />
          ))}

          {/* Diagonal Lines */}
          {showDiagonalLines &&
            Array.from({ length: rows }).map((_, rIdx) =>
              Array.from({ length: cols }).map((__, cIdx) => (
                <React.Fragment key={`diag-${rIdx}-${cIdx}`}>
                  {/* Top-left to bottom-right diagonal */}
                  <line
                    x1={cIdx * cellWidth}
                    y1={rIdx * cellHeight}
                    x2={(cIdx + 1) * cellWidth}
                    y2={(rIdx + 1) * cellHeight}
                    stroke={lineColor}
                    strokeWidth={lineThickness}
                    style={{ opacity: diagonalLineOpacity / 100 }}
                  />
                  {/* Top-right to bottom-left diagonal */}
                  <line
                    x1={(cIdx + 1) * cellWidth}
                    y1={rIdx * cellHeight}
                    x2={cIdx * cellWidth}
                    y2={(rIdx + 1) * cellHeight}
                    stroke={lineColor}
                    strokeWidth={lineThickness}
                    style={{ opacity: diagonalLineOpacity / 100 }}
                  />
                </React.Fragment>
              ))
            )}
        </svg>

        {/* Labels */}
        <div className="absolute inset-0 pointer-events-none">
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
            <>
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
            </>
          )}

          {/* Column Letters (inside first row, excluding the top-left if combined) */}
          {showColNumbers && (
            <>
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
            </>
          )}
        </div>
    </div>
  );
};