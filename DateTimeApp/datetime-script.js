// --- Tool 1: Age Calculator ---
document.getElementById('btn-age').addEventListener('click', () => {
    const dobInput = document.getElementById('age-dob').value;
    const resultBox = document.getElementById('age-result');

    if (!dobInput) {
        resultBox.innerText = "Please select a date of birth.";
        return;
    }

    const birthDate = new Date(dobInput);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust if days are negative (borrow a month)
    if (days < 0) {
        months--;
        // Get the number of days in the previous month
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Adjust if months are negative (borrow a year)
    if (months < 0) {
        years--;
        months += 12;
    }

    // Check if the selected date is in the future
    if (today < birthDate) {
        resultBox.innerText = "Date of birth cannot be in the future!";
        return;
    }

    resultBox.innerHTML = `${years} Years, ${months} Months, and ${days} Days old`;
});


// --- Tool 2: Date Difference ---
document.getElementById('btn-diff').addEventListener('click', () => {
    const startInput = document.getElementById('diff-start').value;
    const endInput = document.getElementById('diff-end').value;
    const resultBox = document.getElementById('diff-result');

    if (!startInput || !endInput) {
        resultBox.innerText = "Please select both dates.";
        return;
    }

    const startDate = new Date(startInput);
    const endDate = new Date(endInput);

    // Get time difference in milliseconds
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    
    // Convert milliseconds to days (1000ms * 60s * 60m * 24h)
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate rough weeks and remaining days
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    resultBox.innerHTML = `Total: ${diffDays} Days<br><span style="font-size: 0.9em; font-weight: normal; color: #94a3b8;">(${weeks} weeks and ${remainingDays} days)</span>`;
});


// --- Tool 3: Live Countdown ---
let countdownInterval; // We need to store the interval globally so we can stop it

document.getElementById('btn-start-timer').addEventListener('click', () => {
    const targetInput = document.getElementById('countdown-target').value;
    if (!targetInput) return alert("Please select a target date and time.");

    const targetDate = new Date(targetInput).getTime();

    // Clear any existing timer before starting a new one
    clearInterval(countdownInterval);

    // The setInterval function runs this code block every 1000 milliseconds (1 second)
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // If the countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('cd-days').innerText = "00";
            document.getElementById('cd-hours').innerText = "00";
            document.getElementById('cd-mins').innerText = "00";
            document.getElementById('cd-secs').innerText = "00";
            alert("Countdown Finished!");
            return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the UI (padStart adds a leading zero if the number is less than 10)
        document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').innerText = String(minutes).padStart(2, '0');
        document.getElementById('cd-secs').innerText = String(seconds).padStart(2, '0');
        
    }, 1000);
});

// Stop the timer
document.getElementById('btn-stop-timer').addEventListener('click', () => {
    clearInterval(countdownInterval);
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
