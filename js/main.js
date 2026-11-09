const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const dock = document.querySelector(".call-dock");

const syncDock = () => {
  dock.classList.toggle("is-visible", window.scrollY > 520);
};
syncDock();
window.addEventListener("scroll", syncDock, { passive: true });

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Otwórz menu");
  });
});

const shots = [...document.querySelectorAll(".shot[data-full]")];
const box = document.querySelector(".lightbox");
const photo = box.querySelector("img");
const caption = box.querySelector("figcaption");
let index = 0;
let lastFocus = null;

function show(next) {
  index = (next + shots.length) % shots.length;
  const shot = shots[index];
  photo.src = shot.dataset.full;
  photo.alt = shot.querySelector("img").alt;
  caption.textContent = shot.dataset.caption;
  if (box.hidden) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add("is-locked");
    box.querySelector(".lightbox-close").focus();
  }
}

function hide() {
  box.hidden = true;
  document.body.classList.remove("is-locked");
  photo.removeAttribute("src");
  if (lastFocus) lastFocus.focus();
}

let dragged = false;

shots.forEach((shot, i) => {
  shot.addEventListener("click", () => {
    if (dragged) {
      dragged = false;
      return;
    }
    show(i);
  });
});

const carousel = document.querySelector(".carousel");
if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".shot")];
  const dots = carousel.querySelector(".carousel-dots");
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", "Zdjęcie " + (i + 1));
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  function go(next) {
    current = (next + slides.length) % slides.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dots.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("is-on", i === current);
    });
  }

  carousel.querySelector(".carousel-prev").addEventListener("click", () => go(current - 1));
  carousel.querySelector(".carousel-next").addEventListener("click", () => go(current + 1));

  let startX = null;
  carousel.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".carousel-prev, .carousel-next, .carousel-dot")) return;
    startX = event.clientX;
  });
  carousel.addEventListener("pointerup", (event) => {
    if (startX == null) return;
    const delta = event.clientX - startX;
    startX = null;
    if (Math.abs(delta) < 50) return;
    dragged = true;
    go(current + (delta < 0 ? 1 : -1));
  });

  go(0);
}

box.querySelector(".lightbox-close").addEventListener("click", hide);
box.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
box.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));
box.addEventListener("click", (event) => {
  if (event.target === box) hide();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
  if (box.hidden) return;
  if (event.key === "Escape") hide();
  if (event.key === "ArrowRight") show(index + 1);
  if (event.key === "ArrowLeft") show(index - 1);
});
