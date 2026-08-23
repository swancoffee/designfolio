document.addEventListener('DOMContentLoaded', () => {
  const windowMask = document.querySelector('.odometer-window');
  const track = document.getElementById('odometerTrack');
  const buttons = document.querySelectorAll('.pill-btn');
  const roleItems = document.querySelectorAll('.role-item');
  const itemHeight = 32;
  const followBtn = document.getElementById('followBtn');
  const listenerCount = document.getElementById('listenerCount');
  const navContainer = document.querySelector('.floating-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const indicator = document.querySelector('.nav-pill-indicator');
  const cards = document.querySelectorAll('.bento-card');
  const dreamCards = document.querySelectorAll('.card-dream');
const wrapper = followBtn.parentElement;

  if (!track || buttons.length === 0) return;

  // Function to lock container width to a specific item
  function setOdometerWidth(index) {
    if (roleItems[index]) {
      // Temporary inline block measurement to get precise text width
      const targetWidth = roleItems[index].getBoundingClientRect().width;
      windowMask.style.width = `${targetWidth}px`;
    }
  }

  // (for item 0: "digital designer.")
  setOdometerWidth(0);
  
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(btn.getAttribute('data-index'));
      const isActive = btn.classList.contains('active');

      buttons.forEach((b) => b.classList.remove('active'));

      if (!isActive) {
        btn.classList.add('active');
        track.style.transform = `translateY(-${targetIndex * itemHeight}px)`;
        setOdometerWidth(targetIndex);
      } else {
        // Reset to default (index 0)
        track.style.transform = `translateY(0px)`;
        setOdometerWidth(0);
      }
    });

    // B. Micro-interaction: MOUSE DOWN (Press -> Squash)
    btn.addEventListener('mousedown', () => {
      // Clean up any old states
      btn.classList.remove('is-releasing'); 
      // Apply squash class
      btn.classList.add('is-pressing');
    });

    // C. Micro-interaction: MOUSE UP (Release -> Stretch & Settle)
    btn.addEventListener('mouseup', () => {
      // Transition from pressing squash to releasing stretch
      btn.classList.remove('is-pressing');
      btn.classList.add('is-releasing');

      // Optional: Prevent the button from getting stuck if clicked really fast
      setTimeout(() => {
        btn.classList.remove('is-releasing');
      }, 500); // Must match the animation duration in CSS
    });

    // D. Safety: MOUSE LEAVE (Reset if user slides off button while pressing)
    btn.addEventListener('mouseleave', () => {
      if (btn.classList.contains('is-pressing')) {
        btn.classList.remove('is-pressing');
        btn.classList.add('is-releasing');
        
        setTimeout(() => {
          btn.classList.remove('is-releasing');
        }, 500);
      }
    });
  });

    // ==========================================
  // 2. FOLLOWERS COUNT
  // ==========================================
if (followBtn && listenerCount) {
  const baseCount = 26051998;
  const targetCount = 26051999;
  let currentCount = baseCount;

  function renderNumber(number, animate = false) {
    const numberContainer = listenerCount.querySelector('.count-number');
    if (!numberContainer) return;

    const formatted = number.toLocaleString();

    // Initial buildup of 0-9 tracks for each digit
    if (!animate) {
      numberContainer.innerHTML = '';

      [...formatted].forEach(char => {
        if (char === ',') {
          const comma = document.createElement('span');
          comma.textContent = ',';
          numberContainer.appendChild(comma);
          return;
        }

        const digit = document.createElement('span');
        digit.className = 'digit';

        const track = document.createElement('span');
        track.className = 'digit-track';

        // Stack 0 through 9 vertically
        for (let i = 0; i <= 9; i++) {
          const span = document.createElement('span');
          span.textContent = i;
          track.appendChild(span);
        }

        digit.appendChild(track);
        numberContainer.appendChild(digit);
      });

      updateDigits(formatted, false);
      return;
    }

    updateDigits(formatted, true);
  }

  function updateDigits(formatted, animate) {
    const digits = listenerCount.querySelectorAll('.digit');
    let digitIndex = 0;

    [...formatted].forEach(char => {
      if (char === ',') return;

      const digit = digits[digitIndex];
      const track = digit.querySelector('.digit-track');
      const value = Number(char);

      // Slide the track vertically based on line-height (1.2em)
      track.style.transition = animate
        ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none';

      track.style.transform = `translateY(-${value * 1.2}em)`;

      digitIndex++;
    });
  }

  // Render original static number on load
  renderNumber(baseCount);

  // Click handling
  followBtn.addEventListener('click', () => {
    const isFollowing = followBtn.textContent === 'Follow';

    if (isFollowing) {
      followBtn.textContent = 'Followed';
      followBtn.classList.add('followed');

      currentCount = targetCount;
      renderNumber(currentCount, true);
    } else {
      followBtn.textContent = 'Follow';
      followBtn.classList.remove('followed');

      currentCount = baseCount;
      renderNumber(currentCount, true);
    }
  });
}

  // ==========================================
  // 3. WORK SHOWCASE CAROUSEL (Dark background)
  // ==========================================
  const showcaseCards = document.querySelectorAll('.card-showcase');

