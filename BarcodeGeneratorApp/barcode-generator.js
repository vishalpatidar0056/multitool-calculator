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
// 2. BARCODE GENERATOR & DOWNLOAD ENGINE
// ==========================================
const btnGenerate = document.getElementById('btn-generate');
const btnDownload = document.getElementById('btn-download');
const barcodeCanvas = document.getElementById('barcode-output');
const placeholder = document.getElementById('barcode-placeholder');

btnGenerate.addEventListener('click', () => {
    const inputVal = document.getElementById('barcode-input').value.trim();

    // Validation
    if (!inputVal) {
        alert("Please enter some text or numbers to generate a barcode.");
        return;
    }

    // Hide placeholder and reveal canvas & download button
    placeholder.style.display = "none";
    barcodeCanvas.style.display = "block";
    btnDownload.style.display = "block";

    try {
        // Generate CODE128 Barcode (Most standard universal format)
        JsBarcode("#barcode-output", inputVal, {
            format: "CODE128",
            lineColor: "#000000",
            width: 2,
            height: 100,
            displayValue: true,    // Shows the text underneath the bars
            background: "#ffffff", // Forces a white background so scanners can read it
            margin: 15             // Gives some padding around the edges
        });
    } catch (error) {
        alert("Invalid input for barcode generation.");
        barcodeCanvas.style.display = "none";
        btnDownload.style.display = "none";
        placeholder.style.display = "block";
    }
});

// --- Download Logic ---
btnDownload.addEventListener('click', () => {
    // Convert the drawn canvas directly into a PNG image URI
    const imageURI = barcodeCanvas.toDataURL("image/png");

    if (imageURI) {
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURI;
        downloadLink.download = 'My_Barcode.png'; // File name
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert("Oops! The barcode couldn't be saved.");
    }
});