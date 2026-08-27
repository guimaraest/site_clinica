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
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.nav.setAttribute('aria-hidden', 'true');
    this.header.classList.remove('open');
    document.documentElement.style.overflow = '';
    this.menuButton.focus();
  }
}

class DropdownMenu extends HTMLElement {
  connectedCallback () {
    
    this.button = this.querySelector('.dropdown-button');
    console.log(this.button);
    this.list = this.querySelector('.dropdown-list');
    this.parent = this.closest('.dropdown-parent');
    
    this.isOpen = false;

    this.button.setAttribute('aria-expanded', 'false');
    this.list.setAttribute('aria-hidden', 'true');

    this.button.addEventListener('click', () => {
      this.toggle();
    });

    this.button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.open();
        this.list.querySelector('a')?.focus();
      }

      if (event.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    document.addEventListener('click', (event) => {
      if (this.isOpen && !this.contains(event.target)) {
        this.close();
      }
    });
  }

  toggle () {
    console.log("dropdown toggle");
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

  open () {
    document.querySelectorAll('dropdown-menu').forEach((menu) => {
      if (menu !== this) menu.close();
    });

    this.isOpen = true;
    this.parent.classList.add('is-open');
    this.button.setAttribute('aria-expanded', 'true');
    this.list.setAttribute('aria-hidden', 'false');
  }

  close () {
    this.isOpen = false;
    this.parent.classList.remove('is-open');
    this.button.setAttribute('aria-expanded', 'false');
    this.list.setAttribute('aria-hidden', 'true');
  }

}

customElements.define('dropdown-menu', DropdownMenu);
customElements.define('hamburger-menu', HamburgerMenu);