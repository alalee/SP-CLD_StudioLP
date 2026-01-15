// CTA Section - Scroll-triggered gradient transition
function handleCTAGradientScroll() {
    const ctaSection = document.getElementById('cta-section');
    const gradientOverlay = document.querySelector('.cta-gradient-overlay');

    if (!ctaSection || !gradientOverlay) return;

    const rect = ctaSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = ctaSection.offsetHeight;

    // Calculate how much of the section is visible
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;

    // Start transition when section enters viewport
    if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Calculate progress: 0 when section just enters, 1 when fully in view
        const visibleHeight = Math.min(windowHeight, sectionBottom) - Math.max(0, sectionTop);
        const progress = Math.min(1, visibleHeight / (windowHeight * 0.6));

        // Apply smooth easing to the progress
        const easedProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Update gradient overlay opacity
        gradientOverlay.style.opacity = easedProgress;

        // Update data attribute for text color transitions
        if (easedProgress > 0.5) {
            ctaSection.setAttribute('data-gradient-active', 'true');
        } else {
            ctaSection.setAttribute('data-gradient-active', 'false');
        }
    } else if (sectionTop >= windowHeight) {
        // Section not yet visible
        gradientOverlay.style.opacity = '0';
        ctaSection.setAttribute('data-gradient-active', 'false');
    } else if (sectionBottom <= 0) {
        // Section scrolled past
        gradientOverlay.style.opacity = '1';
        ctaSection.setAttribute('data-gradient-active', 'true');
    }
}

// Throttle scroll events for better performance
let ctaTicking = false;
function handleCTAScroll() {
    if (!ctaTicking) {
        window.requestAnimationFrame(() => {
            handleCTAGradientScroll();
            ctaTicking = false;
        });
        ctaTicking = true;
    }
}

window.addEventListener('scroll', handleCTAScroll, { passive: true });
window.addEventListener('load', handleCTAGradientScroll);
