class Calculator {
    constructor(previousElement, currentElement, historyList) {
        this.previousElement = previousElement;
        this.currentElement = currentElement;
        this.historyList = historyList;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    computeAdvanced(action) {
        let current = parseFloat(this.currentOperand);
        if (isNaN(current) && action !== 'pi' && action !== 'e') return;

        let result;
        let expression = '';

        switch (action) {
            case 'sin':
                result = Math.sin(current); // Note: Calculates in radians
                expression = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(current);
                expression = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(current);
                expression = `tan(${current})`;
                break;
            case 'log':
                result = Math.log10(current);
                expression = `log(${current})`;
                break;
            case 'sqrt':
                result = Math.sqrt(current);
                expression = `√${current}`;
                break;
            case 'square':
                result = Math.pow(current, 2);
                expression = `${current}²`;
                break;
            case 'pi':
                result = Math.PI;
                expression = 'π';
                break;
            case 'e':
                result = Math.E;
                expression = 'e';
                break;
            default:
                return;
        }

        this.addHistory(expression, result);
        this.currentOperand = result.toString();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '×': computation = prev * current; break;
            case '÷': computation = prev / current; break;
            default: return;
        }

        const expression = `${prev} ${this.operation} ${current}`;
        this.addHistory(expression, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    addHistory(expression, result) {
        // Format decimal numbers so they don't get too long
        const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
        
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerText = `${expression} = ${formattedResult}`;
        
        // Add to the top of the list
        this.historyList.prepend(historyItem);
    }

    updateDisplay() {
        this.currentElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousElement.innerText = '';
        }
    }
}

// Hooking up the HTML elements to JavaScript
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const toolButtons = document.querySelectorAll('.tool');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const clearHistoryBtn = document.getElementById('clear-history');

const previousElement = document.getElementById('previous-operand');
const currentElement = document.getElementById('current-operand');
const historyList = document.getElementById('history-list');

const calculator = new Calculator(previousElement, currentElement, historyList);

// Adding Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.computeAdvanced(button.dataset.action);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
});



// --- Unit Converter Logic ---
const convType = document.getElementById('conv-type');
const convInput = document.getElementById('conv-input');
const convertBtn = document.getElementById('convert-btn');
const convOutput = document.getElementById('conv-output');

convertBtn.addEventListener('click', () => {
    const value = parseFloat(convInput.value);
    
    // Safety check: Make sure they typed a real number
    if (isNaN(value)) {
        convOutput.innerText = 'Result: Please enter a number';
        return;
    }

    let result = 0;
    let unit = '';

    // Calculate based on which dropdown option is selected
    switch (convType.value) {
        case 'kg-lbs': 
            result = value * 2.20462; 
            unit = 'lbs'; 
            break;
        case 'lbs-kg': 
            result = value / 2.20462; 
            unit = 'kg'; 
            break;
        case 'km-mi': 
            result = value * 0.621371; 
            unit = 'mi'; 
            break;
        case 'mi-km': 
            result = value / 0.621371; 
            unit = 'km'; 
            break;
    }
    
    // Display result rounded to 2 decimal places
    convOutput.innerText = `Result: ${result.toFixed(2)} ${unit}`;
});

// ==========================================
// 1. ISOLATED THEME TOGGLE (Only affects this tool)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        // Step 1: Check memory to see if Light Mode was active
        if (localStorage.getItem('multitool-theme') === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.src = '../icons/dark-mode.png';
        }

        // Step 2: Listen for button clicks
        themeToggle.addEventListener('click', () => {
            // Toggle local body ONLY
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Swap icon and save to memory
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