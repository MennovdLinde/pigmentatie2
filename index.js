function navUp() {
  document.getElementById("navbar").classList.add("scrolled-down");
  document.getElementById("navbar").classList.remove("scrolled-up");
  document.getElementById("contentMask").style.height = "120px";
}

function navDown() {
  document.getElementById("navbar").classList.add("scrolled-up");
  document.getElementById("navbar").classList.remove("scrolled-down");
  document.getElementById("contentMask").style.height = "169px";
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (window.innerWidth > 768) {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navUp();
    } else {
      navDown();
    }
  } else {
    navDown();
  }
}

function triggerBtn() {
  var triggetContact = document.getElementById("nav-contact-tab");
  triggetContact.click();
}

function triggerBtn2() {
  var triggetContact = document.getElementById("nav-behandelingen-tab");
  triggetContact.click();
}

document.getElementById("logo").addEventListener("mouseover", function () {
  if (window.innerWidth > 768) {
    navDown();
  }
});

fetch("home.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-home").innerHTML = html;
    initBeerSliders(); // ← voeg dit toe!
  });

  function initBeerSliders() {
    const sliders = document.querySelectorAll(".beer-slider");
  
    sliders.forEach((slider) => {
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
  }
  
  function initializeSlider(slider) {
    if (!slider.classList.contains("beer-loaded")) {
      new BeerSlider(slider);
      slider.classList.add("beer-loaded");
    }
  }
  

fetch("behandelingen.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("nav-behandelingen").innerHTML = html;
  });

fetch("contact.html")
.then((response) => response.text())
.then((html) => {
  document.getElementById("nav-contact").innerHTML = html;
  addAfsprakenToggleEvents();
});
