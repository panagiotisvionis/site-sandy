document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navigation burger ─── */
  const burger = document.querySelector('.burger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    const toggleNavigation = () => {
      const isOpen = navLinks.classList.toggle('active');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    };

    burger.addEventListener('click', toggleNavigation);

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ─── Scroll progress bar ─── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* ─── Navbar shrink on scroll ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ─── Parallax hero background ─── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    const parallax = () => {
      const scrollY = window.scrollY;
      const limit = window.innerHeight;
      if (scrollY <= limit) {
        heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', parallax, { passive: true });
  }

  /* ─── Hero slider ─── */
  const slides = document.querySelectorAll('.mini-slider .slide');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let slideIndex = 0;

  const showSlide = (index) => {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === index);
    });
  };

  if (slides.length > 0) {
    showSlide(slideIndex);
    if (!prefersReducedMotion) {
      setInterval(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
      }, 4500);
    }
  }

  /* ─── Quote fade-in on scroll ─── */
  const quoteSection = document.querySelector('.quote-section blockquote');
  if (quoteSection) {
    quoteSection.classList.add('reveal-on-scroll');
  }

  /* ─── Reveal on scroll (IntersectionObserver) ─── */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  /* ─── Ripple effect on buttons ─── */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ─── Contact form ─── */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (formMessage) formMessage.textContent = 'Αποστολή...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('send failed');
        window.location.href = 'thank-you.html';
      } catch (err) {
        if (formMessage) {
          formMessage.textContent = 'Κάτι πήγε στραβά. Δοκιμάστε ξανά ή στείλτε email στο sandypf39@gmail.com.';
        }
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ─── Self check ─── */
  const selfCheckForm = document.getElementById('selfCheckForm');
  const selfCheckResult = document.getElementById('selfCheckResult');

  if (selfCheckForm && selfCheckResult) {
    selfCheckForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(selfCheckForm);
      const scores = { high: 0, medium: 0, low: 0 };

      ['stress', 'relationships', 'growth'].forEach((field) => {
        const value = formData.get(field);
        if (value && scores[value] !== undefined) scores[value] += 1;
      });

      const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      let primary = ranking[0][0];
      if (ranking[0][1] === ranking[1][1] && ranking[1][0] === 'medium') primary = 'medium';

      const messages = {
        high: {
          title: 'Ανάγκη για στοργική και δομημένη υποστήριξη',
          body: 'Η καθημερινότητα φαίνεται να σας πιέζει σημαντικά. Ένα σταθερό πλαίσιο συνεδριών θα σας προσφέρει χώρο για επεξεργασία, ρύθμιση και ασφάλεια.',
          actions: [
            'Κλείστε ατομικές συνεδρίες με ρυθμό που θα καθορίσουμε μαζί.',
            'Εξερευνήστε τεχνικές γείωσης και ρύθμισης άγχους που θα σας δώσω εξατομικευμένα.',
            'Σκεφτείτε να εντάξετε και μια συνεδρία συμβουλευτικής οικογένειας ή ζεύγους αν είναι σχετικό.',
          ],
        },
        medium: {
          title: 'Καθοδηγούμενη αλλαγή με πρακτικά εργαλεία',
          body: 'Γνωρίζετε τις ανάγκες σας και αναζητάτε δομημένη ενίσχυση. Μαζί μπορούμε να συνθέσουμε σχέδιο δράσης με συγκεκριμένα βήματα.',
          actions: [
            'Ξεκινήστε συνεδρίες ανά δύο εβδομάδες με ενδιάμεσα assignments.',
            'Συμμετέχετε σε θεματικά εργαστήρια ή ομάδες που εστιάζουν στην επικοινωνία και την αυτοφροντίδα.',
            'Λάβετε εξατομικευμένο υλικό (workbooks, journaling prompts) για να διατηρείτε την πρόοδο.',
          ],
        },
        low: {
          title: 'Συντήρηση ευεξίας και έμπνευση',
          body: 'Βρίσκεστε σε σταθερή φάση και επιθυμείτε να διατηρήσετε τη σύνδεση με τον εαυτό σας. Ας χτίσουμε πρακτικές ενσυνειδητότητας και αυτοφροντίδας.',
          actions: [
            'Κλείστε μία συνεδρία check-in κάθε 4-6 εβδομάδες για να συνδέουμε τα κέρδη σας.',
            'Αξιοποιήστε προγράμματα mindfulness και ασκήσεις αναπνοής που θα επιλέξουμε.',
            'Εγγραφείτε στο newsletter με μικρές ιδέες ευεξίας και journaling.',
          ],
        },
      };

      const result = messages[primary];
      if (result) {
        selfCheckResult.innerHTML = `
          <h3>${result.title}</h3>
          <p>${result.body}</p>
          <strong>Επόμενα βήματα:</strong>
          <ul class="self-check-actions">
            ${result.actions.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        `;
        selfCheckResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

});
