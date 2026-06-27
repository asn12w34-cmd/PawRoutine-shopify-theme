/*
CUSTOM FILE [PR-005] — PawRoutine homepage hero slideshow behavior | See docs/CUSTOM_CHANGES.md#PR-005
*/

(() => {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  class PwrSldHero extends HTMLElement {
    connectedCallback() {
      if (this.initialised) return;

      this.initialised = true;
      this.slides = [...this.querySelectorAll('[data-pwr-sld-slide]')];
      this.previousButton = this.querySelector('[data-pwr-sld-previous]');
      this.nextButton = this.querySelector('[data-pwr-sld-next]');
      this.toggleButton = this.querySelector('[data-pwr-sld-toggle]');
      this.toggleLabel = this.querySelector('[data-pwr-sld-toggle-label]');
      this.status = this.querySelector('[data-pwr-sld-status]');
      this.activeIndex = Math.max(0, this.slides.findIndex((slide) => slide.classList.contains('is-active')));
      this.canPlay = this.slides.length > 1 && Boolean(this.toggleButton);
      this.autoplayOnLoad = this.dataset.autoplay === 'true' && this.canPlay;
      this.interval = Math.max(Number(this.dataset.interval) || 9000, 1000);
      this.transitionDuration = Math.max(Number(this.dataset.transition) || 700, 0);
      this.timer = null;
      this.exitTimer = null;
      this.pageHidden = document.hidden;
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.userPaused = this.motionQuery.matches || !this.autoplayOnLoad;

      this.handlePrevious = this.handlePrevious.bind(this);
      this.handleNext = this.handleNext.bind(this);
      this.handleToggle = this.handleToggle.bind(this);
      this.handleMediaClick = this.handleMediaClick.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.handleMotionChange = this.handleMotionChange.bind(this);
      this.handleBlockSelect = this.handleBlockSelect.bind(this);

      this.slides.forEach((slide, index) => this.setSlideAccessibility(slide, index === this.activeIndex));
      this.updatePauseControl();
      this.bindEvents();
      this.preloadSlide(this.getNextIndex());
      this.startAutoplay();
    }

    disconnectedCallback() {
      this.stopAutoplay();
      window.clearTimeout(this.exitTimer);
      this.unbindEvents();
      this.initialised = false;
    }

    bindEvents() {
      this.previousButton?.addEventListener('click', this.handlePrevious);
      this.nextButton?.addEventListener('click', this.handleNext);
      this.toggleButton?.addEventListener('click', this.handleToggle);
      this.addEventListener('click', this.handleMediaClick);
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      document.addEventListener('shopify:block:select', this.handleBlockSelect);
      this.motionQuery.addEventListener?.('change', this.handleMotionChange);
    }

    unbindEvents() {
      this.previousButton?.removeEventListener('click', this.handlePrevious);
      this.nextButton?.removeEventListener('click', this.handleNext);
      this.toggleButton?.removeEventListener('click', this.handleToggle);
      this.removeEventListener('click', this.handleMediaClick);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      document.removeEventListener('shopify:block:select', this.handleBlockSelect);
      this.motionQuery.removeEventListener?.('change', this.handleMotionChange);
    }

    handlePrevious() {
      this.pauseForManualInteraction();
      this.goTo(this.getPreviousIndex(), { announce: true });
    }

    handleNext() {
      this.pauseForManualInteraction();
      this.goTo(this.getNextIndex(), { announce: true });
    }

    handleToggle() {
      this.userPaused = !this.userPaused;
      this.updatePauseControl();

      if (this.userPaused) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    }

    handleMediaClick(event) {
      const media = event.target.closest('.pwr-sld-hero__media');
      if (!media || !this.contains(media)) return;

      const slide = media.closest('[data-pwr-sld-slide]');
      if (slide !== this.slides[this.activeIndex]) return;

      this.pauseForManualInteraction();
    }

    handleVisibilityChange() {
      this.pageHidden = document.hidden;

      if (this.pageHidden) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    }

    handleMotionChange(event) {
      if (event.matches) {
        this.userPaused = true;
        this.stopAutoplay();
        this.updatePauseControl();
      }
    }

    handleBlockSelect(event) {
      if (!event.detail || event.detail.sectionId !== this.dataset.sectionId) return;

      const selectedSlide = event.target.closest?.('[data-pwr-sld-slide]');
      if (!selectedSlide) return;

      const selectedIndex = this.slides.indexOf(selectedSlide);
      if (selectedIndex >= 0) {
        this.goTo(selectedIndex, { announce: false });
      }
    }

    pauseForManualInteraction() {
      if (!this.canPlay) return;

      this.userPaused = true;
      this.stopAutoplay();
      this.updatePauseControl();
    }

    getNextIndex() {
      return (this.activeIndex + 1) % this.slides.length;
    }

    getPreviousIndex() {
      return (this.activeIndex - 1 + this.slides.length) % this.slides.length;
    }

    goTo(nextIndex, { announce = false } = {}) {
      if (this.slides.length < 2 || nextIndex === this.activeIndex) return;

      const currentSlide = this.slides[this.activeIndex];
      const nextSlide = this.slides[nextIndex];

      window.clearTimeout(this.exitTimer);
      currentSlide.classList.remove('is-active');
      currentSlide.classList.add('is-exiting');
      this.setSlideAccessibility(currentSlide, false);

      nextSlide.classList.remove('is-exiting');
      nextSlide.classList.add('is-active');
      this.setSlideAccessibility(nextSlide, true);
      this.activeIndex = nextIndex;

      this.exitTimer = window.setTimeout(() => {
        currentSlide.classList.remove('is-exiting');
      }, this.transitionDuration);

      this.preloadSlide(this.getNextIndex());

      if (announce && this.status) {
        this.status.textContent = `Slide ${this.activeIndex + 1} of ${this.slides.length}`;
      }
    }

    startAutoplay() {
      if (!this.canPlay || this.userPaused || this.pageHidden || this.slides.length < 2) return;

      this.stopAutoplay();
      this.timer = window.setTimeout(() => {
        this.goTo(this.getNextIndex());
        this.startAutoplay();
      }, this.interval);
    }

    stopAutoplay() {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    preloadSlide(index) {
      const image = this.slides[index]?.querySelector('.pwr-sld-hero__image');
      if (image && image.loading === 'lazy') {
        image.loading = 'eager';
      }
    }

    setSlideAccessibility(slide, isActive) {
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.toggleAttribute('inert', !isActive);

      slide.querySelectorAll(focusableSelector).forEach((element) => {
        if (isActive) {
          if (!element.hasAttribute('data-pwr-sld-tabindex')) return;

          const originalTabindex = element.getAttribute('data-pwr-sld-tabindex');
          if (originalTabindex === '__none__') {
            element.removeAttribute('tabindex');
          } else {
            element.setAttribute('tabindex', originalTabindex);
          }
          element.removeAttribute('data-pwr-sld-tabindex');
        } else {
          if (!element.hasAttribute('data-pwr-sld-tabindex')) {
            element.setAttribute('data-pwr-sld-tabindex', element.getAttribute('tabindex') ?? '__none__');
          }
          element.setAttribute('tabindex', '-1');
        }
      });
    }

    updatePauseControl() {
      if (!this.toggleButton) return;

      const label = this.userPaused ? 'Play slideshow' : 'Pause slideshow';
      this.toggleButton.setAttribute('aria-label', label);
      this.toggleButton.setAttribute('aria-pressed', String(this.userPaused));
      if (this.toggleLabel) this.toggleLabel.textContent = label;
    }
  }

  if (!customElements.get('pwr-sld-hero')) {
    customElements.define('pwr-sld-hero', PwrSldHero);
  }
})();
