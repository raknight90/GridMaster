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
  gridPosition: { x: number; y: number }; // Still passed for consistent rendering logic, but will be fixed at {0,0}
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
  gridPosition, // This will now always be { x: 0, y: 0 }
  zoomLevel,
  showImage,
}: GridCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const opacityStyle = { opacity: lineOpacity / 100 };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden" // Removed cursor styles
    >
      <div
        className="absolute"
        style={{
          left: gridPosition.x,
          top: gridPosition.y,
          width: currentImageWidth,
          height: currentImageHeight,
        }}
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
                      opacity: 0.5,
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
                      opacity: 0.5,
                    }}
                  />
                </React.Fragment>
              ))
            )}

          {/* Combined A/1 label for the top-left cell */}
          {showRowNumbers && showColNumbers && (
            <div
              key="combined-label-0-0"
              className="absolute text-sm font-semibold flex items-center justify-center"
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
                if (i === 0 && showColNumbers) return null; // Skip if A/1 is handled
                return (
                  <div
                    key={`row-num-${i}`}
                    className="absolute text-sm font-semibold flex items-center justify-center"
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
                if (i === 0 && showRowNumbers) return null; // Skip if A/1 is handled
                return (
                  <div
                    key={`col-num-${i}`}
                    className="absolute text-sm font-semibold flex items-center justify-center"
                    style={{
                      top: 0,
                      left: `${i * cellWidth}px`,
                      width: cellWidth,
                      height: cellHeight,
                      opacity: lineOpacity / 100,
                      color: labelColor,
                    }}
                  >
                    {String.fromCharCode(65 + i)} {/* Convert number to letter */}
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