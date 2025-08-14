window.addEventListener("scroll", function () {
  const navbar = document.querySelector("nav.navbar");
  if (window.scrollY > 60) {
    navbar.classList.remove("navbar-large");
    navbar.classList.add("navbar-small");
  } else {
    navbar.classList.add("navbar-large");
    navbar.classList.remove("navbar-small");
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector("nav.navbar");
  navbar.classList.add("navbar-large");
});

function triggerBtn() {
  var triggetContact = document.getElementById("nav-contact-tab");
  triggetContact.click();
}

function triggerBtn2() {
  var triggetContact = document.getElementById("nav-behandelingen-tab");
  triggetContact.click();
}

let _beerResizeTimer;

window.addEventListener('orientationchange', () => {
  setTimeout(initBeerSliders, 250); // even wachten tot layout stabiel is
});

window.addEventListener('resize', () => {
  clearTimeout(_beerResizeTimer);
  _beerResizeTimer = setTimeout(() => initBeerSliders(), 300);
});

fetch("home.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-home").innerHTML = html;
    const carousels = [
      "#carouselExampleSlidesOnly1",
      "#carouselExampleSlidesOnly1mob",
      "#carouselExampleSlidesOnly2",
      "#carouselExampleSlidesOnly2mob",
    ];

    carousels.forEach((id) => {
      const element = document.querySelector(id);
      if (element) {
        new bootstrap.Carousel(element);
      }
    });
  });

fetch("behandelingen.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-behandelingen").innerHTML = html;
    initBeerSliders();
  });

function isVisible(el) {
  return el.offsetParent !== null;
}

function initBeerSliders() {
  const sliders = document.querySelectorAll(".beer-slider");

  sliders.forEach((slider) => {
    if (!isVisible(slider)) return; // skip verborgen sliders
    const images = slider.querySelectorAll("img");
    let loadedCount = 0;

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === images.length) {
            initializeSlider(slider);
          }
        });
        img.addEventListener("error", () => {
          loadedCount++;
        });
      }
    });

    if (loadedCount === images.length) {
      initializeSlider(slider);
    }
  });

  // fallback init na 2 seconden voor overgebleven sliders
  setTimeout(() => {
    sliders.forEach((slider) => {
      if (!slider.classList.contains("beer-loaded") && isVisible(slider)) {
        initializeSlider(slider);
      }
    });
  }, 2000);
}

function initializeSlider(slider) {
  if (!slider.classList.contains("beer-loaded")) {
    new BeerSlider(slider);
    slider.classList.add("beer-loaded");
  }
}

fetch("contact.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-contact").innerHTML = html;
    addAfsprakenToggleEvents();
  });

document
  .getElementById("nav-behandelingen-tab")
  .addEventListener("shown.bs.tab", function () {
    initBeerSliders();
  });

document.addEventListener("DOMContentLoaded", function () {
  const behandelingenTab = document.getElementById("nav-behandelingen-tab");
  const dropdown = document.getElementById("behandelingen-dropdown");

  behandelingenTab.addEventListener("click", function (e) {
    setTimeout(function () {
      const rect = behandelingenTab.getBoundingClientRect();
      dropdown.style.top = rect.bottom + "px";
      dropdown.style.display = "block";

      if (window.innerWidth <= 768) {
        // Op mobiel: gebruik offset tov parent
        dropdown.style.width = behandelingenTab.offsetWidth + "px";
        dropdown.style.left = behandelingenTab.offsetLeft + "px";
      } else {
        // Desktop
        dropdown.style.width = rect.width + "px";
        dropdown.style.left = rect.left + "px";
      }
    }, 150);

    document.addEventListener("click", function handler(evt) {
      if (!dropdown.contains(evt.target) && evt.target !== behandelingenTab) {
        dropdown.style.display = "none";
        document.removeEventListener("click", handler);
      }
    });
  });

  window.addEventListener("scroll", () => (dropdown.style.display = "none"));
  window.addEventListener("resize", () => (dropdown.style.display = "none"));
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".dropdown-item.scroll-offset")
    .forEach(function (item) {
      item.addEventListener("click", function (e) {
        // Voorkom normale jump
        e.preventDefault();

        // Haal target id uit href (#...)
        const id = this.getAttribute("href").substring(1);
        const target = document.getElementById(id);

        // Haal de navbar hoogte op (houd rekening met kleine/grote navbar)
        const navbar = document.querySelector("nav.navbar");
        const navbarHeight = navbar.offsetHeight;

        if (target) {
          // Bepaal de positie van het element
          const elementPosition =
            target.getBoundingClientRect().top + window.pageYOffset;
          // Scroll er naartoe met offset
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: "smooth",
          });
        }

        // Sluit de dropdown na klik
        document.getElementById("behandelingen-dropdown").style.display =
          "none";
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // HOME en CONTACT tab scroll to top
  document
    .getElementById("nav-home-tab")
    .addEventListener("click", function () {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120); // kleine delay voor animatie Bootstrap
    });
  document
    .getElementById("nav-contact-tab")
    .addEventListener("click", function () {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120);
    });
});
