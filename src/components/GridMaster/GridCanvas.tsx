"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GridCanvasProps {
  imageSrc: string;
  rows: number;
  cols: number;
  lineThickness: number;
  lineColor: string;
  showRowNumbers: boolean;
  showColNumbers: boolean;
  showDiagonalLines: boolean;
  gridPosition: { x: number; y: number };
  setGridPosition: (pos: { x: number; y: number }) => void;
}

export const GridCanvas = ({
  imageSrc,
  rows,
  cols,
  lineThickness,
  lineColor,
  showRowNumbers,
  showColNumbers,
  showDiagonalLines,
  gridPosition,
  setGridPosition,
}: GridCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartOffset({
      x: e.clientX - gridPosition.x,
      y: e.clientY - gridPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setGridPosition({
      x: e.clientX - dragStartOffset.x,
      y: e.clientY - dragStartOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cellWidth = imageDimensions.width / cols;
  const cellHeight = imageDimensions.height / rows;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the canvas
    >
      <div
        className="absolute"
        style={{
          left: gridPosition.x,
          top: gridPosition.y,
          width: imageDimensions.width,
          height: imageDimensions.height,
        }}
      >
        <img src={imageSrc} alt="Uploaded" className="max-w-none max-h-none" style={{ width: imageDimensions.width, height: imageDimensions.height }} />

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
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
                      transform: "rotate(45deg) scaleX(1.414)", // sqrt(2) for diagonal length
                      position: "absolute",
                      pointerEvents: "none",
                      opacity: 0.5, // Make diagonals slightly less prominent
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

          {/* Row Numbers */}
          {showRowNumbers && (
            <div className="absolute top-0 left-0 h-full w-10 -translate-x-full text-right pr-2 pointer-events-none">
              {Array.from({ length: rows }).map((_, i) => (
                <div
                  key={`row-num-${i}`}
                  className="absolute text-sm font-semibold text-foreground/80"
                  style={{
                    top: `${(i + 0.5) * cellHeight}px`,
                    transform: "translateY(-50%)",
                    height: cellHeight,
                    lineHeight: `${cellHeight}px`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Column Numbers */}
          {showColNumbers && (
            <div className="absolute top-0 left-0 w-full h-10 -translate-y-full pt-2 text-center pointer-events-none">
              {Array.from({ length: cols }).map((_, i) => (
                <div
                  key={`col-num-${i}`}
                  className="absolute text-sm font-semibold text-foreground/80"
                  style={{
                    left: `${(i + 0.5) * cellWidth}px`,
                    transform: "translateX(-50%)",
                    width: cellWidth,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};