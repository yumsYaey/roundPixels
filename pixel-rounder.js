function loadImage(event) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();

  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Detect pixel resolution and adjust rounding
    detectResolutionAndRoundCorners(canvas, ctx, image.width, image.height);
  };

  image.src = URL.createObjectURL(event.target.files[0]);
}

function detectResolutionAndRoundCorners(canvas, ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Calculate the pixel size
  const pixelCount = width * height;
  const pixelDensity = pixelCount / (width * height); // Pixels per area

  // Determine rounding behavior based on resolution
  let roundingSize;
  if (pixelDensity < 1000) {
    // Low resolution
    roundingSize = 2; // Larger rounding
  } else if (pixelDensity < 10000) {
    // Medium resolution
    roundingSize = 1; // Medium rounding
  } else {
    // High resolution
    roundingSize = 0.5; // Smaller rounding
  }

  // Apply corner rounding
  roundCorners(canvas, ctx, roundingSize);
}

function roundCorners(canvas, ctx, roundingSize) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      const index = (y * canvas.width + x) * 4;

      // Check if the current pixel is part of a corner
      if (isCornerPixel(x, y, data, canvas.width)) {
        // Round the corner based on roundingSize
        applyRounding(x, y, data, canvas.width, roundingSize);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function isCornerPixel(x, y, data, width) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // Top, Bottom, Left, Right
  ];

  let edgeCount = 0;

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    const index = (ny * width + nx) * 4;

    if (data[index + 3] !== 0) {
      edgeCount++;
    }
  }

  return edgeCount === 2; // A corner pixel will have two neighboring edges
}

function applyRounding(x, y, data, width, roundingSize) {
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1] // Top-left, Top-right, Bottom-left, Bottom-right
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    const index = (ny * width + nx) * 4;

    // Adjust the pixel color based on roundingSize
    if (data[index + 3] !== 0) {
      data[index] = 255 - roundingSize * 50; // Adjust color intensity
      data[index + 1] = 255 - roundingSize * 50;
      data[index + 2] = 255 - roundingSize * 50;
    }
  }
}

// Event listener for uploading an image
document.getElementById('uploadImage').addEventListener('change', loadImage);
