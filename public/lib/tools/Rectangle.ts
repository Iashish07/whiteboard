export const drawrectangle = (ctx: CanvasRenderingContext2D, lastx: number, lasty: number, currentx: number, currenty: number) => {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(lastx, lasty, currentx - lastx, currenty - lasty);
};
