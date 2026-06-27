/* CUSTOM FILE [PR-004] — PawRoutine homepage product showcase behavior | See docs/CUSTOM_CHANGE_PAWROUTINE.md#PR-004 */

(() => {
  const ROOT = '[data-pwr-showcase]';

  function parseData(root) {
    const source = root.querySelector('[data-pwr-product-json]');
    if (!source) return null;

    try {
      return JSON.parse(source.textContent || '{}');
    } catch (error) {
      console.error('PawRoutine showcase: product data could not be read.', error);
      return null;
    }
  }

  function clamp(value, min, max) {
    let next = Number.isFinite(value) ? value : min;
    next = Math.max(min, next);
    return Number.isFinite(max) ? Math.min(max, next) : next;
  }

  function initGallery(root) {
    const track = root.querySelector('[data-pwr-track]');
    const slides = Array.from(root.querySelectorAll('[data-pwr-slide]'));
    const thumbs = Array.from(root.querySelectorAll('[data-pwr-thumb]'));
    const dots = Array.from(root.querySelectorAll('[data-pwr-dot]'));
    const dialog = root.querySelector('[data-pwr-dialog]');
    const dialogImage = root.querySelector('[data-pwr-dialog-image]');

    if (!track || !slides.length) return { setActive() {} };

    let activeIndex = 0;
    let focusReturn = null;

    function updateControls(index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));

      slides.forEach((slide, slideIndex) => {
        const selected = slideIndex === activeIndex;
        slide.classList.toggle('is-active', selected);
        slide.setAttribute('aria-hidden', String(!selected));
      });

      thumbs.forEach((thumb, thumbIndex) => {
        const selected = thumbIndex === activeIndex;
        thumb.classList.toggle('is-active', selected);
        thumb.setAttribute('aria-selected', String(selected));
      });

      dots.forEach((dot, dotIndex) => {
        const selected = dotIndex === activeIndex;
        dot.classList.toggle('is-active', selected);
        dot.setAttribute('aria-current', String(selected));
      });
    }

    function select(index, behavior = 'smooth') {
      const slide = slides[index];
      if (!slide) return;

      slide.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
      updateControls(index);
    }

    function selectByMediaId(mediaId, behavior = 'smooth') {
      if (!mediaId) return;
      const index = slides.findIndex((slide) => String(slide.dataset.pwrMediaId) === String(mediaId));
      if (index >= 0) select(index, behavior);
    }

    function setDialogImage(index) {
      if (!dialogImage) return;
      const slide = slides[index];
      if (!slide) return;

      dialogImage.src = slide.dataset.pwrZoomSrc || '';
      dialogImage.alt = slide.dataset.pwrZoomAlt || '';
    }

    function openDialog(trigger) {
      if (!dialog || !dialogImage) return;
      focusReturn = trigger instanceof HTMLElement ? trigger : document.activeElement;
      setDialogImage(activeIndex);
      dialog.showModal();
    }

    function closeDialog() {
      if (!dialog?.open) return;
      dialog.close();
      if (focusReturn instanceof HTMLElement) focusReturn.focus();
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => select(index));
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => select(index));
    });

    root.querySelectorAll('[data-pwr-open-dialog]').forEach((button) => {
      button.addEventListener('click', () => openDialog(button));
    });

    root.querySelector('[data-pwr-close-dialog]')?.addEventListener('click', closeDialog);
    root.querySelector('[data-pwr-dialog-prev]')?.addEventListener('click', () => {
      const next = (activeIndex - 1 + slides.length) % slides.length;
      updateControls(next);
      setDialogImage(next);
    });
    root.querySelector('[data-pwr-dialog-next]')?.addEventListener('click', () => {
      const next = (activeIndex + 1) % slides.length;
      updateControls(next);
      setDialogImage(next);
    });

    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = (activeIndex - 1 + slides.length) % slides.length;
        updateControls(next);
        setDialogImage(next);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = (activeIndex + 1) % slides.length;
        updateControls(next);
        setDialogImage(next);
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const index = slides.indexOf(visible.target);
          if (index >= 0) updateControls(index);
        },
        { root: track, threshold: [0.55, 0.7, 0.9] }
      );

      slides.forEach((slide) => observer.observe(slide));
    }

    updateControls(0);

    return { selectByMediaId };
  }

  function initProduct(root, gallery, data) {
    if (!data?.variants?.length) return;

    const variantInput = root.querySelector('[data-pwr-variant-id]');
    const optionInputs = Array.from(root.querySelectorAll('[data-pwr-option]'));
    const selectedValueNodes = Array.from(root.querySelectorAll('[data-pwr-selected-value]'));
    const price = root.querySelector('[data-pwr-price]');
    const compare = root.querySelector('[data-pwr-compare]');
    const saving = root.querySelector('[data-pwr-saving]');
    const status = root.querySelector('[data-pwr-status]');
    const addButton = root.querySelector('[data-pwr-add-button]');
    const addLabel = root.querySelector('[data-pwr-add-label]');
    const accelerated = root.querySelector('[data-pwr-accelerated]');
    const addContainer = root.querySelector('add-to-cart-component');
    const quantityInput = root.querySelector('[data-pwr-qty-input]');
    const minus = root.querySelector('[data-pwr-qty-minus]');
    const plus = root.querySelector('[data-pwr-qty-plus]');
    const addLabelDefault = root.dataset.addLabel || 'Add to cart';
    const soldOutLabel = root.dataset.soldOutLabel || 'Sold out';
    const unavailableLabel = root.dataset.unavailableLabel || 'Unavailable';

    function selectedOptions() {
      const values = [];
      optionInputs.forEach((input) => {
        const index = Number(input.dataset.pwrOption);
        if (input.checked) values[index] = input.value;
      });
      return values;
    }

    function getVariant(options) {
      return data.variants.find((variant) =>
        variant.options.every((option, index) => option === options[index])
      );
    }

    function updateOptionStates(options) {
      optionInputs.forEach((input) => {
        const index = Number(input.dataset.pwrOption);
        const candidate = input.value;
        const label = root.querySelector(`label[for="${input.id}"]`);

        const hasAvailableMatch = data.variants.some((variant) => {
          if (!variant.available || variant.options[index] !== candidate) return false;
          return variant.options.every((option, optionIndex) => optionIndex === index || option === options[optionIndex]);
        });

        label?.classList.toggle('is-unavailable', !hasAvailableMatch);
        input.setAttribute('aria-disabled', String(!hasAvailableMatch));
      });
    }

    function updateQuantityRules(variant) {
      if (!quantityInput || !variant) return;

      const min = Number(variant.min) || 1;
      const max = Number.isFinite(Number(variant.max)) && variant.max !== null ? Number(variant.max) : null;
      const step = Number(variant.step) || 1;
      const current = clamp(Number(quantityInput.value), min, max);

      quantityInput.min = String(min);
      quantityInput.step = String(step);
      quantityInput.value = String(current);

      if (max !== null) quantityInput.max = String(max);
      else quantityInput.removeAttribute('max');
    }

    function updateUI() {
      const options = selectedOptions();
      const variant = getVariant(options);
      updateOptionStates(options);

      selectedValueNodes.forEach((node) => {
        const index = Number(node.dataset.pwrSelectedValue);
        node.textContent = options[index] || '';
      });

      if (!variant) {
        if (variantInput) variantInput.value = '';
        addButton && (addButton.disabled = true);
        if (addLabel) addLabel.textContent = unavailableLabel;
        if (accelerated) accelerated.hidden = true;
        if (compare) compare.classList.add('is-hidden');
        if (saving) saving.classList.add('is-hidden');
        if (status) status.textContent = unavailableLabel;
        return;
      }

      if (variantInput) variantInput.value = String(variant.id);
      if (price) price.textContent = variant.price || '';

      const hasSale = Boolean(variant.compareAt && variant.saving);
      if (compare) {
        compare.textContent = variant.compareAt || '';
        compare.classList.toggle('is-hidden', !hasSale);
      }
      if (saving) {
        saving.textContent = hasSale ? `Save ${variant.saving}` : '';
        saving.classList.toggle('is-hidden', !hasSale);
      }

      const canAdd = Boolean(variant.available);
      if (addButton) addButton.disabled = !canAdd;
      if (addLabel) addLabel.textContent = canAdd ? addLabelDefault : soldOutLabel;
      if (accelerated) accelerated.hidden = !canAdd;
      if (status) status.textContent = canAdd ? '' : soldOutLabel;
      if (addContainer) addContainer.dataset.productVariantMedia = variant.mediaUrl || '';

      updateQuantityRules(variant);
      gallery.selectByMediaId(variant.mediaId, 'smooth');
    }

    optionInputs.forEach((input) => input.addEventListener('change', updateUI));

    function alterQuantity(direction) {
      if (!quantityInput) return;
      const min = Number(quantityInput.min) || 1;
      const max = quantityInput.max === '' ? null : Number(quantityInput.max);
      const step = Number(quantityInput.step) || 1;
      const next = clamp(Number(quantityInput.value) + direction * step, min, max);
      quantityInput.value = String(next);
      quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    minus?.addEventListener('click', () => alterQuantity(-1));
    plus?.addEventListener('click', () => alterQuantity(1));
    quantityInput?.addEventListener('change', () => {
      const min = Number(quantityInput.min) || 1;
      const max = quantityInput.max === '' ? null : Number(quantityInput.max);
      quantityInput.value = String(clamp(Number(quantityInput.value), min, max));
    });

    updateUI();
  }

  function init(root) {
    if (!(root instanceof HTMLElement) || root.dataset.pwrReady === 'true') return;
    root.dataset.pwrReady = 'true';

    const data = parseData(root);
    const gallery = initGallery(root);
    initProduct(root, gallery, data);
  }

  function initAll(scope = document) {
    scope.querySelectorAll(ROOT).forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll(), { once: true });
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
