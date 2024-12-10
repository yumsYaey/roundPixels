document.getElementById('imageInput').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            roundCorners(ctx, img.width, img.height);
            document.getElementById('downloadButton').style.display = 'inline';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function roundCorners(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const margin = 10;  // Margin for detecting sharp corners
    const radius = 10;  // Radius for rounding the corners

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a === 255) {  // Non-transparent pixels
                if (isCorner(x, y, width, height, margin)) {
                    applyRoundingEffect(data, idx, width, height, x, y, radius);
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function isCorner(x, y, width, height, margin) {
    return (
        (x < margin && y < margin) || // Top-left corner
        (x > width - margin && y < margin) || // Top-right corner
        (x < margin && y > height - margin) || // Bottom-left corner
        (x > width - margin && y > height - margin) // Bottom-right corner
    );
}

function applyRoundingEffect(data, idx, width, height, x, y, radius) {
    const newColor = [255, 255, 255, 255];  // White for rounded pixels (you can change this)

    for (let offsetX = -radius; offsetX <= radius; offsetX++) {
        for (let offsetY = -radius; offsetY <= radius; offsetY++) {
            const newX = x + offsetX;
            const newY = y + offsetY;

            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const newIdx = (newY * width + newX) * 4;

                // If within radius, apply rounding effect
                if (Math.pow(offsetX, 2) + Math.pow(offsetY, 2) <= Math.pow(radius, 2)) {
                    data[newIdx] = newColor[0];
                    data[newIdx + 1] = newColor[1];
                    data[newIdx + 2] = newColor[2];
                    data[newIdx + 3] = newColor[3];
                }
            }
        }
    }
}

document.getElementById('downloadButton').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'rounded-image.png';
    link.click();
});
