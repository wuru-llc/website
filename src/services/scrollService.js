class ScrollService {
  constructor() {
    this.scrollY = 0;
    this.listeners = [];

    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    this.scrollY = window.scrollY;
    this.notifyListeners();
  }

  // Agrega un suscriptor
  subscribe(listener) {
    this.listeners.push(listener);
    // Devuelve una función para eliminar el suscriptor
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notifica a todos los suscriptores
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.scrollY));
  }
}

// Instancia única del servicio de scroll
export const scrollService = new ScrollService();
