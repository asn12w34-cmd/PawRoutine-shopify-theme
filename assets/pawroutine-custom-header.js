class PawRoutineHeader {
  constructor(header) {
    this.header = header;
    this.toggleButton = header.querySelector('[data-pr-menu-toggle]');
    this.menu = header.querySelector('[data-pr-mobile-menu]');
    this.closeButtons = header.querySelectorAll('[data-pr-menu-close]');
    this.links = header.querySelectorAll('.pawroutine-mobile-menu__link');

    if (!this.toggleButton || !this.menu) return;

    this.onToggle = this.onToggle.bind(this);
    this.onClose = this.close.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.toggleButton.addEventListener('click', this.onToggle);
    this.closeButtons.forEach((button) => button.addEventListener('click', this.onClose));
    this.links.forEach((link) => link.addEventListener('click', this.onClose));
    document.addEventListener('keydown', this.onKeyDown);
  }

  onToggle() {
    const isOpen = this.header.dataset.menuOpen === 'true';
    isOpen ? this.close() : this.open();
  }

  open() {
    this.header.dataset.menuOpen = 'true';
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.toggleButton.setAttribute('aria-label', 'Close menu');
    this.menu.hidden = false;
    document.documentElement.classList.add('pr-nav-open');

    const firstFocusable = this.menu.querySelector('a, button');
    firstFocusable?.focus({ preventScroll: true });
  }

  close() {
    if (this.header.dataset.menuOpen !== 'true') return;

    this.header.dataset.menuOpen = 'false';
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.setAttribute('aria-label', 'Open menu');
    this.menu.hidden = true;
    document.documentElement.classList.remove('pr-nav-open');
    this.toggleButton.focus({ preventScroll: true });
  }

  onKeyDown(event) {
    if (event.key === 'Escape') this.close();
  }

  destroy() {
    this.toggleButton?.removeEventListener('click', this.onToggle);
    this.closeButtons?.forEach((button) => button.removeEventListener('click', this.onClose));
    this.links?.forEach((link) => link.removeEventListener('click', this.onClose));
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

const instances = new WeakMap();

function initPawRoutineHeaders(root = document) {
  root.querySelectorAll('[data-pr-header]').forEach((header) => {
    if (instances.has(header)) return;
    instances.set(header, new PawRoutineHeader(header));
  });
}

function destroyPawRoutineHeaders(root = document) {
  root.querySelectorAll('[data-pr-header]').forEach((header) => {
    const instance = instances.get(header);
    instance?.destroy();
    instances.delete(header);
  });
}

initPawRoutineHeaders();

document.addEventListener('shopify:section:load', (event) => initPawRoutineHeaders(event.target));
document.addEventListener('shopify:section:unload', (event) => destroyPawRoutineHeaders(event.target));
