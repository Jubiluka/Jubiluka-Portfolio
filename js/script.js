const colorButton = document.getElementById("colorButton");
if (colorButton) {
  colorButton.addEventListener("click", () => {
  const colors = ["#fce4ec", "#f3e5f5", "#e3f2fd", "#e8f5e9", "#fff3e0"];
  const random = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = random;
});
}

//PHOTO GALLERY CODE vvv
document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll(".photo-gallery");

  // Create one reusable fullscreen overlay
  const overlay = document.createElement("div");
  overlay.className = "gallery-overlay hidden";
  overlay.innerHTML = `
    <div class="gallery-overlay-content">
      <button class="gallery-arrow left" type="button">&#10094;</button>
      <div class="gallery-overlay-image-wrap">
        <img class="gallery-overlay-image" src="" alt="">
      </div>
      <button class="gallery-arrow right" type="button">&#10095;</button>
      <div class="gallery-overlay-caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector(".gallery-overlay-image");
  const overlayCaption = overlay.querySelector(".gallery-overlay-caption");
  const leftArrow = overlay.querySelector(".gallery-arrow.left");
  const rightArrow = overlay.querySelector(".gallery-arrow.right");
  const overlayContent = overlay.querySelector(".gallery-overlay-content");

  let currentGallery = null;
  let currentIndex = 0;
  let currentScale = 1;

  function updateGalleryDisplay(gallery, index) {
    const images = gallery.querySelectorAll(".gallery-image");
    const captionBox = gallery.querySelector(".gallery-caption");

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    captionBox.textContent = images[index].dataset.caption || "";
    gallery.dataset.currentIndex = index;
  }

  function nextSlide(gallery) {
    const images = gallery.querySelectorAll(".gallery-image");
    let index = parseInt(gallery.dataset.currentIndex || "0", 10);
    index = (index + 1) % images.length;
    updateGalleryDisplay(gallery, index);
  }

  function prevOverlaySlide() {
    if (!currentGallery) return;
    const images = currentGallery.querySelectorAll(".gallery-image");
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateOverlaySlide();
  }

  function nextOverlaySlide() {
    if (!currentGallery) return;
    const images = currentGallery.querySelectorAll(".gallery-image");
    currentIndex = (currentIndex + 1) % images.length;
    updateOverlaySlide();
  }

  function updateOverlaySlide() {
    const images = currentGallery.querySelectorAll(".gallery-image");
    const active = images[currentIndex];

    overlayImg.src = active.src;
    overlayImg.alt = active.alt;
    overlayCaption.textContent = active.dataset.caption || "";
    currentScale = 1;
    overlayImg.style.transform = `scale(${currentScale})`;
  }

  function openOverlay(gallery) {
    currentGallery = gallery;
    currentIndex = parseInt(gallery.dataset.currentIndex || "0", 10);

    clearInterval(gallery._intervalId); // stop auto-rotation while fullscreen
    updateOverlaySlide();
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay() {
    if (!currentGallery) return;

    overlay.classList.add("hidden");
    document.body.style.overflow = "";

    startAutoRotate(currentGallery);
    currentGallery = null;
  }

  function startAutoRotate(gallery) {
    const images = gallery.querySelectorAll(".gallery-image");
    if (images.length <= 1) return;

    clearInterval(gallery._intervalId);
    const interval = parseInt(gallery.dataset.interval || "3000", 10);

    gallery._intervalId = setInterval(() => {
      nextSlide(gallery);
    }, interval);
  }

  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll(".gallery-image");
    if (!images.length) return;

    gallery.dataset.currentIndex = "0";
    updateGalleryDisplay(gallery, 0);
    startAutoRotate(gallery);

    gallery.addEventListener("click", () => openOverlay(gallery));
  });

  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    prevOverlaySlide();
  });

  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    nextOverlaySlide();
  });

  overlayContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  overlay.addEventListener("click", () => {
    closeOverlay();
  });

  document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("hidden")) return;

    if (e.key === "Escape") closeOverlay();
    if (e.key === "ArrowLeft") prevOverlaySlide();
    if (e.key === "ArrowRight") nextOverlaySlide();
  });

  overlay.addEventListener("wheel", (e) => {
    if (overlay.classList.contains("hidden")) return;

    e.preventDefault();

    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    currentScale = Math.min(Math.max(1, currentScale + delta), 4);
    overlayImg.style.transform = `scale(${currentScale})`;
  }, { passive: false });
});
