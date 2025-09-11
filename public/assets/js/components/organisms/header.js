/* ==========================================================================
   @ORGANISMS - HEADER
   - Mobile menu functionality and contact link active state management
   - FIXED: Robust contact link current state detection
   ========================================================================== */

   document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu functionality
    function initMobileMenu() {
        const burgerToggle = document.getElementById('burger-toggle');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const burgerIconOpen = burgerToggle?.querySelector('.burger-icon-open');
        const burgerIconClose = burgerToggle?.querySelector('.burger-icon-close');
        
        if (!burgerToggle || !mobileOverlay || !burgerIconOpen || !burgerIconClose) {
            console.warn('Header: Mobile menu elements not found');
            return;
        }
        
        // Initialize burger icons styles
        function initBurgerStyles() {
            burgerIconOpen.style.opacity = '1';
            burgerIconOpen.style.transition = 'none';
            
            burgerIconClose.style.opacity = '0';
            burgerIconClose.style.transition = 'none';
        }
        
        // Initialize mobile overlay styles
        function initOverlayStyles() {
            mobileOverlay.style.display = 'none';
            mobileOverlay.style.opacity = '0';
            mobileOverlay.style.visibility = 'hidden';
            mobileOverlay.style.transform = 'translateY(-5px)';
            mobileOverlay.style.transition = 'opacity 0.3s ease';
            mobileOverlay.style.zIndex = '1';
            
            // Responsive positioning
            if (window.innerWidth <= 639) {
                mobileOverlay.style.top = '75px';
            } else {
                mobileOverlay.style.top = '87px';
            }
        }
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            burgerToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle burger icons
            if (!isExpanded) {
                burgerIconOpen.style.opacity = '0';
                burgerIconClose.style.opacity = '1';
            } else {
                burgerIconOpen.style.opacity = '1';
                burgerIconClose.style.opacity = '0';
            }
            
            // Toggle overlay visibility
            if (!isExpanded) {
                // Show overlay
                mobileOverlay.style.display = 'block';
                mobileOverlay.style.opacity = '1';
                mobileOverlay.style.visibility = 'visible';
                mobileOverlay.style.transform = 'translateY(0)';
                mobileOverlay.style.zIndex = '50';
                document.body.style.overflow = 'hidden';
            } else {
                // Hide overlay
                closeMobileMenu();
            }
        }
        
        // Close mobile menu
        function closeMobileMenu() {
            burgerToggle.setAttribute('aria-expanded', 'false');
            
            // Reset burger icons
            burgerIconOpen.style.opacity = '1';
            burgerIconClose.style.opacity = '0';
            
            // Hide overlay
            mobileOverlay.style.display = 'none';
            mobileOverlay.style.opacity = '0';
            mobileOverlay.style.visibility = 'hidden';
            mobileOverlay.style.transform = 'translateY(-5px)';
            mobileOverlay.style.zIndex = '1';
            document.body.style.overflow = '';
        }
        
        // Handle window resize
        function handleResize() {
            // Update overlay positioning
            if (window.innerWidth <= 639) {
                mobileOverlay.style.top = '75px';
            } else {
                mobileOverlay.style.top = '87px';
            }
            
            // Close menu on desktop
            if (window.innerWidth >= 1025) {
                closeMobileMenu();
            }
        }
        
        // Initialize styles
        initBurgerStyles();
        initOverlayStyles();
        
        // Event listeners
        burgerToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on overlay
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileOverlay.querySelectorAll('.link--tab');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.style.opacity === '1') {
                closeMobileMenu();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', handleResize);
    }
    
    // FIXED: Enhanced contact link active state management
    function initContactActiveState() {
        // Try multiple selectors to find the contact link
        const contactLink = document.querySelector('.header-navigation .link--nav') ||
                          document.querySelector('.header-navigation .link--nav-white') ||
                          document.querySelector('[href*="contact"]') ||
                          document.querySelector('a[href="#contact"]');
        
        let observer = null;
        
        if (!contactLink) {
            console.warn('Header: Contact link not found with any selector');
            return;
        }
        
        console.log('Header: Contact link found:', contactLink);
        
        // Always make contact link bold
        contactLink.style.fontWeight = 'bold';
        
        // Enhanced detection function
        function isContactSectionActive() {
            const currentHash = window.location.hash;
            
            // Method 1: Hash detection
            if (currentHash === '#contact') {
                return true;
            }
            
            // Method 2: Check tab sections system
            const contactTabSection = document.querySelector('#contact');
            if (contactTabSection) {
                // Check if contact section is visible via :target or display
                const isTarget = contactTabSection.matches(':target');
                const hasDisplayBlock = contactTabSection.style.display === 'block';
                const hasDisplayFlex = contactTabSection.style.display === 'flex';
                const hasNoDisplay = !contactTabSection.style.display || contactTabSection.style.display === '';
                
                if (isTarget || hasDisplayBlock || hasDisplayFlex) {
                    return true;
                }
                
                // Check if it's the default tab and no hash
                if (contactTabSection.hasAttribute('data-default') && !window.location.hash) {
                    return true;
                }
            }
            
            // Method 3: Check active tab in tab menu
            const activeTabLink = document.querySelector('.tab-menu .link--tab.current, .tab-menu .link--tab[aria-current="page"]');
            if (activeTabLink && activeTabLink.getAttribute('href') === '#contact') {
                return true;
            }
            
            // Method 4: Check URL pathname for contact page
            if (window.location.pathname.includes('contact')) {
                return true;
            }
            
            return false;
        }
        
        // Update contact link active state
        function updateContactActiveState() {
            const isActive = isContactSectionActive();
            
            console.log('Header: Contact section active?', isActive);
            
            if (isActive) {
                contactLink.classList.add('current');
                contactLink.setAttribute('aria-current', 'page');
                contactLink.style.pointerEvents = 'none';
                startObserver();
            } else {
                contactLink.classList.remove('current');
                contactLink.removeAttribute('aria-current');
                contactLink.style.pointerEvents = '';
                stopObserver();
            }
        }
        
        // Start MutationObserver for dynamic changes
        function startObserver() {
            if (observer || !window.MutationObserver) return;
            
            const contactSection = document.querySelector('#contact');
            if (!contactSection) return;
            
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        setTimeout(updateContactActiveState, 10);
                    }
                });
            });
            
            observer.observe(contactSection, { 
                attributes: true, 
                attributeFilter: ['style', 'class'] 
            });
        }
        
        // Stop MutationObserver when not needed
        function stopObserver() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
        
        // Initial check with delay to ensure DOM is ready
        setTimeout(updateContactActiveState, 100);
        
        // Listen for hash changes
        window.addEventListener('hashchange', function() {
            setTimeout(updateContactActiveState, 10);
        });
        
        // Listen for tab menu clicks with more robust detection
        document.addEventListener('click', function(e) {
            const clickedLink = e.target.closest('a[href*="#"]');
            if (clickedLink) {
                setTimeout(updateContactActiveState, 100);
            }
        });
        
        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', function() {
            setTimeout(updateContactActiveState, 10);
        });
        
        // Periodic check as fallback (every 2 seconds)
        setInterval(updateContactActiveState, 2000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', stopObserver);
    }
    
    // Initialize header functionality
    initMobileMenu();
    initContactActiveState();
    
    console.log('Header organism initialized successfully');
    
});