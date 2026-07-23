// --- Tool 1: Base64 Encoder / Decoder ---
const base64Input = document.getElementById('base64-input');
const base64Output = document.getElementById('base64-output');
const btnEncode = document.getElementById('btn-encode');
const btnDecode = document.getElementById('btn-decode');

btnEncode.addEventListener('click', () => {
    // btoa() encodes a string to Base64
    const text = base64Input.value;
    if (!text) return;
    base64Output.value = btoa(text);
});

btnDecode.addEventListener('click', () => {
    // atob() decodes Base64 back to a string
    const text = base64Input.value;
    if (!text) return;
    
    try {
        base64Output.value = atob(text);
    } catch (error) {
        // If they try to decode something that isn't Base64, it throws an error
        base64Output.value = "Error: Invalid Base64 string.";
    }
});


// --- Tool 2: Color Converter ---
const hexInput = document.getElementById('hex-input');
const rgbInput = document.getElementById('rgb-input');
const colorPreview = document.getElementById('color-preview');
const colorName = document.getElementById('color-name');

// Update preview visually
function updatePreview(hex) {
    colorPreview.style.backgroundColor = hex;
}

// Listen for typing in the HEX box
hexInput.addEventListener('input', (e) => {
    let hex = e.target.value.replace('#', ''); // Remove the # if they typed it
    
    // Support 3-character hex (e.g., #FFF becomes #FFFFFF)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    // If it's a valid 6-character hex, convert it to RGB
    if (hex.length === 6) {
        // Convert base-16 (hex) strings into base-10 integers
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        rgbInput.value = `rgb(${r}, ${g}, ${b})`;
        updatePreview(`#${hex}`);
    }
});

// Listen for typing in the RGB box
rgbInput.addEventListener('input', (e) => {
    // Extract just the numbers from the string using a Regular Expression (Regex)
    const rgbValues = e.target.value.match(/\d+/g);
    
    // If we successfully found 3 numbers (R, G, and B)
    if (rgbValues && rgbValues.length === 3) {
        // Convert base-10 integers into base-16 (hex) strings
        const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
        
        const hex = `#${r}${g}${b}`;
        hexInput.value = hex;
        updatePreview(hex);
    }
});
// ==========================================
// 1. ISOLATED THEME TOGGLE (Only affects this tool)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        // Step 1: Check memory to see if Light Mode was active
        if (localStorage.getItem('multitool-theme') === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.src = '../icons/dark-mode.png';
        }

        // Step 2: Listen for button clicks
        themeToggle.addEventListener('click', () => {
            // Toggle local body ONLY
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Swap icon and save to memory
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