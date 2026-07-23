// Formatter for Indian Rupees
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// --- Tool 1: Compound Interest ---
document.getElementById('btn-ci').addEventListener('click', () => {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const time = parseFloat(document.getElementById('ci-time').value);
    const freq = parseFloat(document.getElementById('ci-frequency').value);
    const resultBox = document.getElementById('ci-result');

    if (!principal || !rate || !time) {
        resultBox.innerText = "Please fill all fields.";
        return;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const r = rate / 100;
    const amount = principal * Math.pow((1 + r / freq), freq * time);
    const interestGained = amount - principal;

    resultBox.innerHTML = `
        Total Amount: <span class="result-highlight">${formatCurrency(amount)}</span>
        Initial Principal: <strong>${formatCurrency(principal)}</strong> <br>
        Total Wealth Gained: <strong>${formatCurrency(interestGained)}</strong>
    `;
});


// --- Tool 2: SIP Calculator ---
document.getElementById('btn-sip').addEventListener('click', () => {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const annualRate = parseFloat(document.getElementById('sip-rate').value);
    const years = parseFloat(document.getElementById('sip-time').value);
    const resultBox = document.getElementById('sip-result');

    if (!monthlyInvestment || !annualRate || !years) {
        resultBox.innerText = "Please fill all fields.";
        return;
    }

    // SIP Formula: Future Value = P × ({[1 + i]^n - 1} / i) × (1 + i)
    const monthlyRate = (annualRate / 12) / 100;
    const months = years * 12;
    
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthlyInvestment * months;
    const wealthGained = futureValue - totalInvested;

    resultBox.innerHTML = `
        Expected Total Value: <span class="result-highlight">${formatCurrency(futureValue)}</span>
        Total Amount Invested: <strong>${formatCurrency(totalInvested)}</strong> <br>
        Est. Wealth Gained: <strong>${formatCurrency(wealthGained)}</strong>
    `;
});


// --- Tool 3: EMI Calculator ---
document.getElementById('btn-emi').addEventListener('click', () => {
    const principal = parseFloat(document.getElementById('emi-principal').value);
    const annualRate = parseFloat(document.getElementById('emi-rate').value);
    const time = parseFloat(document.getElementById('emi-time').value);
    const timeType = document.getElementById('emi-time-type').value;
    const resultBox = document.getElementById('emi-result');

    if (!principal || !annualRate || !time) {
        resultBox.innerText = "Please fill all fields.";
        return;
    }

    // Convert time to months if it's in years
    const months = timeType === 'years' ? time * 12 : time;
    
    // Monthly interest rate
    const r = (annualRate / 12) / 100;
    
    // EMI Formula: E = P * r * ( (1+r)^n / ((1+r)^n - 1) )
    const emi = principal * r * (Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    resultBox.innerHTML = `
        Monthly EMI: <span class="result-highlight">${formatCurrency(emi)}</span>
        Total Principal: <strong>${formatCurrency(principal)}</strong> <br>
        Total Interest Payable: <strong>${formatCurrency(totalInterest)}</strong> <br>
        Total Payment (Principal + Interest): <strong>${formatCurrency(totalPayment)}</strong>
    `;
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
