// Matrix Rain Animation Worker
// Runs in a separate thread to prevent lag when the main thread is busy loading assets/hydrating.

let canvas;
let ctx;
let animationFrameId;
let columns;
let drops;
let fontSize = 14;

self.onmessage = function (e) {
    const { type, payload } = e.data;

    if (type === 'INIT') {
        canvas = payload.canvas;
        ctx = canvas.getContext('2d');
        resize(payload.width, payload.height);
        loop();
    } else if (type === 'RESIZE') {
        resize(payload.width, payload.height);
    } else if (type === 'STOP') {
        cancelAnimationFrame(animationFrameId);
    }
};

function resize(width, height) {
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    // Re-calculate columns
    columns = Math.ceil(width / fontSize);

    // Reset drops, preserving existing ones if possible, adding new ones randomly
    const newDrops = [];
    for (let i = 0; i < columns; i++) {
        // If we had a drop there before, keep it (approx), else random start
        // A simple reset is visually less jarring than trying to map old state exactly
        newDrops[i] = Math.random() * -100;
    }
    drops = newDrops;
}

function loop() {
    // Semi-transparent black fill for trail effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `${fontSize}px 'Courier New', monospace`;

    for (let i = 0; i < drops.length; i++) {
        // Optimization: Draw fewer characters per frame if needed, but 2D canvas is fast in worker.
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    animationFrameId = requestAnimationFrame(loop);
}
