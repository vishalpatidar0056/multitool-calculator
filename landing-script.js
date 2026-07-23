document.addEventListener('DOMContentLoaded', () => {

    // 1. Cinematic Scroll Reveal via IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed for better performance
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-zoom, .reveal-blur');
    revealElements.forEach(el => observer.observe(el));

    // Trigger navbar reveal immediately
    setTimeout(() => {
        document.querySelector('.glass-nav').classList.add('is-visible');
    }, 100);


    // 2. 3D Magnetic Hover Effect for Buttons (Linear-style)
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate mouse position relative to center of button
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull the button towards the mouse (mild strength)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        // Snap back smoothly when mouse leaves
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });


    // 3. 3D Tilt Effect for Bento Box Cards & Windows
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle (Max 8 degrees for elegance)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Remove inline transform to allow CSS transitions to handle the snap-back
            card.style.transform = '';
        });
    });


    // 4. Animated Number Counters (Triggers when scrolled into view)
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        // Math.ceil gives that snappy integer climb
                        counter.innerText = Math.ceil(current) + "+";
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (target > 0 ? "+" : "ms");
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if(statsSection) counterObserver.observe(statsSection);


    // 5. Typing Effect for the Search Bar Placeholder
    const searchInput = document.getElementById('landing-search');
    const placeholders = [
        "Search for 'Compound Interest'...",
        "Search for 'System of Equations'...",
        "Search for 'Base64 Encoder'...",
        "Search for 'BMI Calculator'..."
    ];
    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentString = placeholders[placeholderIndex];
        
        if (isDeleting) {
            searchInput.setAttribute('placeholder', currentString.substring(0, charIndex - 1));
            charIndex--;
        } else {
            searchInput.setAttribute('placeholder', currentString.substring(0, charIndex + 1));
            charIndex++;
        }

        let typingSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentString.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect slightly delayed
    setTimeout(typeEffect, 1500);

    // 6. CMD+K / CTRL+K Search Redirect Logic
    const searchWrapper = document.querySelector('.search-wrapper');

    const triggerSearch = (e) => {
        if (e) e.preventDefault();
        window.location.href = 'dashboard.html?focusSearch=true';
    };

    if (searchWrapper) {
        searchWrapper.addEventListener('click', triggerSearch);
    }

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            triggerSearch(e);
        }
    });

    // --- Dark/Light Mode Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (localStorage.getItem('multitool-theme') === 'light') {
        document.body.classList.add('light-theme');
    }

    const updateThemeIconAndStorage = () => {
        if (!themeIcon) return;
        const isLight = document.body.classList.contains('light-theme');
        themeIcon.src = isLight ? '../icons/dark-mode.png' : '../icons/light-mode.png';
        localStorage.setItem('multitool-theme', isLight ? 'light' : 'dark');
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            updateThemeIconAndStorage();
        });
    }

    updateThemeIconAndStorage();});
