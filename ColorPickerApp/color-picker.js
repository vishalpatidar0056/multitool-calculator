// ==========================================
// 1. ISOLATED THEME TOGGLE (Standardized)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        if (localStorage.getItem('multitool-theme') === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.src = '../icons/dark-mode.png';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            if (isLight) {
                themeIcon.src = '../icons/dark-mode.png'; 
                localStorage.setItem('multitool-theme', 'light');
            } else {
                themeIcon.src = '../icons/light-mode.png'; 
                localStorage.setItem('multitool-theme', 'dark');
            }
        });
    }
});

// ==========================================
// 2. COLOR CALCULATION ENGINE
// ==========================================
const colorInput = document.getElementById('color-input');
const colorPreview = document.getElementById('color-preview');
const hexOutput = document.getElementById('hex-output');
const rgbOutput = document.getElementById('rgb-output');
const hslOutput = document.getElementById('hsl-output');

// Convert HEX to RGB
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// Convert HEX to HSL
function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Listen for changes on the color picker
colorInput.addEventListener('input', (e) => {
    const hexColor = e.target.value;
    
    // Update the visual preview bar
    colorPreview.style.backgroundColor = hexColor;
    
    // Update the output fields
    hexOutput.value = hexColor.toUpperCase();
    rgbOutput.value = hexToRgb(hexColor);
    hslOutput.value = hexToHsl(hexColor);
});

// ==========================================
// 3. COPY TO CLIPBOARD LOGIC
// ==========================================
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const inputElement = document.getElementById(targetId);
        
        // Select and copy text
        inputElement.select();
        inputElement.setSelectionRange(0, 99999); // Ensures it works on mobile devices
        navigator.clipboard.writeText(inputElement.value);

        // Visual feedback (Turns button green temporarily)
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.classList.add('success'); // Adds green styling class
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('success');
        }, 1500);
    });
});