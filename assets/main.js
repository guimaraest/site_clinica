class HamburgerMenu extends HTMLElement {
  connectedCallback () {
    this.menuButton = document.querySelector('#menuButton');
    this.header = document.querySelector('#siteHeader');
    this.nav = document.querySelector('#headerNav');
    
    this.isOpen = false;

    this.menuButton.addEventListener('click', () => {
      this.toggle();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;

    this.menuButton.setAttribute('aria-expanded', String(this.isOpen));
    this.nav.setAttribute('aria-hidden', String(!this.isOpen));

    this.header.classList.toggle('open', this.isOpen);
    this.menuButton.classList.toggle('open', this.isOpen);

    if (this.isOpen) {
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.documentElement.style.overflow = '';
    }
  }

  close () {
    this.isOpen = false;
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.nav.setAttribute('aria-hidden', 'true');
    this.header.classList.remove('open');
    this.menuButton.classList.remove('open');
    document.documentElement.style.overflow = '';
    this.menuButton.focus();
  }
}

customElements.define('hamburger-menu', HamburgerMenu);