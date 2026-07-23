document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('stat-input').value = '';
    document.getElementById('stats-results').style.display = 'none';
    document.getElementById('stat-error').innerText = '';
});

document.getElementById('btn-calculate').addEventListener('click', () => {
    const rawInput = document.getElementById('stat-input').value;
    const errorBox = document.getElementById('stat-error');
    const resultsContainer = document.getElementById('stats-results');

    // 1. Clean and parse the input array
    // This splits by comma, removes spaces, converts to numbers, and filters out letters/blanks
    const dataset = rawInput.split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(Number)
        .filter(item => !isNaN(item));

    if (dataset.length === 0) {
        errorBox.innerText = "Please enter a valid comma-separated list of numbers.";
        resultsContainer.style.display = 'none';
        return;
    }

    errorBox.innerText = ''; // Clear errors

    // 2. Core Calculations
    const count = dataset.length;
    
    // Sum
    const sum = dataset.reduce((acc, val) => acc + val, 0);
    
    // Mean
    const mean = sum / count;

    // Median (Requires sorting the array first)
    // We use (a, b) => a - b to force JavaScript to sort numerically rather than alphabetically
    const sorted = [...dataset].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 === 0 
        ? (sorted[mid - 1] + sorted[mid]) / 2 
        : sorted[mid];

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    // Mode (Finding the most frequent number)
    const frequency = {};
    let maxFreq = 0;
    let modes = [];

    dataset.forEach(num => {
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
    
    // If every number appears exactly once, there is no mode
    let modeDisplay = modes.length === count ? "None" : modes.join(', ');

    // Population Variance
    // Variance = average of squared differences from the Mean
    const squaredDiffs = dataset.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / count;

    // Standard Deviation = Square root of Variance
    const stdDev = Math.sqrt(variance);


    // 3. Update the UI
    document.getElementById('res-count').innerText = count;
    document.getElementById('res-sum').innerText = sum;
    // We use toFixed(2) and parseFloat to drop unnecessary trailing zeros
    document.getElementById('res-mean').innerText = parseFloat(mean.toFixed(4));
    document.getElementById('res-median').innerText = parseFloat(median.toFixed(4));
    document.getElementById('res-mode').innerText = modeDisplay;
    document.getElementById('res-range').innerText = `${min} to ${max}`;
    document.getElementById('res-variance').innerText = parseFloat(variance.toFixed(4));
    document.getElementById('res-stddev').innerText = parseFloat(stdDev.toFixed(4));

    // Reveal the results grid
    resultsContainer.style.display = 'grid';
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
