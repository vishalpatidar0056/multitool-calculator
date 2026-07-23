// ==========================================
// 1. ISOLATED THEME TOGGLE
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
// 2. PROPORTION ENGINE LOGIC
// ==========================================

// Utility to format numbers cleanly (removes extreme decimals)
function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "";
    return parseFloat(num.toFixed(4)).toString();
}

// --- Calculator 1: Direct Proportion (Y2 = (Y1 * X2) / X1) ---
const c1_x1 = document.getElementById('calc1-x1');
const c1_y1 = document.getElementById('calc1-y1');
const c1_x2 = document.getElementById('calc1-x2');
const c1_res = document.getElementById('calc1-res');

function calculateDirect() {
    const x1 = parseFloat(c1_x1.value);
    const y1 = parseFloat(c1_y1.value);
    const x2 = parseFloat(c1_x2.value);
    
    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && x1 !== 0) {
        const result = (y1 * x2) / x1;
        c1_res.value = formatResult(result);
    } else {
        c1_res.value = "";
    }
}
c1_x1.addEventListener('input', calculateDirect);
c1_y1.addEventListener('input', calculateDirect);
c1_x2.addEventListener('input', calculateDirect);


// --- Calculator 2: Inverse Proportion (Y2 = (X1 * Y1) / X2) ---
const c2_x1 = document.getElementById('calc2-x1');
const c2_y1 = document.getElementById('calc2-y1');
const c2_x2 = document.getElementById('calc2-x2');
const c2_res = document.getElementById('calc2-res');

function calculateInverse() {
    const x1 = parseFloat(c2_x1.value);
    const y1 = parseFloat(c2_y1.value);
    const x2 = parseFloat(c2_x2.value);
    
    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && x2 !== 0) {
        const result = (x1 * y1) / x2;
        c2_res.value = formatResult(result);
    } else {
        c2_res.value = "";
    }
}
c2_x1.addEventListener('input', calculateInverse);
c2_y1.addEventListener('input', calculateInverse);
c2_x2.addEventListener('input', calculateInverse);


// --- Calculator 3: Aspect Ratio Resizer ---
const origW = document.getElementById('orig-w');
const origH = document.getElementById('orig-h');
const newW = document.getElementById('new-w');
const newH = document.getElementById('new-h');

// If User types in NEW WIDTH, auto-calculate New Height
function updateFromWidth() {
    const ow = parseFloat(origW.value);
    const oh = parseFloat(origH.value);
    const nw = parseFloat(newW.value);
    
    if (!isNaN(ow) && !isNaN(oh) && !isNaN(nw) && ow !== 0) {
        // newHeight = (newWidth * origHeight) / origWidth
        const calculatedHeight = (nw * oh) / ow;
        newH.value = formatResult(calculatedHeight);
    } else if (isNaN(nw) || nw === 0) {
        newH.value = "";
    }
}

// If User types in NEW HEIGHT, auto-calculate New Width
function updateFromHeight() {
    const ow = parseFloat(origW.value);
    const oh = parseFloat(origH.value);
    const nh = parseFloat(newH.value);
    
    if (!isNaN(ow) && !isNaN(oh) && !isNaN(nh) && oh !== 0) {
        // newWidth = (newHeight * origWidth) / origHeight
        const calculatedWidth = (nh * ow) / oh;
        newW.value = formatResult(calculatedWidth);
    } else if (isNaN(nh) || nh === 0) {
        newW.value = "";
    }
}

// Attach listeners so they recalculate perfectly if anything changes
origW.addEventListener('input', updateFromWidth);
origH.addEventListener('input', updateFromWidth);

// The magic bi-directional listeners
newW.addEventListener('input', updateFromWidth);
newH.addEventListener('input', updateFromHeight);