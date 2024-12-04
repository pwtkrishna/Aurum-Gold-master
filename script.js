"use strict";

// navigation for mobile devices
function toggleMenu() {
  const menu = document.querySelector(".nav-menu");
  menu.classList.toggle("active");
}

// Universal Slider Function
const slider = function (
  containerSelector,
  dotSelector,
  btnLeftSelector,
  btnRightSelector
) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container ${containerSelector} not found.`);
    return;
  }

  const slides = container.querySelectorAll(
    ".slide, .little-extra-circle-container, .category"
  );
  const btnLeft = container.querySelector(btnLeftSelector);
  const btnRight = container.querySelector(btnRightSelector);
  const dotContainer = container.querySelector(dotSelector);

  if (!slides.length) {
    console.error(`No slides found in container ${containerSelector}.`);
    return;
  }

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    if (!dotContainer) return;
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    if (!dotContainer) return;
    dotContainer
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    const activeDot = dotContainer.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    if (activeDot) activeDot.classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    curSlide = (curSlide + 1) % maxSlide;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    curSlide = (curSlide - 1 + maxSlide) % maxSlide;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0); // Initialize active dot
  };

  init();

  // Event handlers
  if (btnRight) btnRight.addEventListener("click", nextSlide);
  if (btnLeft) btnLeft.addEventListener("click", prevSlide);

  if (dotContainer) {
    dotContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("dots__dot")) {
        curSlide = Number(e.target.dataset.slide);
        goToSlide(curSlide);
        activateDot(curSlide);
      }
    });
  }

  // Auto slide (optional, uncomment if needed)
  // setInterval(nextSlide, 4000);
};

slider(
  ".main-slider-container .slider-container",
  ".dots",
  ".slider__btn--left",
  ".slider__btn--right"
);

// slider(
//   ".little-extra__container",
//   ".dots",
//   ".little-extra-slider__btn.slider__btn--left",
//   ".little-extra-slider__btn.slider__btn--right"
// );

// slider(
//   ".categories-container",
//   ".dots",
//   ".little-extra-slider__btn.slider__btn--left",
//   ".little-extra-slider__btn.slider__btn--right"
// );

// for our products slider
document.addEventListener("DOMContentLoaded", () => {
  const sliderTrack = document.querySelector(".slider-track");
  const prevButton = document.querySelector(".slider-button.prev");
  const nextButton = document.querySelector(".slider-button.next");
  const productCards = document.querySelectorAll(".product-card");
  let slideIndex = 0;
  const totalSlides = productCards.length;
  const slideWidth = productCards[0].offsetWidth + 12; // 12px for the gap

  // Clone the first few cards and append them to the end for infinite loop effect
  const cardsToClone = Array.from(productCards).slice(0, 3);
  cardsToClone.forEach((card) => {
    const clone = card.cloneNode(true);
    sliderTrack.appendChild(clone);
  });

  function slide(direction) {
    if (direction === "next") {
      slideIndex++;
      if (slideIndex >= totalSlides) {
        slideIndex = 0;
        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(0)`;
        setTimeout(() => {
          sliderTrack.style.transition = "transform 0.3s ease-in-out";
        }, 10);
      }
    } else {
      if (slideIndex <= 0) {
        slideIndex = totalSlides - 1;
        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(-${
          slideIndex * slideWidth
        }px)`;
        setTimeout(() => {
          sliderTrack.style.transition = "transform 0.3s ease-in-out";
        }, 10);
      }
      slideIndex--;
    }
    sliderTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
  }

  nextButton.addEventListener("click", () => slide("next"));
  prevButton.addEventListener("click", () => slide("prev"));

  // Auto-slide functionality
  let autoSlideInterval = setInterval(() => slide("next"), 3000);

  // Pause auto-slide on hover
  sliderTrack.addEventListener("mouseenter", () =>
    clearInterval(autoSlideInterval)
  );
  sliderTrack.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(() => slide("next"), 3000);
  });

  // Responsive slider
  function updateSliderDimensions() {
    const newSlideWidth = productCards[0].offsetWidth + 12;
    sliderTrack.style.transform = `translateX(-${
      slideIndex * newSlideWidth
    }px)`;
  }

  window.addEventListener("resize", updateSliderDimensions);
});

const menu = document.querySelector(".nav-menu");
const overlay = document.querySelector(".overlay");
const menuBtn = document.querySelector(".mobile-menu-btn");

function toggleMenu() {
  menu.classList.toggle("active");
  overlay.classList.toggle("active");

  if (menu.classList.contains("active")) {
    menuBtn.innerHTML = "✕";
    document.body.style.overflow = "hidden";
  } else {
    menuBtn.innerHTML = "☰";
    document.body.style.overflow = "";
  }
}

function closeMenu() {
  menu.classList.remove("active");
  overlay.classList.remove("active");
  menuBtn.innerHTML = "☰";
  document.body.style.overflow = "";
}

// Close menu when clicking overlay
overlay.addEventListener("click", closeMenu);

// Close menu when clicking any link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    closeMenu();
    // If you want to navigate to the link's href after closing the menu:
    setTimeout(() => {
      window.location = link.href;
    }, 300);
  });
});

// Close menu when pressing Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("active")) {
    closeMenu();
  }
});

// Sticky header functionality
const header = document.querySelector(".header");
const headerHeight = header.offsetHeight;
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > headerHeight) {
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      header.classList.add("sticky");
      document.body.classList.add("sticky-padding");
    } else {
      // Scrolling up
      header.classList.add("sticky");
      document.body.classList.add("sticky-padding");
    }
  } else {
    header.classList.remove("sticky");
    document.body.classList.remove("sticky-padding");
  }

  lastScrollTop = scrollTop;
});
