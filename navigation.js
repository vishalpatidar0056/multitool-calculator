// ==========================================
// OMNITOOL NAVIGATION (IFRAME SYSTEM)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THE MAIN TV SCREEN (IFRAME) ---
    const toolFrame = document.getElementById('main-tool-frame');

    // --- 2. MOBILE DRAWER TOGGLE LOGIC ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-overlay');

    function openDrawer() {
        if(drawer) drawer.classList.add('active');
        if(overlay) overlay.classList.add('active');
    }

    function closeDrawer() {
        if(drawer) drawer.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // --- 3. MOBILE CATEGORY ACCORDION (For the Drawer) ---
    const mobileCategoryTitles = document.querySelectorAll('.mobile-category-title');
    
    mobileCategoryTitles.forEach(title => {
        title.addEventListener('click', () => {
            const sublist = title.nextElementSibling;
            title.classList.toggle('open');
            if (sublist) {
                sublist.classList.toggle('open');
            }
        });
    });

    // --- 4. DESKTOP CATEGORY ACCORDION (For the Sidebar) ---
    const desktopDropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
    
    desktopDropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const dropdownContent = btn.nextElementSibling;
            
            if (dropdownContent && dropdownContent.classList.contains('nav-dropdown-content')) {
                if (dropdownContent.style.maxHeight) {
                    dropdownContent.style.maxHeight = null;
                } else {
                    dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
                }
            }
        });
    });

    // --- 5. UNIVERSAL TOOL SWITCHING ---
    // Grabs BOTH desktop buttons (.nav-btn) and mobile buttons (.mobile-tool-item)
    const allToolButtons = document.querySelectorAll('.nav-btn, .mobile-tool-item');
    
    allToolButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPath = e.currentTarget.getAttribute('data-target');
            
            if (targetPath && toolFrame) {
                // 1. Change the iframe to the new file
                toolFrame.src = targetPath;
                
                // 2. Automatically close the mobile menu
                closeDrawer();

                // 3. Highlight the active button
                allToolButtons.forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
            } else if (!toolFrame) {
                console.warn("⚠️ Cannot switch tool: Iframe with ID 'main-tool-frame' missing.");
            } else if (!targetPath) {
                console.warn("⚠️ Cannot switch tool: Button is missing a data-target attribute.");
            }
        });
    });

});