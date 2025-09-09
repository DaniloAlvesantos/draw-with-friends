const state = {
  currentTool: "Pain",
  currentWidth: 10,
};

const tools = [
  {
    name: "Pain",
    action: (e, width) => {
      ctx.lineWidth = width || 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";

      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    },
    cursor: "url('eraser-cursor.png'), auto",
    trackerConfig: {
      size: state.currentWidth || 20,
      color: "black",
    },
  },
  {
    name: "Eraser",
    action: (e, width) => {
      ctx.lineWidth = width || 25;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(0,0,0,1)"; // doesn’t matter, it will erase

      // Switch to "erase" mode
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);

      // After stroke, reset to normal draw mode
      ctx.globalCompositeOperation = "source-over";
    },
    cursor: "url('eraser-cursor.png'), auto",
    trackerConfig: {
      size: state.currentWidth || 20,
      color: "black",
    },
  },
];

const canvas = document.getElementById("myCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const cursorTracker = setUpCursorTracker();
let drawing = false;

function startPosition(e) {
  drawing = true;
  draw(e);
}

function endPosition() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const tool = tools.find((t) => t.name === state.currentTool);
  if (tool) {
    useTool(tool, e);
  }
}

function useTool(tool, e) {
  tool.action(e, state.currentWidth);
}

function changeTool(toolName) {
  state.currentTool = toolName;
  const tool = tools.find((t) => t.name === toolName);

  canvas.style.cursor = tool.cursor || "default";
}

function setUpCursorTracker() {
  const tracker = document.createElement("div");
  tracker.style.position = "absolute";
  tracker.style.width = "10px";
  tracker.style.height = "10px";
  tracker.style.pointerEvents = "none";
  tracker.style.backgroundColor = "transparent";
  tracker.style.border = "2px solid black";
  tracker.style.borderRadius = "50%";
  tracker.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(tracker);

  window.addEventListener("mousemove", (e) => {
    tracker.style.left = `${e.clientX}px`;
    tracker.style.top = `${e.clientY}px`;
  });

  return tracker;
}

function changeSize(newSize) {
  state.currentWidth = newSize;
  const tool = tools.find((t) => t.name === state.currentTool);
  if (tool && tool.trackerConfig) {
    tool.trackerConfig.size = newSize;
    cursorTracker.style.width = newSize + "px";
    cursorTracker.style.height = newSize + "px";
  }

  document.querySelectorAll(".inp-size").forEach((input) => {
    console.log(input, newSize);
    input.value = newSize;
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
