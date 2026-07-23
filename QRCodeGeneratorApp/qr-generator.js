// ==========================================
// 1. ISOLATED THEME TOGGLE (Standardized)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        // Remember state from local storage
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
// 2. QR CODE GENERATOR & DOWNLOAD ENGINE
// ==========================================
const btnGenerate = document.getElementById('btn-generate');
const btnDownload = document.getElementById('btn-download');
const qrOutput = document.getElementById('qr-output');
const placeholder = document.getElementById('qr-placeholder');

btnGenerate.addEventListener('click', () => {
    const inputVal = document.getElementById('qr-input').value.trim();

    // Validation
    if (!inputVal) {
        alert("Please enter a URL, email, or some text to generate a QR code.");
        return;
    }

    // Clear any existing QR code and hide download button
    qrOutput.innerHTML = "";
    btnDownload.style.display = "none";

    // Generate the new QR Code
    new QRCode(qrOutput, {
        text: inputVal,
        width: 200, 
        height: 200,
        colorDark: "#000000", 
        colorLight: "#ffffff", 
        correctLevel: QRCode.CorrectLevel.H 
    });

    // Hide the placeholder text and show the actual QR code
    placeholder.style.display = "none";
    qrOutput.style.display = "block";

    // Show the download button after a tiny delay to ensure the image is fully drawn
    setTimeout(() => {
        btnDownload.style.display = "block";
    }, 100);
});

// --- NEW: Download Logic ---
btnDownload.addEventListener('click', () => {
    // The library creates both a <canvas> and an <img>. We want to pull the image data.
    const qrImage = qrOutput.querySelector('img');
    const qrCanvas = qrOutput.querySelector('canvas');
    let imageURI = '';

    // Extract the image data
    if (qrImage && qrImage.getAttribute('src')) {
        imageURI = qrImage.getAttribute('src');
    } else if (qrCanvas) {
        imageURI = qrCanvas.toDataURL("image/png");
    }

    // Create a fake link, click it to download, and remove it
    if (imageURI) {
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURI;
        downloadLink.download = 'My_QRCode.png'; // Name of the downloaded file
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert("Oops! The QR code isn't ready yet. Try again in a second.");
    }
});