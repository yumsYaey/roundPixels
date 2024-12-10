// rounder.js

// Function to load the image onto the canvas
function loadImage(event) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };
  image.src = URL.createObjectURL(event.target.files[0]);
}

// Function to round the corners
function roundCorners() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Loop through all the pixels and find sharp corners
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      // Get the color of the current pixel
      const index = (y * canvas.width + x) * 4;
      const currentColor = [
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3]
      ];

      // Check for sharp 90-degree corners (simplified)
      if (isSharpCorner(x, y, data, canvas.width)) {
        // Apply rounding to the corner
        applyRounding(x, y, data, canvas.width);
      }
    }
  }

  // Update the canvas with the new pixel data
  ctx.putImageData(imageData, 0, 0);
}

// Check if the current pixel is part of a sharp 90-degree corner
function isSharpCorner(x, y, data, width) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1] // Left, Right, Top, Bottom
  ];

  let adjacentCount = 0;
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    const index = (ny * width + nx) * 4;
    const color = [data[index], data[index + 1], data[index + 2], data[index + 3]];

    // If there’s a neighboring pixel of the same color, count it
    if (color[3] !== 0) {
      adjacentCount++;
    }
  }

  return adjacentCount === 2; // Sharp corner (2 neighboring pixels)
}

// Apply rounding effect to the sharp corner
function applyRounding(x, y, data, width) {
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1] // Top-left, top-right, bottom-left, bottom-right
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    const index = (ny * width + nx) * 4;

    // Round the corner by changing the surrounding pixels
    if (data[index + 3] !== 0) { // Check if it's not transparent
      data[index] = 255; // Set color (e.g., white or your background color)
      data[index + 1] = 255;
      data[index + 2] = 255;
    }
  }
}

// Event listener to load the image
document.getElementById('uploadImage').addEventListener('change', loadImage);
