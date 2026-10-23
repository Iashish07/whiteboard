Whiteboard

A real-time collaborative whiteboard built from scratch on the raw Canvas API. No drawing libraries, no whiteboard frameworks.

What's built

· Pen tool — freehand drawing with continuous multi-point strokes
· Rectangle tool — drag to draw, previews live while dragging
· Eraser — removes strokes
· Undo / Redo — step-by-step history navigation
· Clear — wipes the canvas and history

Architecture

The canvas is a mirror of the data, not a place you draw into directly.

Every action is stored as a plain object in a historystack array:

```ts
type HistoryItem = {
  tool: 'pen' | 'rectangle' | 'eraser';
  points: Point[];
};
```

A single redraw() function clears the canvas and renders every item in historystack. Nothing else touches the canvas.

This means undo is just pop() + redraw(), and redraw is the single source of truth for what's on screen.

Tech stack

· Next.js (App Router)
· TypeScript
· Raw Canvas API — no Fabric.js, no Konva, no Excalidraw
· Tailwind CSS for UI

In progress

Real-time collaboration via WebSockets:

· A Node.js + Socket.IO server adjacent to the Next.js app
· Room-based broadcasting — users in the same room see each other's strokes
· In-memory room history, synced to new joiners
· Append-only stroke events (no CRDTs yet — strokes don't conflict)

Running locally

```bash
# frontend
npm install
npm run dev

# backend (separate terminal, once it exists)
cd server
npm install
node server.js
```