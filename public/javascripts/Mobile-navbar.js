class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
      this.mobileMenu = document.querySelector(mobileMenu);
      this.navList = document.querySelector(navList);
      this.navLinks = document.querySelectorAll(navLinks);
      this.activeClass = "active";
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    animateLinks() {
      this.navLinks.forEach((link, index) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${
              index / 7 + 0.3
            }s`);
      });
    }
  
    handleClick() {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      this.animateLinks();
    }
  
    addClickEvent() {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  
    init() {
      if (this.mobileMenu) {
        this.addClickEvent();
      }
      return this;
    }
  }
  
  const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
  );
  mobileNavbar.init();

  const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  
  // Salvar a preferência do usuário no Armazenamento Local
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('modoEscuro', 'ativado');
  } else {
    localStorage.setItem('modoEscuro', 'desativado');
  }
});

// Verificar a preferência do usuário no Armazenamento Local ao carregar a página
window.addEventListener('load', () => {
  const modoEscuroSalvo = localStorage.getItem('modoEscuro');

  if (modoEscuroSalvo === 'ativado') {
    document.body.classList.add('dark');
    chk.checked = true; // Atualiza o estado do interruptor (se aplicável)
  }
});
