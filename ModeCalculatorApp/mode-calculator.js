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
// 2. MODE CALCULATOR ENGINE
// ==========================================
const btnCalc = document.getElementById('btn-calc');
const btnClear = document.getElementById('btn-clear');
const dataInput = document.getElementById('data-input');
const resultBox = document.getElementById('calc-result');

btnCalc.addEventListener('click', () => {
    const rawVal = dataInput.value;

    if (!rawVal.trim()) {
        resultBox.innerHTML = "Please enter some numbers to calculate the mode.";
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

    const count = numbersArray.length;
    
    // Create a frequency map
    const frequencyMap = {};
    numbersArray.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    // Find the highest frequency
    let maxFreq = 0;
    for (const num in frequencyMap) {
        if (frequencyMap[num] > maxFreq) {
            maxFreq = frequencyMap[num];
        }
    }

    // Check if every number appears the same amount of times (No Mode)
    const uniqueFrequencies = new Set(Object.values(frequencyMap));
    
    let modeOutput = "";
    if (uniqueFrequencies.size === 1) {
        modeOutput = "<strong>No Mode</strong><div style='font-size: 1rem; margin-top: 5px; color: #cbd5e1;'>All numbers appear equally.</div>";
    } else {
        // Collect all numbers that share the max frequency
        const modes = Object.keys(frequencyMap)
            .filter(num => frequencyMap[num] === maxFreq)
            .map(Number); // Convert keys back to numbers
            
        // Sort for neatness if there are multiple modes
        modes.sort((a, b) => a - b);
        
        modeOutput = `<strong>${modes.join(', ')}</strong>`;
    }

    // Inject Results
    resultBox.innerHTML = `
        <div class="stat-row"><span>Total Numbers Processed:</span> <span>${count}</span></div>
        <div class="stat-row"><span>Highest Frequency (Occurrences):</span> <span>${maxFreq} time${maxFreq !== 1 ? 's' : ''}</span></div>
        <div style="margin-top: 15px; text-transform: uppercase; font-size: 0.85rem; font-weight: 700; color: #94a3b8; letter-spacing: 1px;">Mode Result</div>
        ${modeOutput}
    `;
});

// Clear Button Logic
btnClear.addEventListener('click', () => {
    dataInput.value = "";
    resultBox.innerHTML = "Enter your dataset to see the most frequent numbers.";
    dataInput.focus();
});