// Smooth Scrolling and Navbar Effects
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar height

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effects
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class for background effects
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('videoModalTitle');
    const modalBody = document.getElementById('videoModalBody');
    const heroOrb = document.querySelector('.hero-orb');
    const heroSection = document.getElementById('home');

    function updateHeroOrb(event) {
        if (!heroOrb || !heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        heroOrb.style.left = `${x}px`;
        heroOrb.style.top = `${y}px`;

        const orbRadius = 90;
        const orbRect = {
            left: x - orbRadius,
            right: x + orbRadius,
            top: y - orbRadius,
            bottom: y + orbRadius
        };

        const textElements = [
            document.querySelector('.hero-tag'),
            document.querySelector('.hero-title'),
            ...document.querySelectorAll('.hero-desc')
        ];

        textElements.forEach(el => {
            if (!el) return;
            const elRect = el.getBoundingClientRect();
            const relativeRect = {
                left: elRect.left - rect.left,
                right: elRect.right - rect.left,
                top: elRect.top - rect.top,
                bottom: elRect.bottom - rect.top
            };
            const overlap =
                orbRect.left < relativeRect.right &&
                orbRect.right > relativeRect.left &&
                orbRect.top < relativeRect.bottom &&
                orbRect.bottom > relativeRect.top;
            el.classList.toggle('orb-target-highlight', overlap);
        });
    }

    if (heroSection) {
        heroSection.addEventListener('mousemove', updateHeroOrb);
        heroSection.addEventListener('mouseleave', function() {
            if (!heroOrb) return;
            heroOrb.style.left = '50%';
            heroOrb.style.top = '50%';
            document.querySelector('.hero-tag')?.classList.remove('orb-target-highlight');
            document.querySelector('.hero-title')?.classList.remove('orb-target-highlight');
            document.querySelectorAll('.hero-desc').forEach(el => el.classList.remove('orb-target-highlight'));
        });
    }

    function renderVideoContent(videoSrc, videoFiles, title) {
        modalTitle.textContent = title || 'Three Parts of Video';
        modalBody.innerHTML = '';

        if (videoFiles && videoFiles.length) {
            const group = document.createElement('div');
            group.className = 'video-modal__video-group';

            videoFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'video-modal__video-item';

                const button = document.createElement('button');
                button.className = 'video-modal__toggle';
                button.type = 'button';
                button.setAttribute('aria-expanded', 'false');

                const label = document.createElement('span');
                label.textContent = index === 0 ? 'Mobile' : index === 1 ? 'Website' : 'Mobile Dashboard';

                const arrow = document.createElement('span');
                arrow.textContent = '▾';

                button.appendChild(label);
                button.appendChild(arrow);

                const content = document.createElement('div');
                content.className = 'video-modal__content';
                content.hidden = true;

                const video = document.createElement('video');
                video.controls = true;
                video.preload = 'metadata';
                video.playsinline = true;

                const source = document.createElement('source');
                source.src = file;
                source.type = 'video/mp4';
                video.appendChild(source);

                content.appendChild(video);
                item.appendChild(button);
                item.appendChild(content);
                group.appendChild(item);

                button.addEventListener('click', () => {
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    button.setAttribute('aria-expanded', String(!isExpanded));
                    content.hidden = isExpanded;
                });
            });

            modalBody.appendChild(group);
            return;
        }

        if (videoSrc) {
            const video = document.createElement('video');
            video.controls = true;
            video.preload = 'metadata';
            video.playsinline = true;

            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';
            video.appendChild(source);

            modalBody.appendChild(video);
        }
    }

    document.querySelectorAll('.demo-video-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            link.classList.remove('is-clicked');
            void link.offsetWidth;
            link.classList.add('is-clicked');

            setTimeout(() => {
                link.classList.remove('is-clicked');
            }, 280);

            const videoSrc = this.getAttribute('data-video');
            const videoFilesAttr = this.getAttribute('data-videos');
            const title = this.getAttribute('data-title') || 'Project Demo';
            let videoFiles = [];

            if (videoFilesAttr) {
                try {
                    videoFiles = JSON.parse(videoFilesAttr);
                } catch (error) {
                    videoFiles = [];
                }
            }

            setTimeout(() => {
                renderVideoContent(videoSrc, videoFiles, title);
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
            }, 120);
        });
    });

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modalBody.innerHTML = '';
    }

    document.querySelectorAll('[data-close-modal]').forEach(element => {
        element.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Intersection Observer for section reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const target = entry.target;
            target.classList.toggle('animate-in', entry.isIntersecting);
        });
    }, observerOptions);

    // Observe sections for animation
    sections.forEach(section => {
        section.classList.add('reveal-section');
        observer.observe(section);
    });
}); 