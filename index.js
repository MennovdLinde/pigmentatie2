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

fetch("home.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-home").innerHTML = html;
    const carousels = [
      "#carouselExampleSlidesOnly",
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
