"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, Trash2 } from "lucide-react";

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080ff", "#004080", "#4000ff", "#804000",
    "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff8000", "#ff80ff"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Check if touch event
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineWidth = brushSize;
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="flex-1 flex bg-[#c0c0c0] font-win-sans text-black select-none h-full p-1 overflow-hidden">
      {/* Paint Tools Panel (Left sidebar) */}
      <div className="w-[45px] flex flex-col gap-1.5 p-1 border-win-out mr-2 bg-[#c0c0c0] items-center justify-start h-full">
        <button
          onClick={() => setTool("brush")}
          className={`w-[32px] h-[32px] flex items-center justify-center border-win-button outline-none ${
            tool === "brush" ? "border-win-button-depressed bg-[#dfdfdf]" : ""
          }`}
          title="Brush Tool"
        >
          <Paintbrush size={16} />
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`w-[32px] h-[32px] flex items-center justify-center border-win-button outline-none ${
            tool === "eraser" ? "border-win-button-depressed bg-[#dfdfdf]" : ""
          }`}
          title="Eraser Tool"
        >
          <Eraser size={16} />
        </button>
        <button
          onClick={clearCanvas}
          className="w-[32px] h-[32px] flex items-center justify-center border-win-button outline-none text-red-800"
          title="Clear Canvas"
        >
          <Trash2 size={16} />
        </button>

        {/* Thickness Bar */}
        <div className="border-t border-[#808080] w-full mt-3 pt-3 flex flex-col gap-2.5 items-center">
          {[2, 4, 8, 14].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-full flex items-center justify-center py-0.5 border ${
                brushSize === size ? "border-zinc-800 bg-[#dfdfdf]" : "border-transparent"
              }`}
            >
              <div
                className="bg-black rounded-full"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Canvas Area & Color palette */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Canvas container */}
        <div className="flex-1 border-win-in bg-white overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="block w-full h-full cursor-crosshair bg-white"
          />
        </div>

        {/* Color Palette Grid */}
        <div className="border-win-out mt-2 p-1.5 flex gap-2 items-center bg-[#c0c0c0] w-full">
          {/* Current color display */}
          <div className="w-[28px] h-[28px] border-win-in p-[3px] bg-white flex-shrink-0">
            <div className="w-full h-full border border-black" style={{ backgroundColor: color }} />
          </div>

          {/* Color swatches */}
          <div className="flex-1 grid grid-cols-14 gap-0.5 max-w-[280px]">
            {colors.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  setColor(c);
                  setTool("brush");
                }}
                className="w-[12px] h-[12px] border border-win-in-thin cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
