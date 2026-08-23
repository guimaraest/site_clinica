class HamburgerMenu extends HTMLElement {
  connectedCallback() {
    this.menuButton = document.querySelector('#menuButton');
    this.header = document.querySelector('#siteHeader');
    this.nav = document.querySelector('#headerNav');

    if (!this.menuButton || !this.header || !this.nav) return;

    this.dropdownButtons = [...this.nav.querySelectorAll('.dropdown-button')];

    this.menuButton.addEventListener('click', () => this.toggleMenu());
    this.nav.addEventListener('click', (event) => this.handleNavClick(event));
    document.addEventListener('click', (event) => this.handleDocumentClick(event));
    document.addEventListener('keydown', (event) => this.handleKeydown(event));
  }

  toggleMenu() {
    const isOpen = this.menuButton.getAttribute('aria-expanded') === 'true';
    isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menuButton.setAttribute('aria-expanded', 'true');
    this.menuButton.setAttribute('aria-label', 'Fechar menu');
    this.nav.setAttribute('aria-hidden', 'false');
    this.header.classList.add('open');
    document.documentElement.classList.add('menu-is-open');
  }

  closeMenu(restoreFocus = true) {
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.menuButton.setAttribute('aria-label', 'Abrir menu');
    this.nav.setAttribute('aria-hidden', 'true');
    this.header.classList.remove('open');
    document.documentElement.classList.remove('menu-is-open');
    this.closeDropdowns();
    if (restoreFocus) this.menuButton.focus();
  }

  handleNavClick(event) {
    const button = event.target.closest('.dropdown-button');
    if (!button) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    this.closeDropdowns(button);
    button.setAttribute('aria-expanded', String(!isOpen));
    button.closest('.has-dropdown').classList.toggle('is-open', !isOpen);
  }

  handleDocumentClick(event) {
    if (!this.header.contains(event.target)) this.closeDropdowns();
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      const openButton = this.dropdownButtons.find((button) => button.getAttribute('aria-expanded') === 'true');
      if (openButton) {
        this.closeDropdowns();
        openButton.focus();
      } else if (this.menuButton.getAttribute('aria-expanded') === 'true') {
        this.closeMenu();
      }
    }
  }

  closeDropdowns(except = null) {
    this.dropdownButtons.forEach((button) => {
      if (button !== except) {
        button.setAttribute('aria-expanded', 'false');
        button.closest('.has-dropdown').classList.remove('is-open');
      }
    });
  }
}

customElements.define('hamburger-menu', HamburgerMenu);