// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // ===== Initialize Variables =====
    const body = document.body;
    const cursorFollower = document.querySelector('.cursor-follower');
    const themeSwitch = document.getElementById('theme-switch');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const statsNumbers = document.querySelectorAll('.stat-number');
    const skillCards = document.querySelectorAll('.skill-card');
    const projectSlides = document.querySelectorAll('.project-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const contactForm = document.querySelector('.contact-form');
    const backToTop = document.querySelector('.back-to-top');
    const navGlass = document.querySelector('.nav-glass');
    
    // Current slide index for projects slider
    let currentSlide = 0;
    
    // ===== Particle System =====
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = Math.random() > 0.5 ? '#00f3ff' : '#9d00ff';
                this.opacity = Math.random() * 0.5 + 0.1;
                this.waveOffset = Math.random() * Math.PI * 2;
            }
            
            update(mouse) {
                // Move particle
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Add wave motion
                this.x += Math.sin(this.waveOffset + Date.now() * 0.001) * 0.3;
                this.y += Math.cos(this.waveOffset + Date.now() * 0.001) * 0.3;
                
                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        const angle = Math.atan2(dy, dx);
                        const force = (100 - distance) / 100;
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
                
                // Boundary check
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
                
                // Update wave offset
                this.waveOffset += 0.02;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                
                // Add glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, this.size,
                    this.x, this.y, this.size * 3
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
        
        // Initialize particles
        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop
        const mouse = { x: null, y: null };
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update(mouse);
                particle.draw();
            });
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
            ctx.lineWidth = 0.5;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        // Mouse move listener
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        // Mouse leave listener
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });
        
        // Initialize
        resizeCanvas();
        init();
        animate();
    }
    
    // ===== Custom Cursor =====
    function initCustomCursor() {
        if (window.innerWidth > 768) { // Only on desktop
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            function animateCursor() {
                // Smooth cursor movement
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;
                
                cursorFollower.style.left = cursorX + 'px';
                cursorFollower.style.top = cursorY + 'px';
                
                requestAnimationFrame(animateCursor);
            }
            
            // Add active class on clickable elements
            const clickableElements = document.querySelectorAll('a, button, .orbit-item, .slider-btn, .social-link');
            
            clickableElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorFollower.classList.add('active');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorFollower.classList.remove('active');
                });
            });
            
            animateCursor();
        } else {
            // Hide custom cursor on mobile
            cursorFollower.style.display = 'none';
            body.style.cursor = 'auto';
        }
    }
    
    // ===== Theme Toggle =====
    function initThemeToggle() {
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            body.classList.add('light-mode');
            themeSwitch.checked = true;
        }
        
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // ===== Mobile Menu =====
    function initMobileMenu() {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = 'auto';
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    }
    
    // ===== Parallax Scrolling =====
    function initParallax() {
        let scrollPosition = 0;
        let ticking = false;
        
        function updateParallax() {
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
                const yPos = -(scrollPosition * speed);
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            // Update navbar on scroll
            if (scrollPosition > 100) {
                navGlass.classList.add('scrolled');
            } else {
                navGlass.classList.remove('scrolled');
            }
            
            // Update active nav link based on scroll position
            updateActiveNavLink();
            
            ticking = false;
        }
        
        function onScroll() {
            scrollPosition = window.pageYOffset;
            
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll);
        onScroll(); // Initialize
    }
    
    // ===== Update Active Navigation Link =====
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ===== Smooth Scrolling =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ===== Animated Stats Counter =====
    function initStatsCounter() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                stat.textContent = target;
                                clearInterval(timer);
                                
                                // Animate stat bar
                                const statBar = stat.nextElementSibling.nextElementSibling;
                                if (statBar) {
                                    statBar.style.width = '100%';
                                }
                            } else {
                                stat.textContent = Math.floor(current);
                            }
                        }, 16);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) observer.observe(aboutSection);
    }
    
    // ===== Skills Interaction =====
    function initSkillsInteraction() {
        const orbitItems = document.querySelectorAll('.orbit-item');
        
        orbitItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const skillName = item.getAttribute('data-skill');
                
                // Update skill card based on hovered skill
                skillCards.forEach(card => {
                    const title = card.querySelector('.skill-title').textContent;
                    if (title.toLowerCase().includes(skillName.toLowerCase())) {
                        skillCards.forEach(c => c.classList.remove('skill-card-active'));
                        card.classList.add('skill-card-active');
                        
                        // Animate progress bar
                        const percentage = card.querySelector('.skill-percentage').textContent;
                        const progressFill = card.querySelector('.progress-fill');
                        progressFill.style.width = percentage;
                    }
                });
            });
        });
        
        // Initialize progress bars
        skillCards.forEach(card => {
            const percentage = card.querySelector('.skill-percentage').textContent;
            const progressFill = card.querySelector('.progress-fill');
            progressFill.style.width = percentage;
        });
    }
    
    // ===== Projects Slider =====
    function initProjectsSlider() {
        function showSlide(index) {
            // Hide all slides
            projectSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Update dots
            sliderDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show current slide
            projectSlides[index].classList.add('active');
            sliderDots[index].classList.add('active');
            currentSlide = index;
        }
        
        // Next slide
        function nextSlide() {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= projectSlides.length) nextIndex = 0;
            showSlide(nextIndex);
        }
        
        // Previous slide
        function prevSlide() {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) prevIndex = projectSlides.length - 1;
            showSlide(prevIndex);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Dot navigation
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        // Auto slide (optional)
        // setInterval(nextSlide, 5000);
    }
    
    // ===== Contact Form =====
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                alert('Thank you for your message! I will get back to you soon.');
                
                // Remove loading state
                submitBtn.classList.remove('loading');
            }, 2000);
        });
    }
    
    // ===== Back to Top Button =====
    function initBackToTop() {
        if (!backToTop) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }
    
    // ===== Scroll Animations =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements with 'hidden' class
        document.querySelectorAll('.hidden').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== Initialize All Functions =====
    function init() {
        initParticles();
        initCustomCursor();
        initThemeToggle();
        initMobileMenu();
        initParallax();
        initSmoothScroll();
        initStatsCounter();
        initSkillsInteraction();
        initProjectsSlider();
        initContactForm();
        initBackToTop();
        initScrollAnimations();
        
        // Add initial animations
        setTimeout(() => {
            document.querySelectorAll('.title-word').forEach((word, index) => {
                word.style.animationDelay = `${index * 0.3}s`;
            });
        }, 100);
        
        console.log('Portfolio initialized with advanced parallax effects!');
    }
    
    // Start the application
    init();
});