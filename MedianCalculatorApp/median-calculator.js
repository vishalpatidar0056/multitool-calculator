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
            if (document.body.classList.contains('light-theme')) {
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
// 2. MEDIAN VISUALIZER ENGINE
// ==========================================
const dataInput = document.getElementById('data-input');
const chipContainer = document.getElementById('number-chips');
const logicText = document.getElementById('logic-text');
const finalResult = document.getElementById('final-result');

function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return "0";
    return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(4)).toString();
}

function processMedian() {
    const rawData = dataInput.value;
    
    // Parse the messy string into a clean array of valid numbers
    let numbers = rawData
        .split(/[\s,]+/)
        .map(n => parseFloat(n))
        .filter(n => !isNaN(n));

    // Empty State Reset
    if (numbers.length === 0) {
        chipContainer.innerHTML = '<span class="empty-state">Waiting for data...</span>';
        logicText.innerHTML = "The list is currently empty. Paste numbers to begin.";
        finalResult.innerText = "0";
        return;
    }

    // Step 1: Sort numerically (ascending)
    numbers.sort((a, b) => a - b);
    const count = numbers.length;

    let medianValue = 0;
    let highlightIndices = [];
    let logicMessage = "";

    // Step 2: Determine if odd or even to find the middle
    if (count % 2 !== 0) {
        // Odd count: One exact middle
        const middleIndex = Math.floor(count / 2);
        highlightIndices.push(middleIndex);
        medianValue = numbers[middleIndex];
        
        logicMessage = `There are <strong>${count}</strong> numbers (an odd amount). The exact center is the <strong>${middleIndex + 1}${getOrdinalSuffix(middleIndex + 1)}</strong> number.`;
    } else {
        // Even count: Average of the two middles
        const middleIndex2 = count / 2;
        const middleIndex1 = middleIndex2 - 1;
        highlightIndices.push(middleIndex1, middleIndex2);
        
        const num1 = numbers[middleIndex1];
        const num2 = numbers[middleIndex2];
        medianValue = (num1 + num2) / 2;
        
        logicMessage = `There are <strong>${count}</strong> numbers (an even amount). We find the average of the two middle numbers:<br><br><strong>(${num1} + ${num2}) ÷ 2 = ${formatResult(medianValue)}</strong>`;
    }

    // Step 3: Render the chips and highlight the middle(s)
    chipContainer.innerHTML = ""; // Clear existing
    numbers.forEach((num, index) => {
        const span = document.createElement('span');
        span.className = 'chip';
        span.innerText = num;
        
        // Add the highlight class if this index is one of our middle numbers
        if (highlightIndices.includes(index)) {
            span.classList.add('highlight');
        }
        
        chipContainer.appendChild(span);
    });

    // Output logic and result
    logicText.innerHTML = logicMessage;
    finalResult.innerText = formatResult(medianValue);
}

// Helper to make "1st", "2nd", "3rd", "4th", etc.
function getOrdinalSuffix(i) {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
}

// Run in real-time as the user types
dataInput.addEventListener('input', processMedian);