/**
 * Arab Motion Academy - Enhanced Liquid Glass Landing Page
 * Interactive JavaScript with Visual Effects
 */

// ==========================================================================
// Scroll Progress Bar
// ==========================================================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scroll-progress');
        if (this.progressBar) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
    }

    update() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// ==========================================================================
// Cursor Glow Effect
// ==========================================================================
class CursorGlow {
    constructor() {
        this.glow = document.getElementById('cursor-glow');
        if (this.glow) {
            this.init();
        }
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.glow.style.left = `${e.clientX}px`;
                this.glow.style.top = `${e.clientY}px`;
            });
        });
    }
}

// ==========================================================================
// Floating Particles
// ==========================================================================
class ParticleSystem {
    constructor(count = 30) {
        this.container = document.getElementById('particles');
        this.count = count;
        if (this.container) {
            this.init();
        }
    }

    init() {
        for (let i = 0; i < this.count; i++) {
            this.createParticle(i);
        }
    }

    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 25}s`;
        particle.style.animationDuration = `${20 + Math.random() * 20}s`;
        this.container.appendChild(particle);
    }
}

// ==========================================================================
// Countdown Timer
// ==========================================================================
class CountdownTimer {
    constructor(endDate, onExpire) {
        this.endDate = new Date(endDate).getTime();
        this.onExpire = onExpire;
        this.elements = {
            // Desktop
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            discountText: document.getElementById('discount-text'),
            // Mobile
            mobileHours: document.getElementById('mobile-hours'),
            mobileMinutes: document.getElementById('mobile-minutes'),
            mobileSeconds: document.getElementById('mobile-seconds')
        };
        this.expired = false;
        this.start();
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.endDate - now;

        if (distance < 0) {
            clearInterval(this.interval);
            if (!this.expired) {
                this.expired = true;
                this.setExpired();
                if (this.onExpire) this.onExpire();
            }
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');

        // Desktop
        if (this.elements.hours) this.elements.hours.textContent = h;
        if (this.elements.minutes) this.elements.minutes.textContent = m;
        if (this.elements.seconds) this.elements.seconds.textContent = s;

        // Mobile
        if (this.elements.mobileHours) this.elements.mobileHours.textContent = h;
        if (this.elements.mobileMinutes) this.elements.mobileMinutes.textContent = m;
        if (this.elements.mobileSeconds) this.elements.mobileSeconds.textContent = s;
    }

    setExpired() {
        const expiredText = window.siteData?.discount?.expiredText || 'انتهى الخصم';

        if (this.elements.discountText) {
            this.elements.discountText.innerHTML = '<span class="expired-text">❌ ' + expiredText + '</span>';
        }

        // Set all to 00
        const zeros = '00';
        if (this.elements.hours) this.elements.hours.textContent = zeros;
        if (this.elements.minutes) this.elements.minutes.textContent = zeros;
        if (this.elements.seconds) this.elements.seconds.textContent = zeros;
        if (this.elements.mobileHours) this.elements.mobileHours.textContent = zeros;
        if (this.elements.mobileMinutes) this.elements.mobileMinutes.textContent = zeros;
        if (this.elements.mobileSeconds) this.elements.mobileSeconds.textContent = zeros;
    }
}

// ==========================================================================
// Floating Notifications (Social Proof)
// ==========================================================================
class NotificationSystem {
    constructor(messages, options = {}) {
        this.messages = messages || ['انضم طالب جديد إلى الكورس الآن'];
        this.container = document.getElementById('notification-container');
        this.sound = document.getElementById('notification-sound');
        this.muteBtn = document.getElementById('mute-btn');
        this.muted = localStorage.getItem('notificationMuted') === 'true';
        this.minInterval = options.minInterval || 60000; // 1 minute
        this.maxInterval = options.maxInterval || 180000; // 3 minutes

        this.init();
    }

    init() {
        this.updateMuteButton();

        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => this.toggleMute());
        }

        this.scheduleNext();
        setTimeout(() => this.show(), 8000);
    }

    updateMuteButton() {
        if (this.muteBtn) {
            this.muteBtn.textContent = this.muted ? '🔕' : '🔔';
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('notificationMuted', this.muted);
        this.updateMuteButton();
    }

    scheduleNext() {
        const delay = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
        setTimeout(() => {
            this.show();
            this.scheduleNext();
        }, delay);
    }

    show() {
        if (!this.container) return;

        const message = this.messages[Math.floor(Math.random() * this.messages.length)];

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span class="notification-icon">🔔</span>
            <span class="notification-text">${message}</span>
        `;

        this.container.appendChild(notification);

        if (!this.muted && this.sound) {
            this.sound.volume = 0.2;
            this.sound.play().catch(() => { });
        }

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// ==========================================================================
// Animated Counter
// ==========================================================================
class AnimatedCounter {
    constructor(element, target, duration = 2500) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.started = false;
    }

    start() {
        if (this.started) return;
        this.started = true;

        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Easing function (ease-out-expo)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (this.target - startValue) * easeOut);

            this.element.textContent = '+' + currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// ==========================================================================
// Scroll Animations
// ==========================================================================
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger counter animation
                    if (entry.target.id === 'stats') {
                        this.triggerCounter();
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => this.observer.observe(el));
    }

    triggerCounter() {
        const counterEl = document.getElementById('student-counter');
        if (counterEl && window.siteData?.stats?.students) {
            new AnimatedCounter(counterEl, window.siteData.stats.students).start();
        }
    }
}

// ==========================================================================
// Mouse Spotlight Effect on Cards
// ==========================================================================
class SpotlightEffect {
    constructor() {
        this.cards = document.querySelectorAll('.glass-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            const spotlight = card.querySelector('.spotlight');
            if (!spotlight) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                spotlight.style.left = x + 'px';
                spotlight.style.top = y + 'px';
            });
        });
    }
}

// ==========================================================================
// Smooth Reveal on Load
// ==========================================================================
class PageReveal {
    constructor() {
        this.init();
    }

    init() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }
}

// ==========================================================================
// Navbar - Always Fixed (No Hide on Scroll)
// ==========================================================================
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.floating-navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;
        // Navbar is always visible - no hide/show on scroll
        this.navbar.style.transform = 'translateX(-50%) translateY(0)';
    }
}

// ==========================================================================
// Accordion
// ==========================================================================
function toggleAccordion(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');

    const container = item.parentElement;
    container.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
    });

    if (!isActive) {
        item.classList.add('active');
    }
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// Tilt Effect on Cards
// ==========================================================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.glass-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ==========================================================================
// Initialize Everything
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const data = window.siteData || {};

    // Visual Effects
    new ScrollProgress();
    new CursorGlow();
    new ParticleSystem(25);

    // Page Effects
    new PageReveal();
    new NavbarScroll();

    // Countdown
    if (data.discount?.endDate) {
        new CountdownTimer(data.discount.endDate);
    }

    // Notifications
    new NotificationSystem(data.notifications);

    // Scroll Animations
    new ScrollAnimator();

    // Card Effects
    new SpotlightEffect();
    new TiltEffect();

    // Smooth Scroll
    initSmoothScroll();

    // Stats Counter - Separate Observer
    const statsSection = document.getElementById('stats');
    const counterEl = document.getElementById('student-counter');
    if (statsSection && counterEl && data.stats?.students) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new AnimatedCounter(counterEl, data.stats.students).start();
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(statsSection);
    }

    console.log('✨ Arab Motion Academy - Enhanced Liquid Glass Loaded!');
});

// Make toggleAccordion globally available
window.toggleAccordion = toggleAccordion;
