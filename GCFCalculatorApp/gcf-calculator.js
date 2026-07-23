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
// 2. MATH ALGORITHMS
// ==========================================

// Euclidean algorithm to find Greatest Common Factor
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Least Common Multiple
function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

// ==========================================
// 3. GROUP CALCULATOR (GCF & LCM)
// ==========================================
const listInput = document.getElementById('list-input');
const gcfResult = document.getElementById('gcf-result');
const lcmResult = document.getElementById('lcm-result');

function processList() {
    const rawData = listInput.value;
    
    // Convert input to an array of valid positive integers
    const numbers = rawData
        .split(/[\s,]+/)
        .map(n => parseInt(Math.abs(n)))
        .filter(n => !isNaN(n) && n > 0);

    if (numbers.length === 0) {
        gcfResult.innerText = "0";
        lcmResult.innerText = "0";
        return;
    }

    if (numbers.length === 1) {
        gcfResult.innerText = numbers[0];
        lcmResult.innerText = numbers[0];
        return;
    }

    // Calculate GCF and LCM for the entire array using reduce
    let currentGcf = numbers.reduce((a, b) => gcd(a, b));
    let currentLcm = numbers.reduce((a, b) => lcm(a, b));

    // Safeguard against astronomical numbers crashing the LCM display
    if (!isFinite(currentLcm) || currentLcm > Number.MAX_SAFE_INTEGER) {
        lcmResult.innerText = "Too Large";
    } else {
        lcmResult.innerText = currentLcm;
    }
    
    gcfResult.innerText = currentGcf;
}

listInput.addEventListener('input', processList);


// ==========================================
// 4. PRIME FACTORIZATION ENGINE
// ==========================================
const primeInput = document.getElementById('prime-input');
const primeResult = document.getElementById('prime-result');

function calculatePrimeFactors() {
    let num = parseInt(Math.abs(primeInput.value));
    
    if (isNaN(num) || num < 2) {
        primeResult.innerHTML = "None";
        return;
    }

    // Safety check to prevent browser freeze on gigantic numbers
    if (num > 9999999999) {
        primeResult.innerHTML = "Number too large";
        return;
    }

    const factors = {};
    let divisor = 2;

    // Fast algorithm: Divide out all 2s first, then odd numbers
    while (num >= 2) {
        if (num % divisor === 0) {
            factors[divisor] = (factors[divisor] || 0) + 1;
            num = num / divisor;
        } else {
            // After 2, we only need to check odd numbers up to the square root
            if (divisor === 2) divisor++;
            else divisor += 2;
            
            if (divisor * divisor > num && num > 1) {
                factors[num] = (factors[num] || 0) + 1;
                break;
            }
        }
    }

    // Format the output visually using math notation (Base^Exponent x Base^Exponent)
    let outputHTML = [];
    for (const [base, exponent] of Object.entries(factors)) {
        if (exponent > 1) {
            outputHTML.push(`${base}<sup>${exponent}</sup>`);
        } else {
            outputHTML.push(`${base}`);
        }
    }

    // Join them together with a nice multiplication symbol
    primeResult.innerHTML = outputHTML.join('<span class="math-times">×</span>');
}

primeInput.addEventListener('input', calculatePrimeFactors);