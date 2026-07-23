// Select all navigation buttons and the iframe
const navButtons = document.querySelectorAll('.nav-btn');
const appFrame = document.getElementById('app-frame');

navButtons.forEach(button => {
    // --- 1. Master Click Event (Switching & Ripple) ---
    button.addEventListener('click', function(e) {
        if (button.classList.contains('disabled')) return;

        // Create the Ripple Span
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const circle = document.createElement('span');
        circle.classList.add('ripple');
        
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x - diameter / 2}px`;
        circle.style.top = `${y - diameter / 2}px`;
        
        button.appendChild(circle);
        
        // Remove ripple span from the HTML after animation finishes
        setTimeout(() => circle.remove(), 600);

        // App Switching Logic
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add a quick fade out/in effect to the iframe for smooth page transitions
        if (appFrame) {
            appFrame.style.opacity = '0';
            setTimeout(() => {
                appFrame.src = button.getAttribute('data-target');
                appFrame.style.opacity = '1';
            }, 150); // Matches iframe fade transition
        }
    });

    // --- 2. Magnetic Hover Effect ---
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the button
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Pull the button towards the cursor (15% pull strength)
        button.style.setProperty('--rx', `${x * 0.15}px`);
        button.style.setProperty('--ry', `${y * 0.15}px`);
    });

    // Snap back to normal when mouse leaves
    button.addEventListener('mouseleave', () => {
        button.style.setProperty('--rx', '0px');
        button.style.setProperty('--ry', '0px');
    });
});

// ==========================================
// 1. UPGRADED DROPDOWN-AWARE SEARCH LOGIC
// ==========================================
const searchInput = document.getElementById('tool-search');
const dropdownHeaders = document.querySelectorAll('.nav-dropdown-btn');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        dropdownHeaders.forEach(header => {
            const contentContainer = header.nextElementSibling;
            if (!contentContainer) return;

            const toolButtons = contentContainer.querySelectorAll('.nav-btn');
            let hasVisibleMatch = false;

            // 1. Check every tool inside this folder
            toolButtons.forEach(button => {
                const buttonText = button.innerText.toLowerCase();
                
                if (buttonText.includes(searchTerm)) {
                    button.classList.remove('hidden'); // Show matching tool
                    hasVisibleMatch = true;
                } else {
                    button.classList.add('hidden'); // Hide non-matching tool
                }
            });

            // 2. Adjust the Folders based on the search
            if (searchTerm === '') {
                header.style.display = 'flex'; // Show all headers
                
                if (header.classList.contains('active')) {
                    contentContainer.style.maxHeight = contentContainer.scrollHeight + "px";
                } else {
                    contentContainer.style.maxHeight = "0px";
                }
            } else {
                if (hasVisibleMatch) {
                    header.style.display = 'flex'; 
                    header.classList.add('active'); 
                    contentContainer.style.maxHeight = "2000px"; 
                } else {
                    header.style.display = 'none'; 
                    contentContainer.style.maxHeight = "0px"; 
                }
            }
        });
    });
}

// ==========================================
// 2. URL FOCUS SEARCH PARAMETER
// ==========================================
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('focusSearch') === 'true') {
    window.history.replaceState({}, document.title, 'dashboard.html');
    
    setTimeout(() => {
        const actualSearchInput = document.getElementById('tool-search');
        if (actualSearchInput) {
            actualSearchInput.focus();
            
            if (actualSearchInput.parentElement) {
                actualSearchInput.parentElement.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.4)';
                setTimeout(() => {
                    actualSearchInput.parentElement.style.boxShadow = '';
                }, 1500);
            }
        }
    }, 300);
}

// ==========================================
// 3. SAFE DARK/LIGHT MODE TOGGLE LOGIC
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Safely apply saved theme on load
if (localStorage.getItem('multitool-theme') === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) {
        themeIcon.src = 'icons/dark-mode.png';
    }
}

// Safely attach event listener if the button exists
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        if (themeIcon) {
            themeIcon.src = isLight ? 'icons/dark-mode.png' : 'icons/light-mode.png';
        }
        
        localStorage.setItem('multitool-theme', isLight ? 'light' : 'dark');
    });
}