// --- 1. Length Converter ---
// Base unit: 1 Meter
const lengthRates = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254
};

document.getElementById('btn-length').addEventListener('click', () => {
    const input = parseFloat(document.getElementById('len-input').value);
    const fromUnit = document.getElementById('len-from').value;
    const toUnit = document.getElementById('len-to').value;
    const resultBox = document.getElementById('len-result');

    if (isNaN(input)) return resultBox.innerText = "Enter a valid number";

    // Step 1: Convert input to base unit (Meters)
    const inMeters = input * lengthRates[fromUnit];
    
    // Step 2: Convert from base unit to target unit
    const finalResult = inMeters / lengthRates[toUnit];

    // Display formatted result (up to 4 decimal places to drop trailing zeros)
    resultBox.innerText = `${input} ${fromUnit} = ${parseFloat(finalResult.toFixed(4))} ${toUnit}`;
});


// --- 2. Weight Converter ---
// Base unit: 1 Kilogram
const weightRates = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000
};

document.getElementById('btn-weight').addEventListener('click', () => {
    const input = parseFloat(document.getElementById('wt-input').value);
    const fromUnit = document.getElementById('wt-from').value;
    const toUnit = document.getElementById('wt-to').value;
    const resultBox = document.getElementById('wt-result');

    if (isNaN(input)) return resultBox.innerText = "Enter a valid number";

    // Step 1: Convert input to base unit (Kilograms)
    const inKg = input * weightRates[fromUnit];
    
    // Step 2: Convert from base unit to target unit
    const finalResult = inKg / weightRates[toUnit];

    resultBox.innerText = `${input} ${fromUnit} = ${parseFloat(finalResult.toFixed(4))} ${toUnit}`;
});


// --- 3. Temperature Converter ---
document.getElementById('btn-temp').addEventListener('click', () => {
    const input = parseFloat(document.getElementById('temp-input').value);
    const fromUnit = document.getElementById('temp-from').value;
    const toUnit = document.getElementById('temp-to').value;
    const resultBox = document.getElementById('temp-result');

    if (isNaN(input)) return resultBox.innerText = "Enter a valid number";

    // If converting to the exact same unit, just return the input
    if (fromUnit === toUnit) {
        return resultBox.innerText = `${input}°${fromUnit} = ${input}°${toUnit}`;
    }

    let finalResult = 0;

    // Convert from Celsius
    if (fromUnit === 'C') {
        if (toUnit === 'F') finalResult = (input * 9/5) + 32;
        if (toUnit === 'K') finalResult = input + 273.15;
    }
    // Convert from Fahrenheit
    else if (fromUnit === 'F') {
        if (toUnit === 'C') finalResult = (input - 32) * 5/9;
        if (toUnit === 'K') finalResult = (input - 32) * 5/9 + 273.15;
    }
    // Convert from Kelvin
    else if (fromUnit === 'K') {
        if (toUnit === 'C') finalResult = input - 273.15;
        if (toUnit === 'F') finalResult = (input - 273.15) * 9/5 + 32;
    }

    resultBox.innerText = `${input}°${fromUnit} = ${parseFloat(finalResult.toFixed(2))}°${toUnit}`;
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