showcaseCards.forEach((card) => {
  const track = card.querySelector('.carousel-track');
  const prevBtn = card.querySelector('.prev-btn');
  const nextBtn = card.querySelector('.next-btn');
  const dots = card.querySelectorAll('.dot');

  if (!track) return;

  const getWidth = () => track.clientWidth;

  // 1. Next & Prev Arrow Clicks
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getWidth(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getWidth(), behavior: 'smooth' });
    });
  }

  // 2. Dot Clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      track.scrollTo({ left: index * getWidth(), behavior: 'smooth' });
    });
  });

  // 3. Update Active Dot on Scroll
  track.addEventListener('scroll', () => {
    const activeIndex = Math.round(track.scrollLeft / getWidth());
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });
});


  // ==========================================
  // UNIVERSAL PROFILE CAROUSEL (White cards)
  // ==========================================


dreamCards.forEach((card) => {
  const track = card.querySelector('.carousel-track');
  const dots = card.querySelectorAll('.dot');

  if (!track || dots.length === 0) return;

  const getWidth = () => track.clientWidth;

  // Click dot to jump to slide
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      track.scrollTo({
        left: index * getWidth(),
        behavior: 'smooth'
      });
    });
  });

  // Update active dot on scroll
  track.addEventListener('scroll', () => {
    const activeIndex = Math.round(track.scrollLeft / getWidth());
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });
});

followBtn.addEventListener('click', () => {
  // Remove class if re-clicked quickly to restart animation
  followBtn.classList.remove('is-clicked');
  
  // Force browser reflow
  void followBtn.offsetWidth; 
  
  // Add animation class
  followBtn.classList.add('is-clicked');
});
  // SVG star shape string
const starSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0033"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>`;

followBtn.addEventListener('click', (e) => {
  // Trigger your Jell-O wobble
  followBtn.classList.remove('is-clicked');
  void followBtn.offsetWidth;
  followBtn.classList.add('is-clicked');

  // Spawn 6 sparkles around the button
  for (let i = 0; i < 6; i++) {
    createSparkle();
  }
});

function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle-particle';
  sparkle.innerHTML = starSvg;

  // Randomize launch direction (X and Y coordinates)
  const angle = Math.random() * Math.PI * 2; // Random angle in radians
  const distance = 25 + Math.random() * 35;  // Distance from button edge in px
  
  const tx = `${Math.cos(angle) * distance}px`;
  const ty = `${Math.sin(angle) * distance}px`;

  // Set CSS variables for keyframe animation
  sparkle.style.setProperty('--tx', tx);
  sparkle.style.setProperty('--ty', ty);

  // Position relative to button bounds
  sparkle.style.left = `${Math.random() * 80 + 10}%`;
  sparkle.style.top = `${Math.random() * 60 + 20}%`;

  wrapper.appendChild(sparkle);

  // Clean up DOM after animation completes
  setTimeout(() => {
    sparkle.remove();
  }, 650);
}
});