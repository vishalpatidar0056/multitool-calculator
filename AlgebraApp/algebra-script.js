// --- Tool 1: Quadratic Equation Roots ---
document.getElementById('btn-quad').addEventListener('click', () => {
    const a = parseFloat(document.getElementById('quad-a').value);
    const b = parseFloat(document.getElementById('quad-b').value);
    const c = parseFloat(document.getElementById('quad-c').value);
    const resultBox = document.getElementById('quad-result');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        return resultBox.innerText = "Please fill in a, b, and c.";
    }

    if (a === 0) {
        // If a=0, it's just a linear equation: bx + c = 0
        const x = -c / b;
        return resultBox.innerHTML = `<strong>Linear Root:</strong><br>x = ${x}`;
    }

    const discriminant = (b * b) - (4 * a * c);
    
    // Two Real Roots
    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        resultBox.innerHTML = `<strong>Two Real Roots:</strong><br>x₁ = ${parseFloat(root1.toFixed(4))}<br>x₂ = ${parseFloat(root2.toFixed(4))}`;
    } 
    // One Real Root
    else if (discriminant === 0) {
        const root = -b / (2 * a);
        resultBox.innerHTML = `<strong>One Real Root (Repeated):</strong><br>x = ${parseFloat(root.toFixed(4))}`;
    } 
    // Complex / Imaginary Roots
    else {
        const realPart = (-b / (2 * a)).toFixed(4);
        const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
        resultBox.innerHTML = `<strong>Complex Roots:</strong><br>x₁ = ${realPart} + ${imaginaryPart}i<br>x₂ = ${realPart} - ${imaginaryPart}i`;
    }
});


// --- Tool 2: System of Equations (Cramer's Rule) ---
document.getElementById('btn-sys').addEventListener('click', () => {
    const a1 = parseFloat(document.getElementById('sys-a1').value);
    const b1 = parseFloat(document.getElementById('sys-b1').value);
    const c1 = parseFloat(document.getElementById('sys-c1').value);
    
    const a2 = parseFloat(document.getElementById('sys-a2').value);
    const b2 = parseFloat(document.getElementById('sys-b2').value);
    const c2 = parseFloat(document.getElementById('sys-c2').value);
    
    const resultBox = document.getElementById('sys-result');

    if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
        return resultBox.innerText = "Please fill all 6 fields.";
    }

    // Determinants
    const D = (a1 * b2) - (a2 * b1);
    const Dx = (c1 * b2) - (c2 * b1);
    const Dy = (a1 * c2) - (a2 * c1);

    if (D === 0) {
        if (Dx === 0 && Dy === 0) {
            resultBox.innerHTML = "<strong>Infinite Solutions:</strong> The lines are exactly the same.";
        } else {
            resultBox.innerHTML = "<strong>No Solution:</strong> The lines are parallel and never intersect.";
        }
    } else {
        const x = Dx / D;
        const y = Dy / D;
        resultBox.innerHTML = `<strong>Solution Point:</strong><br>x = ${parseFloat(x.toFixed(4))}<br>y = ${parseFloat(y.toFixed(4))}`;
    }
});


// --- Tool 3: Coordinate Algebra ---
document.getElementById('btn-coord').addEventListener('click', () => {
    const x1 = parseFloat(document.getElementById('coord-x1').value);
    const y1 = parseFloat(document.getElementById('coord-y1').value);
    const x2 = parseFloat(document.getElementById('coord-x2').value);
    const y2 = parseFloat(document.getElementById('coord-y2').value);
    const resultBox = document.getElementById('coord-result');

    if ([x1, y1, x2, y2].some(isNaN)) {
        return resultBox.innerText = "Please provide both (x,y) points.";
    }

    // Distance Formula: √((x2 - x1)² + (y2 - y1)²)
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Midpoint Formula: ((x1 + x2)/2, (y1 + y2)/2)
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Slope Formula: (y2 - y1) / (x2 - x1)
    let slope = "Undefined (Vertical Line)";
    if (x2 - x1 !== 0) {
        slope = parseFloat(((y2 - y1) / (x2 - x1)).toFixed(4));
    }

    resultBox.innerHTML = `
        <strong>Distance between points:</strong> ${parseFloat(distance.toFixed(4))} units<br>
        <strong>Midpoint:</strong> (${parseFloat(midX.toFixed(4))}, ${parseFloat(midY.toFixed(4))})<br>
        <strong>Slope (m):</strong> ${slope}
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
