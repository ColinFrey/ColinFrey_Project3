window.addEventListener('load', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgEnabled = document.getElementById('bgEnabled');
    const lineWidth = document.getElementById('lineWidth');
    const clearBtn = document.getElementById('clearBtn');
    const drawBtn = document.getElementById('drawBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let isDrawing = false;
    let isEraser = false;
    let historyStack = [];
    let redoStack = [];

    saveState();

    function saveState() {
        if (historyStack.length > 20) historyStack.shift();
        historyStack.push(canvas.toDataURL());
    }

    function undo() {
        if (historyStack.length > 1) {
            redoStack.push(historyStack.pop());
            loadState(historyStack[historyStack.length - 1]);
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            historyStack.push(nextState);
            loadState(nextState);
        }
    }

    function loadState(src) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
            rawX: clientX, rawY: clientY
        };
    }

    function updateCanvasBackground() {
        canvas.style.backgroundColor = bgEnabled.checked ? bgColorPicker.value : '#ffffff';
    }

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 15 + 5;
        particle.style.width = particle.style.height = `${size}px`;
        particle.style.left = `${x - size / 2}px`;
        particle.style.top = `${y - size / 2}px`;
        particle.style.background = isEraser ? (bgEnabled.checked ? bgColorPicker.value : '#ffffff') : colorPicker.value;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    function startDrawing(e) {
        isDrawing = true;
        redoStack = []; 
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineWidth = lineWidth.value;
        ctx.lineCap = ctx.lineJoin = 'round';
        
        if (isEraser && !bgEnabled.checked) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = isEraser ? bgColorPicker.value : colorPicker.value;
        }
    }

    function draw(e) {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        createParticle(pos.rawX, pos.rawY);
    }

    function stopDrawing() {
        if (isDrawing) {
            ctx.closePath();
            isDrawing = false;
            saveState(); 
        }
    }

    drawBtn.addEventListener('click', () => {
        isEraser = false;
        drawBtn.classList.add('active');
        eraserBtn.classList.remove('active');
    });

    eraserBtn.addEventListener('click', () => {
        isEraser = true;
        eraserBtn.classList.add('active');
        drawBtn.classList.remove('active');
    });

    bgEnabled.addEventListener('change', updateCanvasBackground);
    bgColorPicker.addEventListener('input', () => { if (bgEnabled.checked) updateCanvasBackground(); });
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);

    downloadBtn.addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (bgEnabled.checked) {
            tempCtx.fillStyle = bgColorPicker.value;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        tempCtx.drawImage(canvas, 0, 0);
        const link = document.createElement('a');
        link.download = `sea-sketch-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
    });

    clearBtn.addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); saveState(); });
    canvas.addEventListener('mousedown', startDrawing);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', (e) => { startDrawing(e); e.preventDefault(); }, {passive: false});
    window.addEventListener('touchmove', (e) => { draw(e); }, {passive: false});
    window.addEventListener('touchend', stopDrawing);

    updateCanvasBackground();
});