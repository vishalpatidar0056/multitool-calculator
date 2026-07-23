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
// 2. PRIME NUMBER ENGINE
// ==========================================
document.getElementById('btn-check').addEventListener('click', () => {
    const inputVal = document.getElementById('prime-input').value;
    const resultBox = document.getElementById('prime-result');
    const num = parseInt(inputVal, 10);

    // Validation
    if (isNaN(num)) {
        resultBox.innerHTML = "Please enter a valid number.";
        return;
    }
    
    if (num < 1) {
        resultBox.innerHTML = `<strong>${num}</strong> is not a valid prime candidate. Please enter a positive integer greater than 0.`;
        return;
    }

    if (num === 1) {
        resultBox.innerHTML = `<span class="not-prime"><strong>1 is NOT Prime</strong></span> By definition, 1 is not considered a prime number.`;
        return;
    }

    // Mathematical Prime Check
    let isPrime = true;
    let lowestDivisor = null;

    // Check 2 separately to optimize the loop
    if (num > 2 && num % 2 === 0) {
        isPrime = false;
        lowestDivisor = 2;
    } else {
        // Loop through odd numbers up to the square root of the number
        const limit = Math.sqrt(num);
        for (let i = 3; i <= limit; i += 2) {
            if (num % i === 0) {
                isPrime = false;
                lowestDivisor = i;
                break; // Stop checking once we find a divisor
            }
        }
    }

    // Output Results
    if (isPrime) {
        resultBox.innerHTML = `<span class="is-prime"><strong>${num} IS a Prime Number!</strong></span> It is only divisible by 1 and itself.`;
    } else {
        const otherDivisor = num / lowestDivisor;
        resultBox.innerHTML = `<span class="not-prime"><strong>${num} is NOT Prime</strong></span> It is divisible by ${lowestDivisor} (${lowestDivisor} × ${otherDivisor} = ${num}).`;
    }
});