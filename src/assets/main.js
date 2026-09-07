class HamburgerMenu extends HTMLElement {
  connectedCallback () {
    this.menuButton = document.querySelector('#menuButton');
    this.header = document.querySelector('#siteHeader');
    this.nav = document.querySelector('#headerNav');
    
    this.isOpen = false;

    this.mobileQuery = window.matchMedia('(max-width: 768px)');
    this.syncState();

    this.menuButton.addEventListener('click', () => {
      this.toggle();
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
    const isHidden = this.mobileQuery.matches && !this.isOpen;
    this.menuButton.setAttribute('aria-expanded', String(this.isOpen));
    this.menuButton.setAttribute('aria-label', this.isOpen ? 'Fechar menu' : 'Abrir menu');
    this.nav.setAttribute('aria-hidden', String(isHidden));
    this.header.classList.toggle('open', this.isOpen);
    this.menuButton.classList.toggle('open', this.isOpen);
    document.documentElement.style.overflow = this.isOpen ? 'hidden' : '';
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