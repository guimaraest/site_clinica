class HamburgerMenu extends HTMLElement {
  connectedCallback () {
    this.menuButton = document.querySelector('#menuButton');
    this.header = document.querySelector('#siteHeader');
    this.nav = document.querySelector('#headerNav');
    this.panel = document.querySelector('#headerMobilePanel');
    this.overlay = document.querySelector('#menuOverlay');

    this.isOpen = false;

    this.mobileQuery = window.matchMedia('(max-width: 768px)');
    this.syncState();

    this.menuButton.addEventListener('click', () => {
      this.toggle();
    });

    this.overlay?.addEventListener('click', () => {
      if (this.isOpen) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.mobileQuery.addEventListener('change', () => {
      this.isOpen = false;
      this.syncState();
    });

    this.nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && this.mobileQuery.matches) this.close();
    });
  }

  syncState() {
    const isMobile = this.mobileQuery.matches;
    const isHidden = isMobile && !this.isOpen;
    const showMenu = isMobile && this.isOpen;

    this.menuButton.setAttribute('aria-expanded', String(this.isOpen));
    this.menuButton.setAttribute('aria-label', this.isOpen ? 'Fechar menu' : 'Abrir menu');
    this.panel?.setAttribute('aria-hidden', String(isHidden));
    if (this.panel) this.panel.inert = isHidden;
    this.header.classList.toggle('open', showMenu);
    this.menuButton.classList.toggle('open', showMenu);
    this.overlay?.classList.toggle('is-visible', showMenu);
    this.overlay?.setAttribute('aria-hidden', String(!showMenu));
    document.documentElement.style.overflow = showMenu ? 'hidden' : '';
    document.body.classList.toggle('menu-open', showMenu);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.syncState();
  }

  close () {
    this.isOpen = false;
    this.syncState();
    this.menuButton.focus();
  }
}

customElements.define('hamburger-menu', HamburgerMenu);