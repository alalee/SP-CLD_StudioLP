// Tools section horizontal scroll functionality
const toolsScroll = document.querySelector('.tools-scroll');
const toolsLeftArrow = document.querySelector('.tools-arrow-left');
const toolsRightArrow = document.querySelector('.tools-arrow-right');

// Scroll amount per click (one card width + gap)
const scrollAmount = 384; // 360px card + 24px gap

if (toolsScroll && toolsLeftArrow && toolsRightArrow) {
    // Arrow button functionality
    toolsLeftArrow.addEventListener('click', () => {
        toolsScroll.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    toolsRightArrow.addEventListener('click', () => {
        toolsScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update arrow button states based on scroll position
    function updateToolsArrowStates() {
        const scrollLeft = toolsScroll.scrollLeft;
        const maxScroll = toolsScroll.scrollWidth - toolsScroll.clientWidth;

        toolsLeftArrow.disabled = scrollLeft <= 0;
        toolsRightArrow.disabled = scrollLeft >= maxScroll - 1;
    }

    // Listen for scroll events to update arrow states
    toolsScroll.addEventListener('scroll', updateToolsArrowStates);

    // Initialize arrow states on load
    updateToolsArrowStates();

    // Handle window resize
    window.addEventListener('resize', updateToolsArrowStates);
}

// Stats counter animation with smooth easing
function animateCounter(element, target, displayFormat, suffix = '') {
    const duration = 3000; // 3 seconds
    const startValue = target * 0.85; // Start from 85% of target
    const startTime = performance.now();

    // Smooth easing function
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    function formatNumber(value, format) {
        switch(format) {
            case '200K':
                return Math.round(value) + 'K';
            case '621':
                return Math.round(value).toString();
            case '1M':
                return value.toFixed(1) + 'M';
            case '$50M':
                return '$' + Math.round(value) + 'M';
            case '4.9':
                return value.toFixed(1);
            default:
                return Math.round(value).toString();
        }
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = startValue + (target - startValue) * easedProgress;

        element.textContent = formatNumber(current, displayFormat) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Ensure final value is exact
            element.textContent = formatNumber(target, displayFormat) + suffix;
        }
    }

    requestAnimationFrame(update);
}

// Intersection Observer for triggering animation when section is visible
const statsSection = document.querySelector('.stats-section');
const statNumbers = document.querySelectorAll('.stat-number');

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach((stat, index) => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const delay = index * 150; // 150ms delay between each stat

                setTimeout(() => {
                    // Determine which stat this is and animate accordingly
                    if (target === 200) {
                        animateCounter(stat, 200, '200K', '⁺');
                    } else if (target === 621) {
                        animateCounter(stat, 621, '621', '');
                    } else if (target === 1) {
                        animateCounter(stat, 1, '1M', '⁺');
                    } else if (target === 50) {
                        animateCounter(stat, 50, '$50M', '⁺');
                    } else if (target === 4.9) {
                        animateCounter(stat, 4.9, '4.9', '*');
                    }
                }, delay);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

if (statsSection) {
    observer.observe(statsSection);
}

// Migration section - scroll-triggered animation
function handleMigrationScrollAnimation() {
    const scrollContainer = document.getElementById('migration-scroll-container');
    const progressLine = document.getElementById('migration-progress-line');
    const scrollIndicator = document.getElementById('migration-scroll-indicator');
    const steps = [
        document.getElementById('migration-step-1'),
        document.getElementById('migration-step-2'),
        document.getElementById('migration-step-3')
    ];

    if (!scrollContainer || !progressLine) return;

    const containerTop = scrollContainer.offsetTop;
    const containerHeight = scrollContainer.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate scroll progress within the container (0 to 1)
    const scrollStart = containerTop;
    const scrollEnd = containerTop + containerHeight - windowHeight;
    const scrollRange = scrollEnd - scrollStart;

    const scrollPercent = Math.max(0, Math.min(1, (scrollY - scrollStart) / scrollRange));

    // Map scroll to line progress (0% to 100% of viewport width)
    const lineProgress = scrollPercent * 100;
    progressLine.style.width = `${lineProgress}%`;

    // Activate steps based on scroll progress
    // Step 1 activates at 5%, Step 2 at 40%, Step 3 at 75%
    const step1Threshold = 0.05;
    const step2Threshold = 0.40;
    const step3Threshold = 0.75;

    // Step 1
    if (scrollPercent >= step1Threshold && steps[0]) {
        steps[0].classList.add('active');
    } else if (steps[0]) {
        steps[0].classList.remove('active');
    }

    // Step 2
    if (scrollPercent >= step2Threshold && steps[1]) {
        steps[1].classList.add('active');
    } else if (steps[1]) {
        steps[1].classList.remove('active');
    }

    // Step 3
    if (scrollPercent >= step3Threshold && steps[2]) {
        steps[2].classList.add('active');
    } else if (steps[2]) {
        steps[2].classList.remove('active');
    }

    // Hide scroll indicator after scrolling starts
    if (scrollIndicator) {
        if (scrollPercent > 0.05) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }
}

window.addEventListener('scroll', handleMigrationScrollAnimation);
window.addEventListener('load', handleMigrationScrollAnimation);

// Pricing section - staggered fade-in animation
const pricingSection = document.querySelector('.pricing-section');
const pricingTiers = document.querySelectorAll('.pricing-tier');
const pricingFootnote = document.querySelector('.pricing-footnote');

if (pricingSection && pricingTiers.length > 0) {
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger the animations for each tier
                pricingTiers.forEach((tier, index) => {
                    setTimeout(() => {
                        tier.classList.add('visible');
                    }, index * 200); // 200ms delay between each tier
                });

                // Animate footnote after all tiers
                if (pricingFootnote) {
                    setTimeout(() => {
                        pricingFootnote.classList.add('visible');
                    }, pricingTiers.length * 200);
                }

                pricingObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    pricingObserver.observe(pricingSection);
}
