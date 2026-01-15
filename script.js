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

// Migration section - scroll-driven timeline
function handleMigrationScroll() {
    const timeline = document.getElementById('migration-section');
    const progressLine = document.getElementById('progress-line');

    if (!timeline || !progressLine) return;

    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate scroll progress
    const startScroll = timelineTop - windowHeight * 0.7;
    const endScroll = timelineTop + timelineHeight - windowHeight * 0.3;
    const scrollRange = endScroll - startScroll;

    const progress = Math.max(0, Math.min(1, (scrollY - startScroll) / scrollRange));

    // Update progress line
    progressLine.style.width = `${progress * 100}%`;

    // Update steps based on progress
    for (let i = 1; i <= 3; i++) {
        const stepProgress = (i - 1) / 2; // 0, 0.5, 1
        const circle = document.getElementById(`circle-${i}`);
        const content = document.getElementById(`content-${i}`);

        if (progress >= stepProgress) {
            // Active state
            circle.classList.add('active');
            content.classList.add('active');
        } else {
            // Inactive state
            circle.classList.remove('active');
            content.classList.remove('active');
        }
    }
}

window.addEventListener('scroll', handleMigrationScroll);
window.addEventListener('load', handleMigrationScroll);
