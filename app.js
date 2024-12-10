const gridSize = 16; // Size of the pixel art grid (16x16 in this example)
const pixelCanvas = document.getElementById('pixelCanvas');
const colorPicker = document.getElementById('colorPicker');
const roundButton = document.getElementById('roundButton');
const downloadButton = document.getElementById('downloadButton');

let pixels = [];

// Initialize the pixel grid
for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.setAttribute('data-x', x);
        pixel.setAttribute('data-y', y);
        pixel.addEventListener('click', changePixelColor);
        pixelCanvas.appendChild(pixel);
        pixels.push({ x, y, color: '#ffffff' }); // Default color is white
    }
}

// Change the color of the pixel on click
function changePixelColor(e) {
    const pixel = e.target;
    const x = parseInt(pixel.getAttribute('data-x'));
    const y = parseInt(pixel.getAttribute('data-y'));
    const color = colorPicker.value;
    
    pixel.style.backgroundColor = color;
    pixels[y * gridSize + x].color = color; // Update color data
}

// Round the corners of the pixel art
roundButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * 20;
    canvas.height = gridSize * 20;
    const ctx = canvas.getContext('2d');
    
    // Draw the pixels on a canvas
    pixels.forEach((pixel, index) => {
        const x = (pixel.x * 20);
        const y = (pixel.y * 20);
        ctx.fillStyle = pixel.color;
        ctx.fillRect(x, y, 20, 20);
    });

    // Apply the rounding to the image
    applyCornerRounding(ctx, canvas.width, canvas.height);

    // Display the download button
    downloadButton.style.display = 'inline';

    // Prepare the image for download
    downloadButton.addEventListener('click', function() {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'rounded-pixel-art.png';
        link.click();
    });
});

// Apply corner rounding effect to the canvas
function applyCornerRounding(ctx, width, height) {
    const radius = 5; // Adjust the corner rounding radius
    
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
