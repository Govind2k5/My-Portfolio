(function () {
    function init() {
        var navbar = document.getElementById('navbar');
        var hamburger = document.getElementById('hamburger');
        var mobileMenu = document.getElementById('mobileMenu');

        // Navbar state on scroll
        function onScroll() { navbar.classList.toggle('scrolled', window.scrollY > 24); }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Mobile menu
        function toggleMenu(open) {
            var isOpen = (typeof open === 'boolean') ? open : !mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            var s = hamburger.querySelectorAll('span');
            if (isOpen) {
                s[0].style.transform = 'translateY(8px) rotate(45deg)';
                s[1].style.opacity = '0';
                s[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                for (var i = 0; i < s.length; i++) { s[i].style.transform = 'none'; s[i].style.opacity = '1'; }
            }
        }
        hamburger.addEventListener('click', function () { toggleMenu(); });
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
        });
        mobileMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { toggleMenu(false); });
        });

        // Smooth scroll for in-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#' || id.length < 2) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var y = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            });
        });

        // Scroll reveal
        var reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            // Light stagger inside shared containers
            document.querySelectorAll('.proj-grid, .skills-list, .exp-list, .contact-links').forEach(function (group) {
                var kids = group.children, n = 0;
                for (var i = 0; i < kids.length; i++) {
                    if (kids[i].classList.contains('reveal')) kids[i].dataset.delay = (n++) * 60;
                }
            });

            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            var vh = window.innerHeight || document.documentElement.clientHeight;
            reveals.forEach(function (el) {
                // Reveal anything already on-screen at load immediately; observe the rest.
                if (el.getBoundingClientRect().top < vh) {
                    el.classList.add('visible');
                } else {
                    io.observe(el);
                }
            });
        } else {
            reveals.forEach(function (el) { el.classList.add('visible'); });
        }

        window.__revealReady = true;
    }

    // Run now if the DOM is already parsed, otherwise wait. Guards against the
    // script executing after DOMContentLoaded has already fired.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
