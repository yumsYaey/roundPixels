const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSizeSlider = document.getElementById('brushSize');
const roundCornersButton = document.getElementById('roundCornersButton');
const downloadButton = document.getElementById('downloadButton');

let isDrawing = false;
let currentColor = '#000000';
let brushSize = 1;

// Set default brush size
brushSizeSlider.addEventListener('input', () => {
    brushSize = brushSizeSlider.value;
});

// Start drawing on mouse down
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

// Stop drawing on mouse up
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});

// Draw pixels based on mouse movement
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e);
    }
});

// Draw the pixel art at mouse position
function draw(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = currentColor;
    ctx.fillRect(x - (x % brushSize), y - (y % brushSize), brushSize, brushSize);
}

// Change the selected color
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Round the corners of the artwork
roundCornersButton.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create a new canvas to apply the corner rounding
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw original image data on temporary canvas
    tempCtx.putImageData(imageData, 0, 0);

    // Apply rounding effect to the corners
    applyCornerRounding(tempCtx, canvas.width, canvas.height);

    // Copy the image data back to the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    // Display download button
    downloadButton.style.display = 'inline';
});

// Apply corner rounding effect to the canvas
function applyCornerRounding(ctx, width, height) {
    const radius = 20; // Adjust the rounding radius
    
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.arcTo(width, 0, width, height, radius);
    ctx.lineTo(width, height - radius);
    ctx.arcTo(width, height, 0, height, radius);
    ctx.lineTo(0, radius);
    ctx.arcTo(0, 0, radius, 0, radius);
    ctx.closePath();
    ctx.fill();
}

// Download the final image as PNG
downloadButton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'pixel-art-with-rounded-corners.png';
    link.click();
});
