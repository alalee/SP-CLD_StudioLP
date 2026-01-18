// Compare Page - Scroll Animations

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Stats animation
const statItems = document.querySelectorAll('.compare-stat-item');
if (statItems.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statItems.forEach(item => statsObserver.observe(item));
}

// Categories animation
const categories = document.querySelectorAll('.compare-category');
if (categories.length > 0) {
    const categoriesObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                categoriesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    categories.forEach(item => categoriesObserver.observe(item));
}

// Testimonials animation
const testimonialCards = document.querySelectorAll('.testimonial-card');
if (testimonialCards.length > 0) {
    const testimonialsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
                testimonialsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    testimonialCards.forEach(item => testimonialsObserver.observe(item));
}

// FAQ animation
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (index % 2) * 150); // Stagger by column
                faqObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    faqItems.forEach(item => faqObserver.observe(item));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter animation for savings amount
function animateSavings() {
    const savingsAmount = document.querySelector('.savings-amount');
    if (!savingsAmount) return;

    const target = 5400;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(target * easedProgress);

        savingsAmount.textContent = '$' + current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Trigger savings animation when visible
const calculatorSection = document.querySelector('.compare-calculator');
if (calculatorSection) {
    const calculatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSavings();
                calculatorObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    calculatorObserver.observe(calculatorSection);
}

// Custom Select Dropdowns for Demo Form
document.querySelectorAll('.demo-form .custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const dropdown = select.querySelector('.custom-select-dropdown');
    const options = select.querySelectorAll('.custom-select-option');
    const hiddenSelect = select.querySelector('select');
    const placeholder = trigger.textContent;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.demo-form .custom-select.open').forEach(s => {
            if (s !== select) s.classList.remove('open');
        });
        select.classList.toggle('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;

            // Update trigger text
            trigger.textContent = text;
            trigger.classList.add('has-value');

            // Update hidden select
            hiddenSelect.value = value;

            // Update selected state
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            // Close dropdown
            select.classList.remove('open');
        });
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.demo-form .custom-select.open').forEach(s => {
        s.classList.remove('open');
    });
});
