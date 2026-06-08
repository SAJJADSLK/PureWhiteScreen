/**
 * Canvas Editor
 * Provides image editing tools: crop, text overlay, blur, layers, undo/redo
 */

export interface CanvasState {
  originalImage: HTMLImageElement | null;
  currentCanvas: HTMLCanvasElement | null;
  width: number;
  height: number;
  layers: CanvasLayer[];
  history: CanvasState[];
  historyIndex: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface CanvasLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape';
  visible: boolean;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data: unknown; // Layer-specific data
  zIndex: number;
}

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2';
}

export interface TextOptions {
  text: string;
  font: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  x: number;
  y: number;
}

export interface BlurOptions {
  intensity: number; // 0-100
  radius: number; // pixels
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PixelateOptions {
  intensity: number; // 0-100
  pixelSize: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Initialize canvas editor
 */
export function initializeCanvas(
  imageUrl: string,
  canvasElement: HTMLCanvasElement
): CanvasState {
  const image = new Image();
  image.src = imageUrl;

  return {
    originalImage: image,
    currentCanvas: canvasElement,
    width: image.width,
    height: image.height,
    layers: [],
    history: [],
    historyIndex: -1,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  };
}

/**
 * Crop image
 */
export function cropImage(
  canvas: HTMLCanvasElement,
  options: CropOptions
): HTMLCanvasElement {
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = options.width;
  croppedCanvas.height = options.height;

  const ctx = croppedCanvas.getContext('2d');
  if (!ctx) return croppedCanvas;

  const sourceCanvas = canvas;
  ctx.drawImage(
    sourceCanvas,
    options.x,
    options.y,
    options.width,
    options.height,
    0,
    0,
    options.width,
    options.height
  );

  return croppedCanvas;
}

/**
 * Add text overlay
 */
export function addTextOverlay(
  canvas: HTMLCanvasElement,
  options: TextOptions
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Set font
  let fontStyle = '';
  if (options.italic) fontStyle += 'italic ';
  if (options.bold) fontStyle += 'bold ';
  fontStyle += `${options.size}px ${options.font}`;
  ctx.font = fontStyle;

  // Set color
  ctx.fillStyle = options.color;

  // Set alignment
  ctx.textAlign = options.alignment;

  // Draw text
  ctx.fillText(options.text, options.x, options.y);

  return canvas;
}

/**
 * Apply blur effect
 */
export function applyBlur(
  canvas: HTMLCanvasElement,
  options: BlurOptions
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Get image data
  const imageData = ctx.getImageData(options.x, options.y, options.width, options.height);
  const data = imageData.data;

  // Simple box blur
  const radius = Math.floor((options.radius * options.intensity) / 100);
  const blurred = boxBlur(data, options.width, options.height, radius);

  // Put blurred data back
  imageData.data.set(blurred);
  ctx.putImageData(imageData, options.x, options.y);

  return canvas;
}

/**
 * Apply pixelate effect
 */
export function applyPixelate(
  canvas: HTMLCanvasElement,
  options: PixelateOptions
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const pixelSize = Math.max(1, Math.floor((options.pixelSize * options.intensity) / 100));

  // Draw pixelated blocks
  for (let y = options.y; y < options.y + options.height; y += pixelSize) {
    for (let x = options.x; x < options.x + options.width; x += pixelSize) {
      const imageData = ctx.getImageData(x, y, pixelSize, pixelSize);
      const data = imageData.data;

      // Calculate average color
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Fill with average color
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }

  return canvas;
}

/**
 * Create layer
 */
export function createLayer(
  name: string,
  type: 'image' | 'text' | 'shape' = 'image'
): CanvasLayer {
  return {
    id: generateId(),
    name,
    type,
    visible: true,
    opacity: 1,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    data: null,
    zIndex: 0,
  };
}

/**
 * Add layer
 */
export function addLayer(state: CanvasState, layer: CanvasLayer): CanvasState {
  layer.zIndex = state.layers.length;
  return {
    ...state,
    layers: [...state.layers, layer],
  };
}

/**
 * Remove layer
 */
export function removeLayer(state: CanvasState, layerId: string): CanvasState {
  return {
    ...state,
    layers: state.layers.filter((l) => l.id !== layerId),
  };
}

/**
 * Reorder layers
 */
export function reorderLayers(
  state: CanvasState,
  layerId: string,
  newIndex: number
): CanvasState {
  const layers = [...state.layers];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return state;

  layers.splice(layers.indexOf(layer), 1);
  layers.splice(newIndex, 0, layer);

  return {
    ...state,
    layers: layers.map((l, i) => ({ ...l, zIndex: i })),
  };
}

/**
 * Toggle layer visibility
 */
export function toggleLayerVisibility(state: CanvasState, layerId: string): CanvasState {
  return {
    ...state,
    layers: state.layers.map((l) =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ),
  };
}

/**
 * Update layer opacity
 */
export function updateLayerOpacity(
  state: CanvasState,
  layerId: string,
  opacity: number
): CanvasState {
  return {
    ...state,
    layers: state.layers.map((l) =>
      l.id === layerId ? { ...l, opacity: Math.max(0, Math.min(1, opacity)) } : l
    ),
  };
}

/**
 * Undo action
 */
export function undo(state: CanvasState): CanvasState {
  if (state.historyIndex <= 0) return state;

  const newIndex = state.historyIndex - 1;
  const previousState = state.history[newIndex];

  return {
    ...previousState,
    history: state.history,
    historyIndex: newIndex,
  };
}

/**
 * Redo action
 */
export function redo(state: CanvasState): CanvasState {
  if (state.historyIndex >= state.history.length - 1) return state;

  const newIndex = state.historyIndex + 1;
  const nextState = state.history[newIndex];

  return {
    ...nextState,
    history: state.history,
    historyIndex: newIndex,
  };
}

/**
 * Save state to history
 */
export function saveToHistory(state: CanvasState): CanvasState {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(state);

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

/**
 * Can undo
 */
export function canUndo(state: CanvasState): boolean {
  return state.historyIndex > 0;
}

/**
 * Can redo
 */
export function canRedo(state: CanvasState): boolean {
  return state.historyIndex < state.history.length - 1;
}

/**
 * Export canvas as image
 */
export function exportCanvas(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' | 'webp' = 'png',
  quality: number = 0.95
): Blob | null {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, `image/${format}`, quality);
  }) as unknown as Blob | null;
}

/**
 * Resize canvas
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = width;
  newCanvas.height = height;

  const ctx = newCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }

  return newCanvas;
}

/**
 * Rotate canvas
 */
export function rotateCanvas(
  canvas: HTMLCanvasElement,
  degrees: number
): HTMLCanvasElement {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const newWidth = Math.abs(canvas.width * cos) + Math.abs(canvas.height * sin);
  const newHeight = Math.abs(canvas.width * sin) + Math.abs(canvas.height * cos);

  const newCanvas = document.createElement('canvas');
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;

  const ctx = newCanvas.getContext('2d');
  if (!ctx) return newCanvas;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return newCanvas;
}

/**
 * Flip canvas horizontally
 */
export function flipHorizontal(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;

  const ctx = newCanvas.getContext('2d');
  if (!ctx) return newCanvas;

  ctx.scale(-1, 1);
  ctx.drawImage(canvas, -canvas.width, 0);

  return newCanvas;
}

/**
 * Flip canvas vertically
 */
export function flipVertical(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;

  const ctx = newCanvas.getContext('2d');
  if (!ctx) return newCanvas;

  ctx.scale(1, -1);
  ctx.drawImage(canvas, 0, -canvas.height);

  return newCanvas;
}

/**
 * Box blur helper
 */
function boxBlur(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): Uint8ClampedArray {
  const blurred = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const px = Math.max(0, Math.min(width - 1, x + dx));
          const py = Math.max(0, Math.min(height - 1, y + dy));
          const index = (py * width + px) * 4;

          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          a += data[index + 3];
          count++;
        }
      }

      const index = (y * width + x) * 4;
      blurred[index] = Math.floor(r / count);
      blurred[index + 1] = Math.floor(g / count);
      blurred[index + 2] = Math.floor(b / count);
      blurred[index + 3] = Math.floor(a / count);
    }
  }

  return blurred;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get crop aspect ratio presets
 */
export const CROP_PRESETS = {
  free: null,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '1:1': 1,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
};

/**
 * Get font options
 */
export const FONT_OPTIONS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
];
