'use client'
import { useRef } from "react";

export default function Home() {

  type Point = {
    x: number;
    y: number;
  };

  type HistoryItem = {
    tool: 'pen' | 'rectangle' | "eraser";
    points: Point[];
  };
  const historystack = useRef<HistoryItem[]>([]);

  const redostack = useRef<HistoryItem[]>([]);

  const redrawCanvas = () => {
    const canvas = canvasref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all actions in the history stack
    historystack.current.forEach((item) => {
      if (item.tool === 'pen') {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        item.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (item.tool === 'rectangle') {
        const startPoint = item.points[0];
        const endPoint = item.points[1];
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      }
    });
  };


  const undo = () => {
    

    // Remove the last action from the history stack
    console.log(historystack.current);
    redostack.current.push(historystack.current[historystack.current.length - 1]);
    historystack.current.pop();
    redrawCanvas();
  };
  const redo = () => {

    // Remove the last action from the redo stack
    const item = redostack.current.pop();
    if (!item) return;

    // Add the action back to the history stack
    historystack.current.push(item);

    // Redraw the canvas
    redrawCanvas();
  };

  

  const clear = () => {
    const canvas = canvasref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    historystack.current = [];
  };


  const canvasref = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const lastx = useRef(0);
  const lasty = useRef(0);
  let startX = useRef(0);
  let startY = useRef(0);

  const mousetrack = useRef({
    isDown: false,
    isUp: true,
    isMoving: false
  });



  const activeTool = useRef<'pen' | 'rectangle' | "eraser">('pen');

  const snapshot = useRef<ImageData | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    
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
    historystack.current.push({
      tool: activeTool.current,
      points: [{ x: startX.current, y: startY.current }]
    });
    
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


    if (activeTool.current === 'pen') {
      if (e.nativeEvent.buttons === 1) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lastx.current, lasty.current);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();

        lastx.current = e.nativeEvent.offsetX;
        lasty.current = e.nativeEvent.offsetY;
        historystack.current[historystack.current.length - 1].points.push({ x: lastx.current, y: lasty.current });
      }
    }

    else if (activeTool.current === 'eraser') {
      if (e.nativeEvent.buttons === 1) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(lastx.current, lasty.current);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();

        lastx.current = e.nativeEvent.offsetX;
        lasty.current = e.nativeEvent.offsetY;
        historystack.current[historystack.current.length - 1].points.push({ x: lastx.current, y: lasty.current });
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
      historystack.current[historystack.current.length - 1].points[1] = { x: currentX, y: currentY };

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
            onClick={() => { activeTool.current = 'eraser'; }}
            className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Eraser
          </button>
          <button
            onClick={() => { activeTool.current = 'rectangle'; }}
            className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Rectangle
          </button>
          <button 
          onClick={undo}
          className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Undo
          </button>
          <button 
          onClick={redo}
          className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Redo
          </button>
          <button
            onClick={clear}
            className="bg-blue-500 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
