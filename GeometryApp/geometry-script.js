// --- Tool 1: Circle & Sphere ---
document.getElementById('btn-circle').addEventListener('click', () => {
    const r = parseFloat(document.getElementById('geo-radius').value);
    const resultBox = document.getElementById('circle-result');

    if (!r || r <= 0) {
        resultBox.innerText = "Please enter a valid radius.";
        return;
    }

    // 2D Circle Formulas
    const area = Math.PI * Math.pow(r, 2);
    const circumference = 2 * Math.PI * r;

    // 3D Sphere Formulas
    const sphereVolume = (4/3) * Math.PI * Math.pow(r, 3);
    const sphereSurface = 4 * Math.PI * Math.pow(r, 2);

    resultBox.innerHTML = `
        <strong>Circle (2D):</strong><br>
        Area: ${area.toFixed(2)}<br>
        Circumference: ${circumference.toFixed(2)}<br><br>
        <strong>Sphere (3D):</strong><br>
        Volume: ${sphereVolume.toFixed(2)}<br>
        Surface Area: ${sphereSurface.toFixed(2)}
    `;
});


// --- Tool 2: Rectangle & Rectangular Prism ---
document.getElementById('btn-rect').addEventListener('click', () => {
    const l = parseFloat(document.getElementById('geo-length').value);
    const w = parseFloat(document.getElementById('geo-width').value);
    const h = parseFloat(document.getElementById('geo-height-prism').value);
    const resultBox = document.getElementById('rect-result');

    if (!l || !w || l <= 0 || w <= 0) {
        resultBox.innerText = "Please enter a valid length and width.";
        return;
    }

    // 2D Rectangle Formulas
    const area = l * w;
    const perimeter = 2 * (l + w);

    let output = `
        <strong>Rectangle (2D):</strong><br>
        Area: ${area.toFixed(2)}<br>
        Perimeter: ${perimeter.toFixed(2)}
    `;

    // If they provided a height, calculate the 3D Prism too
    if (h && h > 0) {
        const volume = l * w * h;
        const surfaceArea = 2 * ((l * w) + (w * h) + (h * l));
        
        output += `<br><br>
            <strong>Rectangular Prism (3D):</strong><br>
            Volume: ${volume.toFixed(2)}<br>
            Surface Area: ${surfaceArea.toFixed(2)}
        `;
    }

    resultBox.innerHTML = output;
});


// --- Tool 3: Cylinder & Cone ---
document.getElementById('btn-cyl').addEventListener('click', () => {
    const r = parseFloat(document.getElementById('geo-cyl-radius').value);
    const h = parseFloat(document.getElementById('geo-cyl-height').value);
    const resultBox = document.getElementById('cyl-result');

    if (!r || !h || r <= 0 || h <= 0) {
        resultBox.innerText = "Please enter valid radius and height.";
        return;
    }

    // Cylinder Formulas (V = πr²h)
    const cylVolume = Math.PI * Math.pow(r, 2) * h;
    const cylSurface = (2 * Math.PI * r * h) + (2 * Math.PI * Math.pow(r, 2));

    // Cone Formulas (V = 1/3πr²h)
    const coneVolume = (1/3) * Math.PI * Math.pow(r, 2) * h;
    // Slant height (l) is √(r² + h²)
    const slantHeight = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
    const coneSurface = Math.PI * r * (r + slantHeight);

    resultBox.innerHTML = `
        <strong>Cylinder:</strong><br>
        Volume: ${cylVolume.toFixed(2)}<br>
        Surface Area: ${cylSurface.toFixed(2)}<br><br>
        <strong>Cone:</strong><br>
        Volume: ${coneVolume.toFixed(2)}<br>
        Surface Area: ${coneSurface.toFixed(2)}
    `;
});

// --- Dark/Light Mode Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check memory: Did the user already choose Light Mode in another tool?
if (localStorage.getItem('multitool-theme') === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.src = '../icons/dark-mode.png';
}

themeToggle.addEventListener('click', () => {
    // Toggles the 'light-theme' class on the body
    document.body.classList.toggle('light-theme');
    
    // Swap the icon based on the current theme (Notice the ../ added here!)
    if (document.body.classList.contains('light-theme')) {
        themeIcon.src = '../icons/dark-mode.png'; 
        localStorage.setItem('multitool-theme', 'light'); // Save to memory
    } else {
        themeIcon.src = '../icons/light-mode.png'; 
        localStorage.setItem('multitool-theme', 'dark'); // Save to memory
    }
});
