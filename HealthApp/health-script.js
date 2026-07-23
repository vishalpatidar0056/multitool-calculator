// --- Tool 1: BMI Calculator ---
document.getElementById('btn-bmi').addEventListener('click', () => {
    const heightCm = parseFloat(document.getElementById('bmi-height').value);
    const weightKg = parseFloat(document.getElementById('bmi-weight').value);
    const resultBox = document.getElementById('bmi-result');

    if (!heightCm || !weightKg) {
        resultBox.innerText = "Please enter valid numbers.";
        return;
    }

    // Convert height to meters, then square it
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category = "";
    let colorClass = "";

    if (bmi < 18.5) {
        category = "Underweight";
        colorClass = "warning";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal weight";
        colorClass = "normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight";
        colorClass = "warning";
    } else {
        category = "Obese";
        colorClass = "danger";
    }

    // Update HTML using template literals to inject variables and CSS classes
    resultBox.innerHTML = `BMI: ${bmi.toFixed(1)} <br> <span class="${colorClass}">(${category})</span>`;
});


// --- Tool 2: BMR Calculator (Mifflin-St Jeor) ---
document.getElementById('btn-bmr').addEventListener('click', () => {
    const gender = document.getElementById('bmr-gender').value;
    const age = parseFloat(document.getElementById('bmr-age').value);
    const height = parseFloat(document.getElementById('bmr-height').value);
    const weight = parseFloat(document.getElementById('bmr-weight').value);
    const resultBox = document.getElementById('bmr-result');

    if (!age || !height || !weight) {
        resultBox.innerText = "Please fill all fields.";
        return;
    }

    let bmr = 0;
    
    // Core formula structure: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years)
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    resultBox.innerHTML = `Basal Metabolic Rate: <br> ${Math.round(bmr)} Calories/day`;
});


// --- Tool 3: Molarity Calculator ---
document.getElementById('btn-mol').addEventListener('click', () => {
    const mass = parseFloat(document.getElementById('mol-mass').value);
    const molarMass = parseFloat(document.getElementById('mol-molar-mass').value);
    const volume = parseFloat(document.getElementById('mol-volume').value);
    const resultBox = document.getElementById('mol-result');

    if (!mass || !molarMass || !volume) {
        resultBox.innerText = "Please fill all fields.";
        return;
    }

    // Formula: M = mass / (molar mass * volume in L)
    const moles = mass / molarMass;
    const molarity = moles / volume;

    resultBox.innerHTML = `Molarity: <br> ${molarity.toFixed(4)} M (mol/L)`;
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
