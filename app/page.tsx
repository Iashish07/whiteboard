'use client'
import { useEffect, useRef, useState } from "react";


export default function Home() {
  let isDrawing = useRef(false);
  let lastx = useRef(0);
  let lasty = useRef(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(e.nativeEvent.buttons !== 1) {
      isDrawing.current = false;
      lastx.current = e.nativeEvent.offsetX;
      lasty.current = e.nativeEvent.offsetY;
      return;
    }
    isDrawing.current = true;
    if (canvasref.current) {
      const canvas = canvasref.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lastx.current, lasty.current);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke(); 
      }
    }
    lastx.current = e.nativeEvent.offsetX;
    lasty.current = e.nativeEvent.offsetY;
    
  }

  const canvasref = useRef<HTMLCanvasElement>(null);


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neutral-200">
      <div className="h-9/10 w-9/10 bg-white rounded-2xl shadow-xl border border-neutral-300">
        <div id="menu" className="w-full h-1/10 p-4 m-auto mt-4 bg-neutral-200 rounded-t-xl border-b border-neutral-300">

        </div>
        <div className="w-full h-8/10 p-4 m-auto mt-6 flex items-center justify-center bg-neutral-100 rounded-xl border border-neutral-200">
          <canvas id="canvas" width={1300}
            height={400}
            className="bg-white w-[1300px] h-[400px] rounded-lg border border-neutral-200 shadow-inner"
            ref={canvasref}
            onMouseMove={handleMouseMove}
          ></canvas>
        </div>
      </div>
    </div>
  );
}

