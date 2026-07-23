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
// 2. BASIC STATISTICS ENGINE
// ==========================================
const basicInput = document.getElementById('calc1-input');
const resMean = document.getElementById('res-mean');
const resMedian = document.getElementById('res-median');
const resMode = document.getElementById('res-mode');
const resRange = document.getElementById('res-range');
const resSum = document.getElementById('res-sum');
const resCount = document.getElementById('res-count');

// Helper to format long decimals nicely
function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "0";
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(4)).toString();
}

function calculateBasicStats() {
    const rawData = basicInput.value;
    
    // Convert string to array of numbers (splits by comma, space, or new line)
    // Filters out anything that isn't a valid number
    const numbers = rawData
        .split(/[\s,]+/)
        .map(n => parseFloat(n))
        .filter(n => !isNaN(n));

    if (numbers.length === 0) {
        resMean.innerText = "0"; resMedian.innerText = "0"; resMode.innerText = "None";
        resRange.innerText = "0"; resSum.innerText = "0"; resCount.innerText = "0";
        return;
    }

    // 1. Count & Sum
    const count = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);

    // 2. Mean
    const mean = sum / count;

    // 3. Median (Sort array ascending)
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    // 4. Range
    const max = sorted[count - 1];
    const min = sorted[0];
    const range = max - min;

    // 5. Mode (Find frequency of each number)
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    });

    for (const key in frequency) {
        if (frequency[key] === maxFreq) {
            modes.push(Number(key));
        }
    }
    
    // If every number appears exactly the same amount of times, there is no mode
    let modeText = "None";
    if (modes.length < count) {
        modeText = modes.map(m => formatResult(m)).join(", ");
    }

    // Output all results
    resCount.innerText = count;
    resSum.innerText = formatResult(sum);
    resMean.innerText = formatResult(mean);
    resMedian.innerText = formatResult(median);
    resRange.innerText = formatResult(range);
    resMode.innerText = modeText;
}

basicInput.addEventListener('input', calculateBasicStats);


// ==========================================
// 3. WEIGHTED AVERAGE ENGINE
// ==========================================
const weightContainer = document.getElementById('weight-rows-container');
const addRowBtn = document.getElementById('add-row-btn');
const resWeighted = document.getElementById('res-weighted');

// Calculates the weighted average instantly when any input changes
function calculateWeighted() {
    const rows = weightContainer.querySelectorAll('.weight-row');
    let sumProduct = 0;
    let sumWeights = 0;
    let hasValidData = false;

    rows.forEach(row => {
        const valInput = row.querySelector('.w-val').value;
        const wtInput = row.querySelector('.w-wt').value;

        const val = parseFloat(valInput);
        const wt = parseFloat(wtInput);

        // Only calculate if BOTH fields in the row have numbers
        if (!isNaN(val) && !isNaN(wt)) {
            sumProduct += (val * wt);
            sumWeights += wt;
            hasValidData = true;
        }
    });

    if (hasValidData && sumWeights !== 0) {
        const result = sumProduct / sumWeights;
        resWeighted.innerText = formatResult(result);
    } else {
        resWeighted.innerText = "0";
    }
}

// Attach listener to current rows
weightContainer.addEventListener('input', calculateWeighted);

// Add Row Button Logic
addRowBtn.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.className = 'weight-row';
    newRow.innerHTML = `
        <input type="number" class="w-val" placeholder="Value" step="any">
        <input type="number" class="w-wt" placeholder="Weight" step="any">
    `;
    weightContainer.appendChild(newRow);
});