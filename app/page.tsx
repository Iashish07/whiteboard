'use client'
import { useRef } from "react";

export default function Home() {
  
  const storestrokes = [{
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    tool: 'pen',
  }] as any;
  const storehistory = ()=>{
    if(mousetrack.current.isDown && mousetrack.current.isMoving){
      storestrokes[0].startX = lastx.current;
      storestrokes[0].startY = lasty.current;
      storestrokes[0].endX = lastx.current;
      storestrokes[0].endY = lasty.current;
    }
    else if(mousetrack.current.isUp && mousetrack.current.isMoving){
      storestrokes.push({
        tool: activeTool.current,
        startX: lastx.current,
        startY: lasty.current,
        endX: lastx.current,
        endY: lasty.current,
      })
    }
    }
  


  const canvasref = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  let history = useRef([])
  const lastx = useRef(0);
  const lasty = useRef(0);
  let startX = useRef(0);
  let startY = useRef(0);
  const mousetrack = useRef({
      isDown: false,
      isUp: false,
      isMoving: false,
    })


  const activeTool = useRef<'pen' | 'rectangle'>('pen');

  const snapshot = useRef<ImageData | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    mousetrack.current.isDown = true;
    mousetrack.current.isUp = false;
    mousetrack.current.isMoving = false;

    const canvas = canvasref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    startX.current = e.nativeEvent.offsetX;
    startY.current = e.nativeEvent.offsetY;
    lastx.current = e.nativeEvent.offsetX;
    lasty.current = e.nativeEvent.offsetY;

    // Save the current canvas state so we can restore it while drawing the rectangle preview
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    mousetrack.current.isDown = false;
    mousetrack.current.isUp = true;
    mousetrack.current.isMoving = false;
    // Reset snapshot 
    snapshot.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    mousetrack.current.isDown = false;
    mousetrack.current.isUp = false;
    mousetrack.current.isMoving = true;
    if (!isDrawing.current) return;

    const canvas = canvasref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;
    
    
    if(activeTool.current === 'pen') {
      if  (e.nativeEvent.buttons === 1){
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastx.current, lasty.current);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();

      lastx.current = e.nativeEvent.offsetX;
      lasty.current = e.nativeEvent.offsetY;
    }
    }
    
    
    else if (activeTool.current === 'rectangle') {
      
      if (snapshot.current) {
        ctx.putImageData(snapshot.current, 0, 0);
      }

      
      const width = currentX - startX.current;
      const height = currentY - startY.current;

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX.current, startY.current, width, height);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neutral-200">
      <div className="h-9/10 w-9/10 bg-white rounded-2xl shadow-xl border border-neutral-300">
        <div id="menu" className="w-full h-1/10 space-x-4 p-4 m-auto mt-4 bg-blue-200 rounded-t-xl border-b border-neutral-300">
          <button
            onClick={() => { activeTool.current = 'pen'; }}
            className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Pen
          </button>
          <button
            onClick={() => { activeTool.current = 'rectangle'; }}
            className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Rectangle
          </button>
          <button className="bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Undo
          </button>
          <button className="bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            clear
          </button>

        </div>
        <div className="w-full h-8/10 p-4 m-auto mt-6 flex items-center justify-center bg-neutral-100 rounded-xl border border-neutral-200">
          <canvas
            id="canvas"
            width={1300}
            height={400}
            className="bg-white w-[1300px] h-[400px] rounded-lg border border-neutral-200 shadow-inner"
            ref={canvasref}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          ></canvas>
        </div>
      </div>
    </div>
  );
}
