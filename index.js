// ========= NAVBAR GROOT/KLEIN OP SCROLL =========
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

// ========= HULPFUNCTIES =========
function getNavbarHeight() {
  const navbar = document.querySelector("nav.navbar");
  return navbar ? navbar.offsetHeight : 0;
}

function scrollToWithOffset(targetEl) {
  const offset = getNavbarHeight();
  const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

// Wacht tot een tab zichtbaar is, scroll dan naar het anker
function openTabThenScroll(tabBtnId, anchorId) {
  const tabBtn = document.getElementById(tabBtnId);

  const doScroll = () => {
    const target = document.getElementById(anchorId);
    if (target) {
      // kleine delay zodat layout kan stabiliseren
      setTimeout(() => scrollToWithOffset(target), 50);
    }
  };

  // Als tab al actief is, meteen scrollen
  if (tabBtn && tabBtn.getAttribute("aria-selected") === "true") {
    doScroll();
    return;
  }

  if (!tabBtn) {
    // Geen specifieke tab-knop gevonden → direct proberen te scrollen
    doScroll();
    return;
  }

  // Anders: wachten tot de tab is "getoond", dán scrollen
  const onShown = () => {
    tabBtn.removeEventListener("shown.bs.tab", onShown);
    doScroll();
  };
  tabBtn.addEventListener("shown.bs.tab", onShown);
  tabBtn.click();
}

// ========= CTA BUTTONS =========
function triggerBtn() {
  var triggetContact = document.getElementById("nav-contact-tab");
  triggetContact.click();
}
function triggerBtn2() {
  var triggetContact = document.getElementById("nav-behandelingen-tab");
  triggetContact.click();
}

// ========= BEERSLIDER & RESPONSIVE =========
let _beerResizeTimer;

window.addEventListener("orientationchange", () => {
  setTimeout(initBeerSliders, 250); // even wachten tot layout stabiel is
});

window.addEventListener("resize", () => {
  clearTimeout(_beerResizeTimer);
  _beerResizeTimer = setTimeout(() => initBeerSliders(), 300);
});

function isVisible(el) {
  return el && el.offsetParent !== null;
}

function initializeSlider(slider) {
  if (!slider.classList.contains("beer-loaded")) {
    new BeerSlider(slider);
    slider.classList.add("beer-loaded");
  }
}

function initBeerSliders() {
  const sliders = document.querySelectorAll(".beer-slider");

  sliders.forEach((slider) => {
    if (!isVisible(slider)) return; // skip verborgen sliders
    const images = slider.querySelectorAll("img");
    let loadedCount = 0;

    const tryInit = () => {
      if (loadedCount === images.length) initializeSlider(slider);
    };

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        tryInit();
      } else {
        img.addEventListener("load", () => {
          loadedCount++;
          tryInit();
        });
        img.addEventListener("error", () => {
          loadedCount++;
          tryInit();
        });
      }
    });

    // Fallback init na 2 seconden
    setTimeout(() => {
      if (!slider.classList.contains("beer-loaded") && isVisible(slider)) {
        initializeSlider(slider);
      }
    }, 2000);
  });
}

// ========= CONTENT LADEN =========
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
      if (element) new bootstrap.Carousel(element);
    });
  });

fetch("behandelingen.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-behandelingen").innerHTML = html;
    initBeerSliders();
  });

fetch("contact.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-contact").innerHTML = html;
    // addAfsprakenToggleEvents bestaat op jouw site; aanroepen blijft zoals je had
    if (typeof addAfsprakenToggleEvents === "function") {
      addAfsprakenToggleEvents();
    }
  });

// ========= TAB EVENTS =========
document
  .getElementById("nav-behandelingen-tab")
  .addEventListener("shown.bs.tab", function () {
    initBeerSliders();
  });

document.addEventListener("DOMContentLoaded", function () {
  // HOME en CONTACT tab: scroll naar top
  document.getElementById("nav-home-tab").addEventListener("click", function () {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
  });
  document
    .getElementById("nav-contact-tab")
    .addEventListener("click", function () {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
    });
});

// ========= DROPDOWN BEHANDELINGEN POSITIE & SLUITEN =========
document.addEventListener("DOMContentLoaded", function () {
  const behandelingenTab = document.getElementById("nav-behandelingen-tab");
  const dropdown = document.getElementById("behandelingen-dropdown");

  behandelingenTab.addEventListener("click", function () {
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

// ========= UNIVERSELE SCROLL-OFFSET LINKS (FAQ + DROPDOWN + OVERAL) =========
// Werkt voor álle <a class="scroll-offset" href="#..."> links, waar dan ook.
// Optioneel: data-tab="nav-behandelingen-tab" om eerst die tab te openen.
document.addEventListener("click", function (e) {
  const link = e.target.closest("a.scroll-offset");
  if (!link) return;

  // Voorkom directe anchor-jump
  e.preventDefault();

  const href = link.getAttribute("href") || "";
  if (!href.startsWith("#")) return;

  const anchorId = href.slice(1);
  // Standaard openen we de behandelingen-tab, tenzij anders gespecificeerd
  const tabBtnId = link.getAttribute("data-tab") || "nav-behandelingen-tab";

  // Dropdown sluiten indien open
  const dropdown = document.getElementById("behandelingen-dropdown");
  if (dropdown) dropdown.style.display = "none";

  // Tab openen (indien nodig) en daarna scrollen met offset
  openTabThenScroll(tabBtnId, anchorId);
});
