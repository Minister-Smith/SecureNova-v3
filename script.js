document.addEventListener('DOMContentLoaded', () => {
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (navWrapper) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navWrapper.classList.add('scrolled');
            } else {
                navWrapper.classList.remove('scrolled');
            }
        });
    }

    if (navLinks.length > 0) {
        const currentPath = decodeURIComponent(window.location.pathname);

        const normalizePath = (path) => path
            .replace(/\\/g, '/')
            .replace(/\/+/g, '/')
            .replace(/\/$/, '');

        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (!href) return;

            const resolvedPath = normalizePath(decodeURIComponent(new URL(href, window.location.href).pathname));
            const normalizedCurrentPath = normalizePath(currentPath);

            if (resolvedPath === normalizedCurrentPath) {
                link.classList.add('active');
            }

            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    const stageCards = document.querySelectorAll('.stage-card');
    stageCards.forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = 'learning-path/index.html';
        });
    });

    const phaseCards = document.querySelectorAll('.phase-card[data-phase-link]');
    phaseCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-phase-link');
            if (target) {
                window.location.href = target;
            }
        });
    });

    const resourceTabs = document.querySelectorAll('.resource-tab[data-resource-tab]');
    if (resourceTabs.length > 0) {
        const resourcePanes = document.querySelectorAll('.tab-pane');

        const activateResourceTab = (tab) => {
            resourceTabs.forEach(button => {
                button.classList.toggle('active', button.getAttribute('data-resource-tab') === tab);
            });
            resourcePanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === `tab-${tab}`);
            });
        };

        resourceTabs.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-resource-tab');
                if (tab) {
                    activateResourceTab(tab);
                }
            });
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .stage-card, .content-card, .knowledge-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // 学习路径页面的阶段导航跟随滚动
    const phaseNavLinks = document.querySelectorAll('.phase-nav a');
    const phaseSections = document.querySelectorAll('.phase-section');
    
    if (phaseNavLinks.length > 0 && phaseSections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 200;
            
            phaseSections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    phaseNavLinks.forEach(link => link.classList.remove('active-phase'));
                    phaseNavLinks[index]?.classList.add('active-phase');
                }
            });
        });
    }

    // 复制命令功能
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.getAttribute('data-command');
            if (command) {
                navigator.clipboard.writeText(command).then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i>已复制';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-copy"></i>复制';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            }
        });
    });
});