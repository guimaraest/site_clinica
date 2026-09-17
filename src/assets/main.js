const menuButton = document.querySelector('#menuButton');
const header = document.querySelector('#siteHeader');
const nav = document.querySelector('#headerNav');

if (menuButton && header && nav) {
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  function syncState(isOpen) {
    menuButton.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Fechar menu' : 'Abrir menu'
    );

    nav.setAttribute(
      'aria-hidden',
      String(mobileQuery.matches && !isOpen)
    );

    header.classList.toggle('open', isOpen);
    menuButton.classList.toggle('open', isOpen);

    document.documentElement.style.overflow =
      isOpen && mobileQuery.matches ? 'hidden' : '';
  }

  function closeMenu() {
    syncState(false);
  }

  menuButton.addEventListener('click', () => {
    const isOpen =
      menuButton.getAttribute('aria-expanded') === 'true';

    syncState(!isOpen);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      menuButton.getAttribute('aria-expanded') === 'true'
    ) {
      closeMenu();
      menuButton.focus();
    }
  });

  nav.addEventListener('click', (event) => {
    if (
      event.target.closest('a') &&
      mobileQuery.matches
    ) {
      closeMenu();
    }
  });

  mobileQuery.addEventListener('change', () => {
    closeMenu();
  });

  syncState(false);
}