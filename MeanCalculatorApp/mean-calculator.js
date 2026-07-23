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
// 2. MEAN CALCULATOR ENGINE
// ==========================================
const btnCalc = document.getElementById('btn-calc');
const btnClear = document.getElementById('btn-clear');
const dataInput = document.getElementById('data-input');
const resultBox = document.getElementById('calc-result');

btnCalc.addEventListener('click', () => {
    const rawVal = dataInput.value;

    if (!rawVal.trim()) {
        resultBox.innerHTML = "Please enter some numbers to calculate the mean.";
        return;
    }

    // Replace commas and newlines with spaces, then split by space
    const cleanedString = rawVal.replace(/,/g, ' ').replace(/\n/g, ' ');
    
    // Convert to an array of numbers, filtering out empty strings and non-numbers
    const numbersArray = cleanedString.split(' ')
        .map(numStr => parseFloat(numStr.trim()))
        .filter(num => !isNaN(num));

    if (numbersArray.length === 0) {
        resultBox.innerHTML = "No valid numbers detected. Please ensure your data contains digits.";
        return;
    }

    // Perform Math Calculations
    const count = numbersArray.length;
    const sum = numbersArray.reduce((acc, currentVal) => acc + currentVal, 0);
    const mean = sum / count;

    // Helper to format large/long decimals cleanly (up to 4 decimal places)
    const formatNum = (num) => Number.isInteger(num) ? num : parseFloat(num.toFixed(4));

    // Inject Results
    resultBox.innerHTML = `
        <div class="stat-row"><span>Total Numbers (Count):</span> <span>${count}</span></div>
        <div class="stat-row"><span>Sum of Dataset:</span> <span>${formatNum(sum)}</span></div>
        <div style="margin-top: 15px; text-transform: uppercase; font-size: 0.85rem; font-weight: 700; color: #94a3b8; letter-spacing: 1px;">Mean (Average)</div>
        <strong>${formatNum(mean)}</strong>
    `;
});

// Clear Button Logic
btnClear.addEventListener('click', () => {
    dataInput.value = "";
    resultBox.innerHTML = "Enter your dataset to see the statistical breakdown.";
    dataInput.focus();
});