export const drawpencil = (ctx: CanvasRenderingContext2D, lastx: number, lasty: number, currentx: number, currenty: number) => {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lastx, lasty);
  ctx.lineTo(currentx, currenty);
  ctx.stroke();
  
};
